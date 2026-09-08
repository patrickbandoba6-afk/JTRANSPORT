import Link from "next/link";

const providers=[
  ["TransLog Île-de-France","🚚 Camion · France / Europe","⭐ 4,9 · 126 missions"],
  ["Express Partner","🚐 Fourgon · France / Benelux","⭐ 4,8 · 84 missions"],
  ["Africa Cargo Services","🌍 Maritime · Aérien · Export","⭐ 4,9 · 211 missions"]
];

export default function Providers(){return <main className="container">
  <Link href="/">← Accueil</Link><section className="section"><h1>🤝 Trouver un prestataire</h1><p className="muted">Recherchez des professionnels correspondant à votre besoin.</p></section>
  <div className="grid">{providers.map(p=><article className="card" key={p[0]}><h3>{p[0]}</h3><p>{p[1]}</p><p className="muted">{p[2]}</p><div className="actions"><button className="btn">Voir le profil</button><button className="btn secondary">Contacter</button></div></article>)}</div>
</main>}