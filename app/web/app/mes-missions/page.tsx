"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Mission } from "../../lib/api";

export default function MesMissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [missions, setMissions] = useState<Mission[] | null>(null);

  useEffect(() => {
    if (!user) return;
    apiFetch<{ missions: Mission[] }>("/api/missions?mine=true")
      .then((data) => setMissions(data.missions))
      .catch(() => setMissions([]));
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <main className="container">
        <Link href="/">← Accueil</Link>
        <section className="section">
          <h1>📋 Mes missions</h1>
          <p className="muted"><Link href="/login">Connectez-vous</Link> pour voir vos missions publiées.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>📋 Mes missions</h1>
        {missions === null && <p className="muted">Chargement…</p>}
        {missions?.length === 0 && (
          <p className="muted">
            Vous n'avez publié aucune mission. <Link href="/publier">Publier une mission</Link>.
          </p>
        )}
        <div className="grid">
          {missions?.map((m) => (
            <article className="card" key={m.id}>
              <span className="tag">{m.vehicleType}</span>
              <span className="tag">{m.status}</span>
              <h3>{m.fromCity} → {m.toCity}</h3>
              <p className="muted">{m.cargo} · {m.weightKg} kg</p>
              <p className="price">{m.budget} €</p>
              <p className="muted">{m._count?.offers ?? 0} offre(s) reçue(s)</p>
              <Link className="btn" href={`/missions/${m.id}`}>Gérer</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
