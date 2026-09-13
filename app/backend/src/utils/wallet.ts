import type { Prisma } from "@prisma/client";
import { PLATFORM_WALLET_OWNER_ID } from "../domain.js";

// A prisma client OR an active $transaction client — every ledger
// operation must run inside a transaction so a balance read-then-write is
// never racy.
type Tx = Prisma.TransactionClient;

export async function getOrCreateWallet(tx: Tx, ownerId: string, ownerType: "USER" | "PLATFORM" = "USER") {
  const existing = await tx.walletAccount.findUnique({ where: { ownerId } });
  if (existing) return existing;
  return tx.walletAccount.create({ data: { ownerId, ownerType } });
}

export function getOrCreatePlatformWallet(tx: Tx) {
  return getOrCreateWallet(tx, PLATFORM_WALLET_OWNER_ID, "PLATFORM");
}

// Throws INSUFFICIENT_FUNDS rather than letting the balance go negative —
// callers decide whether that means "fail the payment" or "fail the
// refund", but the ledger itself never lies about money it doesn't have.
export async function debitWallet(
  tx: Tx,
  ownerId: string,
  amount: number,
  reason: string,
  paymentId?: string,
) {
  const wallet = await getOrCreateWallet(tx, ownerId);
  if (wallet.balance < amount) {
    throw new Error("INSUFFICIENT_FUNDS");
  }
  const balanceAfter = Math.round((wallet.balance - amount) * 100) / 100;
  await tx.walletAccount.update({ where: { id: wallet.id }, data: { balance: balanceAfter } });
  await tx.walletEntry.create({
    data: { walletAccountId: wallet.id, type: "DEBIT", amount, balanceAfter, reason, paymentId },
  });
  return balanceAfter;
}

export async function creditWallet(
  tx: Tx,
  ownerId: string,
  amount: number,
  reason: string,
  paymentId?: string,
  ownerType: "USER" | "PLATFORM" = "USER",
) {
  const wallet = await getOrCreateWallet(tx, ownerId, ownerType);
  const balanceAfter = Math.round((wallet.balance + amount) * 100) / 100;
  await tx.walletAccount.update({ where: { id: wallet.id }, data: { balance: balanceAfter } });
  await tx.walletEntry.create({
    data: { walletAccountId: wallet.id, type: "CREDIT", amount, balanceAfter, reason, paymentId },
  });
  return balanceAfter;
}
