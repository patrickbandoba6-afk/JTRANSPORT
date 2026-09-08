import Link from "next/link";
import { API_URL, type Mission } from "../lib/api";

async function getPublishedMissions(): Promise<Mission[]> {
  try {
    const res = await fetch(`${API_URL}/api/missions`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.missions;
  } catch {
    return [];
  }
}

export default async function Home() {
  const missions = await getPublishedMissions();

  return (
    <main className="container">
      <section className="hero">
        <h1>La Marketplace du transport et de la logistique.</h1>
        <p>Publiez vos besoins de transport ou trouvez des missions adaptées à votre véhicule, votre zone et vos disponibilités.</p>
        <div className="actions">
          <Link className="btn" href="/publier">📢 Publier une mission</Link>
          <Link className="btn secondary" href="/missions">🔎 Rechercher une mission</Link>
        </div>
      </section>
      <section className="section">
        <h2>Missions disponibles</h2>
        {missions.length === 0 && <p className="muted">Aucune mission publiée pour le moment.</p>}
        <div className="grid">
          {missions.map((m) => (
            <article className="card" key={m.id}>
              <span className="tag">{m.vehicleType}</span>
              {m.recurring && <span className="tag">Récurrente</span>}
              <h3>{m.fromCity} → {m.toCity}</h3>
              <p className="muted">📅 {new Date(m.date).toLocaleDateString("fr-FR")}</p>
              <p>{m.cargo} · {m.weightKg} kg</p>
              <p className="price">{m.budget} €</p>
              <Link className="btn" href={`/missions/${m.id}`}>Voir la mission</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
