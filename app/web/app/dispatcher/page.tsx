import Link from "next/link";

export default function DispatcherPage() {
  return (
    <main className="container">
      <Link href="/">← Accueil</Link>
      <section className="section">
        <h1>🚦 Centrale Dispatcher</h1>
        <div className="card" style={{ borderColor: "#fde68a", background: "#fffbeb", marginBottom: 20 }}>
          <p className="muted">
            🚧 Aperçu de l'interface prévue — module en construction. Les chiffres ci-dessous sont des exemples,
            pas des données réelles. La réception de colis, les scans, les tournées et l'affectation de livreurs
            seront branchés sur un vrai backend dans une prochaine phase.
          </p>
        </div>
        <div className="grid">
          <article className="card"><b style={{ fontSize: 28 }}>—</b><p className="muted">Colis à affecter</p></article>
          <article className="card"><b style={{ fontSize: 28 }}>—</b><p className="muted">Tournées aujourd'hui</p></article>
          <article className="card"><b style={{ fontSize: 28 }}>—</b><p className="muted">Livreurs actifs</p></article>
          <article className="card"><b style={{ fontSize: 28 }}>—</b><p className="muted">Livraisons réussies</p></article>
        </div>
      </section>
    </main>
  );
}
