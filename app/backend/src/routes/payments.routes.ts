import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { PAYMENT_METHODS, PAYMENT_PURPOSES, PLATFORM_COMMISSION_RATE, PLATFORM_WALLET_OWNER_ID } from "../domain.js";
import { cardProvider, computeCommission } from "../utils/payments.js";
import { creditWallet, debitWallet, getOrCreateWallet } from "../utils/wallet.js";

export const paymentsRouter = Router();

// ---- Wallet -----------------------------------------------------------

paymentsRouter.get(
  "/wallet",
  requireAuth,
  asyncHandler(async (req, res) => {
    const wallet = await prisma.$transaction((tx) => getOrCreateWallet(tx, req.user!.id));
    res.json({ wallet: { balance: wallet.balance, currency: wallet.currency } });
  }),
);

const topupSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.string().optional().default("EUR"),
  idempotencyKey: z.string().min(1).optional(),
});

// A wallet top-up is only ever settled by real money arriving via bank
// transfer — it is created PENDING and only credited once an admin
// confirms the transfer actually landed (never on request creation).
paymentsRouter.post(
  "/wallet/topups",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = topupSchema.parse(req.body);
    const idempotencyKey = body.idempotencyKey ?? randomUUID();

    const existing = await prisma.payment.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.payerId !== req.user!.id) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
      return res.status(200).json({ payment: existing });
    }

    const payment = await prisma.payment.create({
      data: {
        idempotencyKey,
        payerId: req.user!.id,
        purpose: "WALLET_TOPUP",
        method: "VIREMENT",
        amount: body.amount,
        currency: body.currency,
        commissionAmount: 0,
        netAmount: body.amount,
        status: "PENDING",
      },
    });
    res.status(201).json({ payment });
  }),
);

paymentsRouter.post(
  "/wallet/topups/:id/confirm",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!payment || payment.purpose !== "WALLET_TOPUP") throw new ApiError(404, "PAYMENT_NOT_FOUND");
    if (payment.status !== "PENDING") throw new ApiError(409, "PAYMENT_NOT_PENDING");

    const updated = await prisma.$transaction(async (tx) => {
      await creditWallet(tx, payment.payerId, payment.amount, "TOPUP", payment.id);
      return tx.payment.update({ where: { id: payment.id }, data: { status: "SUCCEEDED" } });
    });
    res.json({ payment: updated });
  }),
);

// ---- Payment intents ----------------------------------------------------

const intentSchema = z.object({
  invoiceId: z.string().min(1),
  method: z.enum(PAYMENT_METHODS),
  purpose: z.enum(PAYMENT_PURPOSES).optional().default("TRANSPORT"),
  idempotencyKey: z.string().min(1).optional(),
});

async function requireInvoiceRecipient(invoiceId: string, userId: string) {
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new ApiError(404, "INVOICE_NOT_FOUND");
  if (invoice.recipientId !== userId) throw new ApiError(403, "FORBIDDEN", "Seul le destinataire de la facture peut la payer.");
  return invoice;
}

paymentsRouter.post(
  "/intents",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = intentSchema.parse(req.body);
    const idempotencyKey = body.idempotencyKey ?? randomUUID();

    const existing = await prisma.payment.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.payerId !== req.user!.id) throw new ApiError(409, "IDEMPOTENCY_KEY_REUSED");
      return res.status(200).json({ payment: existing });
    }

    const invoice = await requireInvoiceRecipient(body.invoiceId, req.user!.id);
    if (invoice.status === "PAID") throw new ApiError(409, "INVOICE_ALREADY_PAID");

    const { commissionAmount, netAmount } = computeCommission(invoice.total, PLATFORM_COMMISSION_RATE);

    if (body.method === "CARD") {
      const result = await cardProvider.charge({ amount: invoice.total, currency: invoice.currency });
      const payment = await prisma.payment.create({
        data: {
          idempotencyKey,
          payerId: req.user!.id,
          invoiceId: invoice.id,
          purpose: body.purpose,
          method: "CARD",
          amount: invoice.total,
          currency: invoice.currency,
          commissionAmount,
          netAmount,
          status: result.status,
          failureReason: result.status === "FAILED" ? result.failureReason : undefined,
        },
      });
      return res.status(201).json({ payment });
    }

    if (body.method === "VIREMENT") {
      const payment = await prisma.payment.create({
        data: {
          idempotencyKey,
          payerId: req.user!.id,
          invoiceId: invoice.id,
          purpose: body.purpose,
          method: "VIREMENT",
          amount: invoice.total,
          currency: invoice.currency,
          commissionAmount,
          netAmount,
          status: "PENDING",
        },
      });
      return res.status(201).json({ payment });
    }

    // WALLET: real, immediate settlement against JTransport's own ledger.
    try {
      const payment = await prisma.$transaction(async (tx) => {
        await debitWallet(tx, req.user!.id, invoice.total, "PAYMENT", undefined);
        const created = await tx.payment.create({
          data: {
            idempotencyKey,
            payerId: req.user!.id,
            invoiceId: invoice.id,
            purpose: body.purpose,
            method: "WALLET",
            amount: invoice.total,
            currency: invoice.currency,
            commissionAmount,
            netAmount,
            status: "SUCCEEDED",
          },
        });
        await creditWallet(tx, invoice.issuerId, netAmount, "REVERSEMENT", created.id);
        await creditWallet(tx, PLATFORM_WALLET_OWNER_ID, commissionAmount, "COMMISSION", created.id, "PLATFORM");
        await tx.invoice.update({ where: { id: invoice.id }, data: { status: "PAID", paidAt: new Date() } });
        return created;
      });
      return res.status(201).json({ payment });
    } catch (err) {
      if (err instanceof Error && err.message === "INSUFFICIENT_FUNDS") {
        const payment = await prisma.payment.create({
          data: {
            idempotencyKey,
            payerId: req.user!.id,
            invoiceId: invoice.id,
            purpose: body.purpose,
            method: "WALLET",
            amount: invoice.total,
            currency: invoice.currency,
            commissionAmount,
            netAmount,
            status: "FAILED",
            failureReason: "INSUFFICIENT_FUNDS",
          },
        });
        return res.status(201).json({ payment });
      }
      throw err;
    }
  }),
);

async function requirePaymentReceiver(paymentId: string, userId: string, role: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { invoice: true } });
  if (!payment) throw new ApiError(404, "PAYMENT_NOT_FOUND");
  const isReceiver = payment.invoice?.issuerId === userId;
  if (!isReceiver && role !== "ADMIN") throw new ApiError(403, "FORBIDDEN");
  return payment;
}

// Only meaningful for VIREMENT: the invoice issuer confirms the wire they
// actually received arrived, mirroring Invoice's own mark-paid honesty
// rule. WALLET settles instantly in /intents and CARD never reaches
// PENDING, so both are rejected here.
paymentsRouter.post(
  "/:id/confirm",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payment = await requirePaymentReceiver(req.params.id, req.user!.id, req.user!.role);
    if (payment.method !== "VIREMENT") throw new ApiError(409, "CONFIRM_NOT_APPLICABLE");
    if (payment.status !== "PENDING") throw new ApiError(409, "PAYMENT_NOT_PENDING");

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.payment.update({ where: { id: payment.id }, data: { status: "SUCCEEDED" } });
      if (payment.invoiceId) {
        await tx.invoice.update({ where: { id: payment.invoiceId }, data: { status: "PAID", paidAt: new Date() } });
      }
      return result;
    });
    res.json({ payment: updated });
  }),
);

const refundSchema = z.object({
  amount: z.coerce.number().positive(),
  reason: z.string().optional(),
});

paymentsRouter.post(
  "/:id/refunds",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = refundSchema.parse(req.body);
    const payment = await requirePaymentReceiver(req.params.id, req.user!.id, req.user!.role);
    if (payment.status !== "SUCCEEDED" && payment.status !== "PARTIALLY_REFUNDED") {
      throw new ApiError(409, "PAYMENT_NOT_REFUNDABLE");
    }
    const already = await prisma.paymentRefund.aggregate({
      where: { paymentId: payment.id, status: { in: ["SUCCEEDED", "PENDING_EXTERNAL"] } },
      _sum: { amount: true },
    });
    const refundedSoFar = already._sum.amount ?? 0;
    const remaining = Math.round((payment.amount - refundedSoFar) * 100) / 100;
    if (body.amount > remaining) throw new ApiError(409, "REFUND_EXCEEDS_REMAINING");

    if (payment.method !== "WALLET") {
      // No real bank connection: this records the decision, the actual
      // reversal happens outside JTransport.
      const refund = await prisma.paymentRefund.create({
        data: { paymentId: payment.id, amount: body.amount, reason: body.reason, status: "PENDING_EXTERNAL" },
      });
      const newStatus = body.amount === remaining ? "PARTIALLY_REFUNDED" : "PARTIALLY_REFUNDED";
      await prisma.payment.update({ where: { id: payment.id }, data: { status: newStatus } });
      return res.status(201).json({ refund });
    }

    const ratio = body.amount / payment.amount;
    const commissionReversal = Math.round(payment.commissionAmount * ratio * 100) / 100;
    const netReversal = Math.round((body.amount - commissionReversal) * 100) / 100;

    try {
      const refund = await prisma.$transaction(async (tx) => {
        await debitWallet(tx, payment.invoice!.issuerId, netReversal, "REFUND", payment.id);
        await debitWallet(tx, PLATFORM_WALLET_OWNER_ID, commissionReversal, "REFUND", payment.id);
        await creditWallet(tx, payment.payerId, body.amount, "REFUND", payment.id);
        const created = await tx.paymentRefund.create({
          data: { paymentId: payment.id, amount: body.amount, reason: body.reason, status: "SUCCEEDED" },
        });
        const fullyRefunded = refundedSoFar + body.amount >= payment.amount;
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: fullyRefunded ? "REFUNDED" : "PARTIALLY_REFUNDED" },
        });
        return created;
      });
      return res.status(201).json({ refund });
    } catch (err) {
      if (err instanceof Error && err.message === "INSUFFICIENT_FUNDS") {
        const refund = await prisma.paymentRefund.create({
          data: { paymentId: payment.id, amount: body.amount, reason: body.reason, status: "FAILED" },
        });
        return res.status(409).json({ refund, error: "INSUFFICIENT_ISSUER_BALANCE" });
      }
      throw err;
    }
  }),
);

paymentsRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payments = await prisma.payment.findMany({
      where: {
        OR: [{ payerId: req.user!.id }, { invoice: { issuerId: req.user!.id } }],
      },
      include: { refunds: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ payments });
  }),
);

paymentsRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { refunds: true, invoice: true },
    });
    if (!payment) throw new ApiError(404, "PAYMENT_NOT_FOUND");
    const allowed =
      payment.payerId === req.user!.id || payment.invoice?.issuerId === req.user!.id || req.user!.role === "ADMIN";
    if (!allowed) throw new ApiError(403, "FORBIDDEN");
    res.json({ payment });
  }),
);
