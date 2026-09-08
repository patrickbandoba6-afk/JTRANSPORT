import Link from "next/link";
import { API_URL, type TransportCapacity } from "../../lib/api";

async function getCapacities(): Promise<TransportCapacity[]> {
  try {
    const res = await fetch(`${API_URL}/api/capacities`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.capacities;
  } catch {
    return [];
  }
}

export default async function CapacitesPage() {
  const capacities = await getCapacities();

  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>🚚 Capacités de transport disponibles</h1>
        <p className="muted">
          Entreprises proposant leur capacité de transport. Vous pouvez aussi{" "}
          <Link href="/mon-entreprise">proposer la vôtre</Link>.
        </p>
      </section>

      {capacities.length === 0 && <p className="muted">Aucune capacité publiée pour le moment.</p>}
      <div className="grid">
        {capacities.map((c) => (
          <article className="card" key={c.id}>
            <span className="tag">{c.vehicleType}</span>
            <span className="tag">{c.organization?.verificationStatus}</span>
            <h3>{c.organization?.name}</h3>
            <p className="muted">Zone : {c.zone}</p>
            <p className="muted">Capacité : {c.weightCapacityKg} kg{c.volumeCapacityM3 ? ` · ${c.volumeCapacityM3} m³` : ""}</p>
            <p className="muted">Disponible à partir du {new Date(c.availableFrom).toLocaleDateString("fr-FR")}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
