"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Invoice } from "../../lib/api";

export default function FacturesPage() {
  const { user, loading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ invoices: Invoice[] }>("/api/invoices/mine");
      setInvoices(data.invoices);
    } catch {
      setInvoices([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function markPaid(id: string) {
    setBusyId(id);
    try {
      await apiFetch(`/api/invoices/${id}/mark-paid`, { method: "POST" });
      await load();
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
          <h1>🧾 Mes factures</h1>
          <p className="muted"><Link href="/login">Connectez-vous</Link> pour voir vos factures.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>🧾 Mes factures</h1>
        {invoices?.length === 0 && <p className="muted">Aucune facture pour le moment.</p>}
      </section>

      <div className="grid">
        {invoices?.map((inv) => {
          const isIssuer = inv.issuerId === user.id;
          return (
            <article className="card" key={inv.id}>
              <span className="tag">{inv.status}</span>
              <h3>{inv.number}</h3>
              <p className="price">{inv.total.toFixed(2)} {inv.currency}</p>
              <p className="muted">{isIssuer ? "Vous émettez" : "Vous recevez"}</p>
              {inv.lines?.map((l) => (
                <p key={l.id} className="muted">{l.description} — {l.amount.toFixed(2)} €</p>
              ))}
              {inv.taxRate > 0 && <p className="muted">TVA {(inv.taxRate * 100).toFixed(0)}% : {inv.taxAmount.toFixed(2)} €</p>}
              {inv.eInvoicingStatus === "FAILED" && (
                <p className="muted">Transmission plateforme agréée : non connectée</p>
              )}
              {isIssuer && inv.status !== "PAID" && (
                <button className="btn secondary" disabled={busyId === inv.id} onClick={() => markPaid(inv.id)}>
                  {busyId === inv.id ? "…" : "Marquer payée"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
