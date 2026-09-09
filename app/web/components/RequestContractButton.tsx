"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../lib/auth-context";
import { apiFetch, ApiRequestError, type Contract } from "../lib/api";

export function RequestContractButton({ capacityId }: { capacityId: string }) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (loading) return null;
  if (!user) {
    return <Link className="btn secondary" href="/login">Se connecter pour contracter</Link>;
  }

  if (done) return <p className="muted">✅ Demande envoyée — voir <Link href="/contrats">mes contrats</Link>.</p>;

  if (!open) {
    return (
      <button className="btn secondary" onClick={() => setOpen(true)}>
        Demander un contrat
      </button>
    );
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch<{ contract: Contract }>("/api/contracts", {
        method: "POST",
        body: JSON.stringify({ capacityId, price: Number(price), type: "MISE_A_DISPOSITION" }),
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiRequestError && err.code === "CANNOT_CONTRACT_OWN_CAPACITY"
          ? "Vous ne pouvez pas contracter votre propre capacité."
          : "Impossible d'envoyer la demande.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form" style={{ marginTop: 8 }}>
      <input
        className="input"
        type="number"
        placeholder="Prix proposé (€)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {error && <p className="muted">{error}</p>}
      <button className="btn" onClick={submit} disabled={submitting || !price}>
        {submitting ? "Envoi…" : "Envoyer la demande"}
      </button>
    </div>
  );
}
