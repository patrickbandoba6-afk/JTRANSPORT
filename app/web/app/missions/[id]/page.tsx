import Link from "next/link";
import { missions } from "../../../lib/data";

export default async function MissionDetail({ params }: { params: Promise<{id:string}> }) {
  const {id}=await params;
  const m=missions.find(x=>x.id===id) ?? missions[0];
  return <main className="container">
    <Link href="/missions">← Missions</Link>
    <section className="section card">
      <span className="tag">{m.vehicle}</span><h1>{m.from} → {m.to}</h1>
      <p className="muted">Mission {m.id} · {m.date}</p>
      <p><b>Marchandise :</b> {m.cargo}</p><p><b>Poids :</b> {m.weight}</p>
      <p><b>Budget indicatif :</b> <span className="price">{m.budget} €</span></p>
      <div className="actions"><button className="btn">Faire une offre</button><button className="btn secondary">💬 Contacter</button></div>
    </section>
    <section className="section card">
      <h2>Faire une offre</h2>
      <div className="form"><input className="input" placeholder="Votre prix (€)" /><input className="input" placeholder="Délai proposé" /><textarea className="textarea" placeholder="Conditions ou message au client"></textarea><button className="btn">Envoyer l'offre</button></div>
    </section>
  </main>
}