"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../lib/auth-context";
import { apiFetch, ApiRequestError, type Mission, type MissionOffer } from "../lib/api";

export function MissionActions({ mission }: { mission: Mission }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="section card">
        <p className="muted">Chargement…</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section card">
        <p className="muted">
          <Link href="/login">Connectez-vous</Link> pour faire une offre ou gérer cette mission.
        </p>
      </section>
    );
  }

  if (user.id === mission.ownerId) {
    return <OwnerOffers mission={mission} />;
  }

  if (user.role === "TRANSPORTEUR") {
    return <OfferForm mission={mission} />;
  }

  return (
    <section className="section card">
      <p className="muted">Seuls les transporteurs peuvent faire une offre sur cette mission.</p>
    </section>
  );
}

function OwnerOffers({ mission }: { mission: Mission }) {
  const [offers, setOffers] = useState<MissionOffer[] | null>(null);
  const [busyOfferId, setBusyOfferId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ offers: MissionOffer[] }>(`/api/missions/${mission.id}/offers`);
      setOffers(data.offers);
    } catch {
      setError("Impossible de charger les offres.");
    }
  }, [mission.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function accept(offerId: string) {
    setBusyOfferId(offerId);
    setError(null);
    try {
      await apiFetch(`/api/missions/${mission.id}/offers/${offerId}/accept`, { method: "POST" });
      await load();
    } catch {
      setError("Impossible d'accepter cette offre.");
    } finally {
      setBusyOfferId(null);
    }
  }

  return (
    <section className="section card">
      <h2>Offres reçues</h2>
      {error && <p className="muted">{error}</p>}
      {offers === null && <p className="muted">Chargement…</p>}
      {offers?.length === 0 && <p className="muted">Aucune offre reçue pour le moment.</p>}
      {offers?.map((offer) => (
        <article className="card" key={offer.id} style={{ marginTop: 12 }}>
          <p>
            <b>{offer.provider?.name}</b> · <span className="price">{offer.price} €</span>
          </p>
          {offer.message && <p className="muted">{offer.message}</p>}
          <p className="tag">{offer.status}</p>
          {offer.status === "PENDING" && mission.status === "PUBLISHED" && (
            <button className="btn" disabled={busyOfferId === offer.id} onClick={() => accept(offer.id)}>
              {busyOfferId === offer.id ? "…" : "Accepter cette offre"}
            </button>
          )}
        </article>
      ))}
    </section>
  );
}

function OfferForm({ mission }: { mission: Mission }) {
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (mission.status !== "PUBLISHED") {
    return (
      <section className="section card">
        <p className="muted">Cette mission n'accepte plus d'offres.</p>
      </section>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    setErrorMessage(null);
    try {
      await apiFetch(`/api/missions/${mission.id}/offers`, {
        method: "POST",
        body: JSON.stringify({ price: Number(price), message: message || undefined }),
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiRequestError && err.code === "OFFER_ALREADY_SUBMITTED") {
        setErrorMessage("Vous avez déjà fait une offre sur cette mission.");
      } else {
        setErrorMessage("Impossible d'envoyer l'offre pour le moment.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "sent") {
    return (
      <section className="section card">
        <p>✅ Votre offre a été envoyée au donneur d'ordre.</p>
      </section>
    );
  }

  return (
    <section className="section card">
      <h2>Faire une offre</h2>
      <form className="form" onSubmit={onSubmit}>
        <input
          className="input"
          type="number"
          min="1"
          placeholder="Votre prix (€)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <textarea
          className="textarea"
          placeholder="Conditions ou message au client"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {errorMessage && <p className="muted">{errorMessage}</p>}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Envoi…" : "Envoyer l'offre"}
        </button>
      </form>
    </section>
  );
}
