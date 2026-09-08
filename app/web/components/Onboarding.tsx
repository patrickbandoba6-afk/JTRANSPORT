"use client";

import { useState } from "react";

const SLIDES = [
  {
    title: "Une seule application pour tous vos transports",
    body: "Import/Export · Fret maritime · Fret aérien · Transport routier · Douane · Logistique.",
  },
  {
    title: "Une plateforme complète et sécurisée",
    body: "Suivi en temps réel, devis & factures, gestion des douanes, contrats & signature électronique.",
  },
  {
    title: "Tout à portée de clic",
    body: "Publiez une mission, trouvez un prestataire ou proposez votre capacité de transport en quelques minutes.",
  },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  return (
    <div className="launch-screen">
      <div className="onboarding-slide">
        <h2>{slide.title}</h2>
        <p>{slide.body}</p>
      </div>

      <div className="onboarding-dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={i === index ? "active" : ""} />
        ))}
      </div>

      <div className="onboarding-actions">
        <button className="btn" onClick={() => (isLast ? onDone() : setIndex((i) => i + 1))}>
          {isLast ? "Commencer →" : "Suivant →"}
        </button>
        {!isLast && (
          <button className="onboarding-skip" onClick={onDone}>
            Passer
          </button>
        )}
      </div>
    </div>
  );
}
