import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { einvoicingProvider } from "../utils/einvoicing.js";

export const invoicesRouter = Router();

const generateInvoiceSchema = z.object({
  contractId: z.string().min(1),
  taxRate: z.coerce.number().min(0).max(1).optional().default(0),
  dueDate: z.coerce.date().optional(),
});

async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({ where: { number: { startsWith: `JT-${year}-` } } });
  return `JT-${year}-${String(count + 1).padStart(6, "0")}`;
}

// The counterparty (service provider on the contract) bills the owner
// (donneur d'ordre) once the contract is fully signed — mirrors the real
// billing direction, not just "either party".
invoicesRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = generateInvoiceSchema.parse(req.body);
    const contract = await prisma.contract.findUnique({ where: { id: body.contractId } });
    if (!contract) throw new ApiError(404, "CONTRACT_NOT_FOUND");
    if (contract.counterpartyId !== req.user!.id) {
      throw new ApiError(403, "FORBIDDEN", "Seul le prestataire (contrepartie) peut émettre la facture.");
    }
    if (contract.status !== "FULLY_SIGNED") {
      throw new ApiError(409, "CONTRACT_NOT_SIGNED", "Le contrat doit être signé par les deux parties.");
    }
    const existing = await prisma.invoice.findFirst({ where: { contractId: contract.id, status: { not: "CANCELLED" } } });
    if (existing) throw new ApiError(409, "INVOICE_ALREADY_EXISTS");

    const subtotal = contract.price;
    const taxAmount = subtotal * body.taxRate;
    const total = subtotal + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        number: await nextInvoiceNumber(),
        contractId: contract.id,
        issuerId: contract.counterpartyId,
        recipientId: contract.ownerId,
        subtotal,
        taxRate: body.taxRate,
        taxAmount,
        total,
        dueDate: body.dueDate,
        status: "SENT",
        lines: {
          create: [
            {
              description: `Contrat ${contract.type} — ${contract.id}`,
              quantity: 1,
              unitPrice: contract.price,
              amount: contract.price,
            },
          ],
        },
      },
      include: { lines: true },
    });

    res.status(201).json({ invoice });
  }),
);

invoicesRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const invoices = await prisma.invoice.findMany({
      where: { OR: [{ issuerId: req.user!.id }, { recipientId: req.user!.id }] },
      orderBy: { createdAt: "desc" },
    });
    res.json({ invoices });
  }),
);

async function requireParty(invoiceId: string, userId: string) {
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { lines: true } });
  if (!invoice) throw new ApiError(404, "INVOICE_NOT_FOUND");
  if (invoice.issuerId !== userId && invoice.recipientId !== userId) throw new ApiError(403, "FORBIDDEN");
  return invoice;
}

invoicesRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const invoice = await requireParty(req.params.id, req.user!.id);
    res.json({ invoice });
  }),
);

// Manual reconciliation — real online payment collection is a later phase
// (adapter seam: PaymentProviderAdapter). The issuer marks their own
// invoice paid once they've actually been paid by another channel.
invoicesRouter.post(
  "/:id/mark-paid",
  requireAuth,
  asyncHandler(async (req, res) => {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) throw new ApiError(404, "INVOICE_NOT_FOUND");
    if (invoice.issuerId !== req.user!.id) throw new ApiError(403, "FORBIDDEN");
    if (invoice.status === "PAID") throw new ApiError(409, "ALREADY_PAID");

    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "PAID", paidAt: new Date() },
    });
    res.json({ invoice: updated });
  }),
);

// Attempts real e-invoicing transmission. With no certified platform wired
// in yet, this always reports FAILED — see src/utils/einvoicing.ts. Never
// silently pretend this succeeded.
invoicesRouter.post(
  "/:id/transmit",
  requireAuth,
  asyncHandler(async (req, res) => {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) throw new ApiError(404, "INVOICE_NOT_FOUND");
    if (invoice.issuerId !== req.user!.id) throw new ApiError(403, "FORBIDDEN");

    const result = await einvoicingProvider.transmit({ invoiceId: invoice.id });
    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { eInvoicingStatus: result.status, eInvoicingProvider: result.provider },
    });
    res.json({ invoice: updated, transmission: result });
  }),
);
