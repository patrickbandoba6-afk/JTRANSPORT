"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Contract } from "../../lib/api";

export default function ContratsPage() {
  const { user, loading: authLoading } = useAuth();
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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
      </section>

      {contracts === null && <p className="muted">Chargement…</p>}
      {contracts?.length === 0 && <p className="muted">Aucun contrat pour le moment. Un contrat se génère depuis une offre acceptée sur une mission.</p>}

      <div className="grid">
        {contracts?.map((c) => {
          const isOwner = c.ownerId === user.id;
          const alreadySigned = isOwner ? c.ownerSignedAt : c.counterpartySignedAt;
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
            </article>
          );
        })}
      </div>
    </main>
  );
}
