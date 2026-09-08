import Link from "next/link";
import { API_URL, type Mission } from "../lib/api";
import { RoleHero } from "../components/RoleHome";

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

// href: null = module pas encore construit — on l'affiche pour respecter la
// structure du cahier des charges, mais sans faire semblant que ça marche.
const CATEGORIES: { icon: string; label: string; href: string | null }[] = [
  { icon: "🚚", label: "Transport de marchandises", href: "/missions" },
  { icon: "🚌", label: "Transport de voyageurs", href: null },
  { icon: "🚢", label: "Fret maritime", href: null },
  { icon: "✈️", label: "Fret aérien", href: null },
  { icon: "🚆", label: "Fret ferroviaire", href: null },
  { icon: "🚗", label: "Transport de véhicules", href: null },
  { icon: "📦", label: "Colis & palettes", href: "/missions" },
  { icon: "🛃", label: "Douane & dédouanement", href: null },
  { icon: "🌍", label: "Import / Export", href: null },
  { icon: "🏭", label: "Logistique & entreposage", href: null },
  { icon: "🚛", label: "Location de capacité", href: "/capacites" },
  { icon: "🔲", label: "Toutes les catégories", href: "/missions" },
];

const SERVICES: { icon: string; label: string; sub: string; href: string | null }[] = [
  { icon: "€", label: "Devis & factures", sub: "Générez vos devis et factures", href: null },
  { icon: "📝", label: "Contrats & signature", sub: "Signez vos contrats en ligne", href: "/contrats" },
  { icon: "📍", label: "Suivi & tracking", sub: "Suivez vos marchandises", href: null },
  { icon: "🛡️", label: "Assurance transport", sub: "Protégez vos envois", href: null },
  { icon: "⚖️", label: "Gestion des litiges", sub: "Accompagnement en cas de problème", href: null },
];

export default async function Home() {
  const missions = await getPublishedMissions();

  return (
    <main className="container">
      <RoleHero />

      <div className="promo-banner">
        <span className="eyebrow">TRANSPORT INTERNATIONAL</span>
        <h2>Envoyez vos colis partout dans le monde</h2>
        <p>Par route, par mer, par air… en toute sécurité.</p>
        <Link className="btn secondary" href="/publier">Calculer mon envoi →</Link>
      </div>

      <section className="section">
        <h2>📦 Nos catégories</h2>
        <div className="category-grid">
          {CATEGORIES.map((c) =>
            c.href ? (
              <Link className="category-tile" href={c.href} key={c.label}>
                <span className="quick-icon">{c.icon}</span>
                <span className="label">{c.label}</span>
              </Link>
            ) : (
              <div className="category-tile disabled" key={c.label} title="Module à venir">
                <span className="soon-badge">Bientôt</span>
                <span className="quick-icon">{c.icon}</span>
                <span className="label">{c.label}</span>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="section">
        <h2>⚙️ Nos services</h2>
        <div className="service-row">
          {SERVICES.map((s) =>
            s.href ? (
              <Link className="service-tile" href={s.href} key={s.label}>
                <span className="quick-icon" style={{ width: 36, height: 36, fontSize: 15 }}>{s.icon}</span>
                <span>
                  <strong>{s.label}</strong>
                  <span className="muted">{s.sub}</span>
                </span>
              </Link>
            ) : (
              <div className="service-tile disabled" key={s.label} title="Module à venir">
                <span className="soon-badge">Bientôt</span>
                <span className="quick-icon" style={{ width: 36, height: 36, fontSize: 15 }}>{s.icon}</span>
                <span>
                  <strong>{s.label}</strong>
                  <span className="muted">{s.sub}</span>
                </span>
              </div>
            ),
          )}
        </div>
      </section>

      <div className="pro-banner">
        <div>
          <h3>Espace Entreprises — Mode PRO</h3>
          <p>Des outils pour gérer votre activité de transport et vos partenaires.</p>
        </div>
        <Link className="btn" href="/mon-entreprise">Accéder →</Link>
      </div>

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
