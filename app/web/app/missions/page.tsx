import Link from "next/link";
import { missions } from "../../lib/data";

export default function Missions() {
  return <main className="container">
    <Link href="/">← Accueil</Link>
    <section className="section">
      <h1>🔎 Rechercher une mission</h1>
      <div className="card">
        <div className="grid">
          <input className="input" placeholder="Départ" />
          <input className="input" placeholder="Destination" />
          <select className="select"><option>Tous les véhicules</option><option>Fourgon</option><option>Camion</option><option>Semi-remorque</option></select>
        </div>
      </div>
    </section>
    <div className="grid">{missions.map(m=><article className="card" key={m.id}>
      <span className="tag">{m.vehicle}</span><h3>{m.from} → {m.to}</h3>
      <p className="muted">📅 {m.date}</p><p>{m.cargo} · {m.weight}</p><p className="price">{m.budget} €</p>
      <Link className="btn" href={`/missions/${m.id}`}>Faire une offre</Link>
    </article>)}</div>
  </main>
}