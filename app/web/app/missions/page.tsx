"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, type Mission } from "../../lib/api";

export default function Missions() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (fromCity) params.set("fromCity", fromCity);
      if (toCity) params.set("toCity", toCity);
      if (vehicleType) params.set("vehicleType", vehicleType);
      const data = await apiFetch<{ missions: Mission[] }>(`/api/missions?${params.toString()}`);
      setMissions(data.missions);
    } catch {
      setError("Impossible de charger les missions pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container">
      <section className="section">
        <h1>🔎 Rechercher une mission</h1>
        <form className="card" onSubmit={search}>
          <div className="grid">
            <input
              className="input"
              placeholder="Départ"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
            />
            <input
              className="input"
              placeholder="Destination"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
            />
            <select
              className="select"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Tous les véhicules</option>
              <option value="Fourgon">Fourgon</option>
              <option value="Camion">Camion</option>
              <option value="Semi-remorque">Semi-remorque</option>
            </select>
          </div>
          <button className="btn" type="submit" style={{ marginTop: 12 }}>
            Rechercher
          </button>
        </form>
      </section>

      {loading && <p className="muted">Chargement…</p>}
      {error && <p className="muted">{error}</p>}

      <div className="grid">
        {missions.map((m) => (
          <article className="card" key={m.id}>
            <span className="tag">{m.vehicleType}</span>
            <h3>{m.fromCity} → {m.toCity}</h3>
            <p className="muted">📅 {new Date(m.date).toLocaleDateString("fr-FR")}</p>
            <p>{m.cargo} · {m.weightKg} kg</p>
            <p className="price">{m.budget} €</p>
            <Link className="btn" href={`/missions/${m.id}`}>Voir / Faire une offre</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
