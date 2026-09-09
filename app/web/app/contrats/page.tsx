"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, ApiRequestError, type Contract } from "../../lib/api";

export default function ContratsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [invoicedIds, setInvoicedIds] = useState<Set<string>>(new Set());
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ contracts: Contract[] }>("/api/contracts/mine");
      setContracts(data.contracts);
    } catch {
      setContracts([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function sign(id: string) {
    setBusyId(id);
    try {
      await apiFetch(`/api/contracts/${id}/sign`, { method: "POST" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function generateInvoice(contractId: string) {
    setBusyId(contractId);
    setInvoiceError(null);
    try {
      await apiFetch("/api/invoices", { method: "POST", body: JSON.stringify({ contractId }) });
      setInvoicedIds((s) => new Set(s).add(contractId));
      router.push("/factures");
    } catch (err) {
      setInvoiceError(
        err instanceof ApiRequestError && err.code === "INVOICE_ALREADY_EXISTS"
          ? "Une facture existe déjà pour ce contrat."
          : "Impossible de générer la facture.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <main className="container">
        <Link href="/">← Accueil</Link>
        <section className="section">
          <h1>📄 Contrats & signature</h1>
          <p className="muted"><Link href="/login">Connectez-vous</Link> pour voir vos contrats.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>📄 Contrats & signature</h1>
        <p className="muted">
          Signature interne horodatée, à valeur probatoire limitée — pas une signature électronique qualifiée.
        </p>
        {invoiceError && <p className="muted">{invoiceError}</p>}
      </section>

      {contracts === null && <p className="muted">Chargement…</p>}
      {contracts?.length === 0 && <p className="muted">Aucun contrat pour le moment. Un contrat se génère depuis une offre acceptée ou une capacité.</p>}

      <div className="grid">
        {contracts?.map((c) => {
          const isOwner = c.ownerId === user.id;
          const alreadySigned = isOwner ? c.ownerSignedAt : c.counterpartySignedAt;
          const canInvoice = !isOwner && c.status === "FULLY_SIGNED" && !invoicedIds.has(c.id);
          return (
            <article className="card" key={c.id}>
              <span className="tag">{c.type}</span>
              <span className="tag">{c.status}</span>
              <p className="price">{c.price} €</p>
              <p className="muted">Rôle : {isOwner ? "Donneur d'ordre" : "Prestataire"}</p>
              {c.status !== "FULLY_SIGNED" && c.status !== "CANCELLED" && !alreadySigned && (
                <button className="btn" disabled={busyId === c.id} onClick={() => sign(c.id)}>
                  {busyId === c.id ? "…" : "Signer le contrat"}
                </button>
              )}
              {alreadySigned && <p className="muted">✅ Signé de votre part</p>}
              {canInvoice && (
                <button className="btn secondary" disabled={busyId === c.id} onClick={() => generateInvoice(c.id)}>
                  {busyId === c.id ? "…" : "🧾 Générer la facture"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
