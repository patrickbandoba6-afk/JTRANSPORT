"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Shipment } from "../../lib/api";

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Créée",
  COLLECTED: "Collectée",
  AT_WAREHOUSE: "En entrepôt",
  GROUPED: "Groupée",
  IN_CONTAINER: "En conteneur",
  LOADED: "Chargée",
  DEPARTED: "Partie",
  IN_TRANSIT: "En transit",
  ARRIVED: "Arrivée",
  CUSTOMS: "En douane",
  CUSTOMS_CLEARED: "Dédouanée",
  OUT_FOR_DELIVERY: "En livraison",
  DELIVERED: "Livrée",
  INCIDENT: "Incident",
  CANCELLED: "Annulée",
};

export default function ExpeditionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [form, setForm] = useState({
    originCity: "", originCountry: "FR",
    destinationCity: "", destinationCountry: "FR",
    recipientName: "", recipientPhone: "", recipientEmail: "", recipientAddress: "",
    description: "", weightKg: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ shipments: Shipment[] }>("/api/shipments/mine");
      setShipments(data.shipments);
    } catch {
      setShipments([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await apiFetch<{ shipment: Shipment }>("/api/shipments", {
        method: "POST",
        body: JSON.stringify({
          originCity: form.originCity,
          originCountry: form.originCountry,
          destinationCity: form.destinationCity,
          destinationCountry: form.destinationCountry,
          recipientName: form.recipientName,
          recipientPhone: form.recipientPhone || undefined,
          recipientEmail: form.recipientEmail || undefined,
          recipientAddress: form.recipientAddress,
          parcels: [{ description: form.description, weightKg: Number(form.weightKg) }],
        }),
      });
      router.push(`/expeditions/${data.shipment.id}`);
    } catch {
      setError("Impossible de créer l'expédition. Vérifiez les champs.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <main className="container">
        <Link href="/">← Accueil</Link>
        <section className="section">
          <h1>📮 Mes expéditions</h1>
          <p className="muted"><Link href="/login">Connectez-vous</Link> pour créer et suivre une expédition.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>📮 Envoyer un colis</h1>
        <p className="muted">
          Un dossier douanier est ouvert automatiquement si le pays de destination diffère du pays de départ.
        </p>
        <form className="card form" onSubmit={onSubmit} style={{ marginTop: 16 }}>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <input className="input" placeholder="Ville de départ" value={form.originCity} onChange={(e) => setForm((f) => ({ ...f, originCity: e.target.value }))} required />
            <input className="input" placeholder="Pays de départ (ex: FR)" value={form.originCountry} onChange={(e) => setForm((f) => ({ ...f, originCountry: e.target.value }))} required />
            <input className="input" placeholder="Ville de destination" value={form.destinationCity} onChange={(e) => setForm((f) => ({ ...f, destinationCity: e.target.value }))} required />
            <input className="input" placeholder="Pays de destination (ex: SN)" value={form.destinationCountry} onChange={(e) => setForm((f) => ({ ...f, destinationCountry: e.target.value }))} required />
          </div>
          <input className="input" placeholder="Nom du destinataire" value={form.recipientName} onChange={(e) => setForm((f) => ({ ...f, recipientName: e.target.value }))} required />
          <input className="input" placeholder="Adresse du destinataire" value={form.recipientAddress} onChange={(e) => setForm((f) => ({ ...f, recipientAddress: e.target.value }))} required />
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <input className="input" placeholder="Téléphone destinataire (optionnel)" value={form.recipientPhone} onChange={(e) => setForm((f) => ({ ...f, recipientPhone: e.target.value }))} />
            <input className="input" placeholder="E-mail destinataire (optionnel)" value={form.recipientEmail} onChange={(e) => setForm((f) => ({ ...f, recipientEmail: e.target.value }))} />
          </div>
          <input className="input" placeholder="Description du colis" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
          <input className="input" placeholder="Poids (kg)" type="number" value={form.weightKg} onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))} required />
          {error && <p className="muted">{error}</p>}
          <button className="btn" type="submit" disabled={submitting}>{submitting ? "Création…" : "Créer l'expédition"}</button>
        </form>
      </section>

      <section className="section">
        <h2>Mes expéditions</h2>
        {shipments === null && <p className="muted">Chargement…</p>}
        {shipments?.length === 0 && <p className="muted">Aucune expédition pour le moment.</p>}
        <div className="grid">
          {shipments?.map((s) => (
            <Link className="card" href={`/expeditions/${s.id}`} key={s.id}>
              <span className="tag">{STATUS_LABELS[s.status] ?? s.status}</span>
              <h3>{s.originCity} → {s.destinationCity}</h3>
              <p className="muted">{s.destinationCountry !== s.originCountry ? "International" : "National"} · {s.parcels?.length ?? 0} colis</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
