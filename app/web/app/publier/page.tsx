"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Mission } from "../../lib/api";

export default function Publish() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    fromCity: "",
    toCity: "",
    date: "",
    vehicleType: "Fourgon",
    cargo: "",
    weightKg: "",
    budget: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await apiFetch<{ mission: Mission }>("/api/missions", {
        method: "POST",
        body: JSON.stringify({
          fromCity: form.fromCity,
          toCity: form.toCity,
          date: form.date,
          vehicleType: form.vehicleType,
          cargo: form.cargo,
          weightKg: Number(form.weightKg),
          budget: Number(form.budget),
        }),
      });
      router.push(`/missions/${data.mission.id}`);
    } catch {
      setError("Impossible de publier la mission. Vérifiez les champs et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="container">
        <p className="muted">Chargement…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container">
        <Link href="/">← Accueil</Link>
        <section className="section">
          <h1>📢 Publier une mission</h1>
          <p className="muted">
            Connectez-vous pour publier une mission. <Link href="/login">Se connecter</Link> ou{" "}
            <Link href="/register">créer un compte</Link>.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>📢 Publier une mission</h1>
        <p className="muted">Décrivez votre besoin. JTransport pourra ensuite proposer la mission aux prestataires compatibles.</p>
        <form className="card form" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Lieu de départ"
            value={form.fromCity}
            onChange={(e) => update("fromCity", e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Lieu d'arrivée"
            value={form.toCity}
            onChange={(e) => update("toCity", e.target.value)}
            required
          />
          <input
            className="input"
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            required
          />
          <select
            className="select"
            value={form.vehicleType}
            onChange={(e) => update("vehicleType", e.target.value)}
          >
            <option>Fourgon</option>
            <option>Camion</option>
            <option>Semi-remorque</option>
            <option>Frigorifique</option>
          </select>
          <input
            className="input"
            placeholder="Type de marchandise"
            value={form.cargo}
            onChange={(e) => update("cargo", e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Poids (kg)"
            type="number"
            min="1"
            value={form.weightKg}
            onChange={(e) => update("weightKg", e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Budget (€)"
            type="number"
            min="1"
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            required
          />
          {error && <p className="muted">{error}</p>}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Publication…" : "Publier la mission"}
          </button>
        </form>
      </section>
    </main>
  );
}
