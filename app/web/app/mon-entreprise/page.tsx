"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Organization } from "../../lib/api";

const ACTIVITIES: { value: string; label: string }[] = [
  { value: "MARCHANDISES", label: "Transport de marchandises" },
  { value: "VOYAGEURS", label: "Transport de voyageurs" },
  { value: "COMMISSIONNAIRE", label: "Commissionnaire de transport" },
  { value: "LOGISTIQUE", label: "Logistique" },
  { value: "MARITIME", label: "Activité maritime" },
  { value: "AERIEN", label: "Activité aérienne" },
  { value: "FERROVIAIRE", label: "Activité ferroviaire" },
  { value: "AUTRE", label: "Autre activité réglementée" },
];

export default function MonEntreprisePage() {
  const { user, loading: authLoading } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[] | null>(null);
  const [form, setForm] = useState({ name: "", activity: "MARCHANDISES", country: "FR", hasProfessionalCapacity: false });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ organizations: Organization[] }>("/api/organizations/mine");
      setOrganizations(data.organizations);
    } catch {
      setOrganizations([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function createOrganization(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/organizations", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", activity: "MARCHANDISES", country: "FR", hasProfessionalCapacity: false });
      await load();
    } catch {
      setError("Impossible de créer l'entreprise pour le moment.");
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
          <h1>🏢 Créer mon entreprise de transport</h1>
          <p className="muted">
            <Link href="/login">Connectez-vous</Link> pour créer votre entreprise et déclarer vos capacités.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>🏢 Créer mon entreprise de transport</h1>
        <p className="muted">
          Déclarer une entreprise ne délivre aucune capacité professionnelle : le statut de vérification reste « non
          vérifié » jusqu'à un contrôle administratif. Voir aussi{" "}
          <Link href="/capacites">le marketplace des capacités</Link>.
        </p>

        <form className="card form" onSubmit={createOrganization} style={{ marginTop: 16 }}>
          <input
            className="input"
            placeholder="Nom de l'entreprise"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <select
            className="select"
            value={form.activity}
            onChange={(e) => setForm((f) => ({ ...f, activity: e.target.value }))}
          >
            {ACTIVITIES.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Pays d'établissement (ex: FR)"
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            required
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={form.hasProfessionalCapacity}
              onChange={(e) => setForm((f) => ({ ...f, hasProfessionalCapacity: e.target.checked }))}
            />
            Je dispose déjà de la capacité professionnelle requise
          </label>
          {error && <p className="muted">{error}</p>}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Création…" : "Créer l'entreprise"}
          </button>
        </form>
      </section>

      <section className="section">
        <h2>Mes entreprises</h2>
        {organizations === null && <p className="muted">Chargement…</p>}
        {organizations?.length === 0 && <p className="muted">Aucune entreprise créée pour le moment.</p>}
        <div className="grid">
          {organizations?.map((org) => (
            <OrganizationCard key={org.id} organization={org} onCapacityAdded={load} />
          ))}
        </div>
      </section>
    </main>
  );
}

function OrganizationCard({ organization, onCapacityAdded }: { organization: Organization; onCapacityAdded: () => void }) {
  const [capForm, setCapForm] = useState({ vehicleType: "Camion", weightCapacityKg: "", zone: "", availableFrom: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addCapacity(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch(`/api/organizations/${organization.id}/capacities`, {
        method: "POST",
        body: JSON.stringify({
          vehicleType: capForm.vehicleType,
          weightCapacityKg: Number(capForm.weightCapacityKg),
          zone: capForm.zone,
          availableFrom: capForm.availableFrom,
        }),
      });
      setCapForm({ vehicleType: "Camion", weightCapacityKg: "", zone: "", availableFrom: "" });
      onCapacityAdded();
    } catch {
      setError("Impossible de publier cette capacité.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="card">
      <span className="tag">{organization.verificationStatus}</span>
      <h3>{organization.name}</h3>
      <p className="muted">{organization.activity} · {organization.country}</p>

      {organization.capacities && organization.capacities.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {organization.capacities.map((c) => (
            <p key={c.id} className="muted">🚚 {c.vehicleType} · {c.weightCapacityKg} kg · {c.zone}</p>
          ))}
        </div>
      )}

      <form className="form" onSubmit={addCapacity} style={{ marginTop: 12 }}>
        <input className="input" placeholder="Zone couverte (ex: France)" value={capForm.zone} onChange={(e) => setCapForm((f) => ({ ...f, zone: e.target.value }))} required />
        <input className="input" placeholder="Poids max (kg)" type="number" value={capForm.weightCapacityKg} onChange={(e) => setCapForm((f) => ({ ...f, weightCapacityKg: e.target.value }))} required />
        <input className="input" placeholder="Disponible à partir du (AAAA-MM-JJ)" value={capForm.availableFrom} onChange={(e) => setCapForm((f) => ({ ...f, availableFrom: e.target.value }))} required />
        {error && <p className="muted">{error}</p>}
        <button className="btn secondary" type="submit" disabled={submitting}>
          {submitting ? "Publication…" : "+ Publier une capacité"}
        </button>
      </form>
    </article>
  );
}
