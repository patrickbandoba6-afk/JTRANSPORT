"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../lib/auth-context";
import { apiFetch, type Shipment } from "../../../lib/api";
import { DocumentsPanel } from "../../../components/DocumentsPanel";

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Créée", COLLECTED: "Collectée", AT_WAREHOUSE: "En entrepôt",
  GROUPED: "Groupée", IN_CONTAINER: "En conteneur", LOADED: "Chargée",
  DEPARTED: "Partie", IN_TRANSIT: "En transit", ARRIVED: "Arrivée",
  CUSTOMS: "En douane", CUSTOMS_CLEARED: "Dédouanée", OUT_FOR_DELIVERY: "En livraison",
  DELIVERED: "Livrée", INCIDENT: "Incident", CANCELLED: "Annulée",
};

export default function ExpeditionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiFetch<{ shipment: Shipment }>(`/api/shipments/${id}`)
      .then((d) => setShipment(d.shipment))
      .catch(() => setError(true));
  }, [id, user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <main className="container">
        <Link href="/expeditions">← Mes expéditions</Link>
        <section className="section"><p className="muted"><Link href="/login">Connectez-vous</Link> pour voir cette expédition.</p></section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <Link href="/expeditions">← Mes expéditions</Link>
        <section className="section"><p className="muted">Expédition introuvable ou accès refusé.</p></section>
      </main>
    );
  }

  if (!shipment) return null;

  return (
    <main className="container">
      <Link href="/expeditions">← Mes expéditions</Link>

      <section className="section card">
        <span className="tag">{STATUS_LABELS[shipment.status] ?? shipment.status}</span>
        <h1>{shipment.originCity} ({shipment.originCountry}) → {shipment.destinationCity} ({shipment.destinationCountry})</h1>
        <p className="muted">Destinataire : {shipment.recipientName} · {shipment.recipientAddress}</p>
        {shipment.parcels?.map((p) => (
          <p key={p.id} className="muted">📦 {p.description} · {p.weightKg} kg</p>
        ))}
      </section>

      {shipment.container && (
        <section className="section card">
          <h2>🚢 Conteneur</h2>
          <p><b>{shipment.container.containerNumber}</b> · {shipment.container.type}</p>
          <p className="muted">{shipment.container.originPort} → {shipment.container.destinationPort}</p>
          {shipment.container.vesselName && <p className="muted">Navire : {shipment.container.vesselName}</p>}
          {shipment.container.eta && <p className="muted">ETA : {new Date(shipment.container.eta).toLocaleDateString("fr-FR")}</p>}
        </section>
      )}

      {shipment.customsCase && (
        <section className="section card">
          <h2>🛃 Dossier douanier</h2>
          <span className="tag">{shipment.customsCase.status}</span>
          {shipment.customsCase.estimatedFees != null && (
            <div className="estimate-notice">
              Estimation des frais : {shipment.customsCase.estimatedFees} € — ceci est une estimation, pas un
              montant officiel communiqué par l'autorité douanière.
            </div>
          )}
          {shipment.customsCase.hsCode && <p className="muted">Code HS : {shipment.customsCase.hsCode}</p>}
        </section>
      )}

      <section className="section">
        <h2>📍 Suivi</h2>
        {(!shipment.events || shipment.events.length === 0) && <p className="muted">Aucun événement pour le moment.</p>}
        <ul className="timeline">
          {shipment.events?.map((ev) => (
            <li key={ev.id}>
              <p className="event-type">{STATUS_LABELS[ev.type] ?? ev.type}</p>
              <p className="event-meta">
                {new Date(ev.createdAt).toLocaleString("fr-FR")}
                {ev.location ? ` · ${ev.location}` : ""}
              </p>
              {ev.note && <p className="muted">{ev.note}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <DocumentsPanel dossierType="SHIPMENT" dossierId={shipment.id} />
      </section>
    </main>
  );
}
