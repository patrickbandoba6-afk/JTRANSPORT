import Link from "next/link";
import { missions } from "../lib/data";

export default function Home() {
  return (
    <>
      <nav className="nav"><div className="navin">
        <div className="logo">JTRANSPORT</div>
        <div className="links">
          <Link href="/">Accueil</Link><Link href="/missions">Missions</Link>
          <Link href="/publier">Publier une mission</Link><Link href="/prestataires">Prestataires</Link>
        </div>
      </div></nav>
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
          <div className="grid">
            {missions.map(m=><article className="card" key={m.id}>
              <span className="tag">{m.vehicle}</span>
              {m.recurring && <span className="tag">Récurrente</span>}
              <h3>{m.from} → {m.to}</h3>
              <p className="muted">📅 {m.date}</p>
              <p>{m.cargo} · {m.weight}</p>
              <p className="price">{m.budget} €</p>
              <Link className="btn" href={`/missions/${m.id}`}>Voir la mission</Link>
            </article>)}
          </div>
        </section>
      </main>
    </>
  );
}