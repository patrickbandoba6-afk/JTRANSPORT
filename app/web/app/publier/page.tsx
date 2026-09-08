import Link from "next/link";

export default function Publish() {
  return <main className="container">
    <Link href="/">← Accueil</Link>
    <section className="section">
      <h1>📢 Publier une mission</h1>
      <p className="muted">Décrivez votre besoin. JTransport pourra ensuite proposer la mission aux prestataires compatibles.</p>
      <div className="card form">
        <input className="input" placeholder="Lieu de départ" />
        <input className="input" placeholder="Lieu d'arrivée" />
        <input className="input" type="date" />
        <select className="select"><option>Type de véhicule</option><option>Fourgon</option><option>Camion</option><option>Semi-remorque</option><option>Frigorifique</option></select>
        <input className="input" placeholder="Type de marchandise" />
        <input className="input" placeholder="Poids (kg)" />
        <input className="input" placeholder="Volume (m³)" />
        <input className="input" placeholder="Nombre de colis / palettes" />
        <input className="input" placeholder="Budget (€)" />
        <textarea className="textarea" placeholder="Informations complémentaires"></textarea>
        <button className="btn">Publier la mission</button>
      </div>
    </section>
  </main>
}