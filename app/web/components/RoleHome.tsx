"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Mission, type Organization, type OfferWithMission } from "../lib/api";

const QUICK_ACTIONS_BY_ROLE: Record<
  string,
  { icon: string; title: string; sub: string; href: string }[]
> = {
  ANONYME: [
    { icon: "📦", title: "Publier une mission", sub: "Transportez vos marchandises ou vos colis", href: "/publier" },
    { icon: "🤝", title: "Trouver un prestataire", sub: "Transporteurs, commissionnaires, logisticiens…", href: "/prestataires" },
    { icon: "🏢", title: "Créer mon entreprise de transport", sub: "Accompagnement complet de A à Z", href: "/mon-entreprise" },
    { icon: "🎓", title: "Mes capacités & offres", sub: "Proposez ou gérez vos capacités de transport", href: "/mon-entreprise" },
  ],
  PARTICULIER: [
    { icon: "📮", title: "Envoyer un colis", sub: "Suivi, douane, dernier kilomètre", href: "/expeditions" },
    { icon: "📦", title: "Publier une mission", sub: "Marchandises volumineuses ou palettes", href: "/publier" },
    { icon: "🔎", title: "Rechercher une mission", sub: "Comparer les prestataires disponibles", href: "/missions" },
    { icon: "📋", title: "Mes missions", sub: "Suivre vos publications et vos offres reçues", href: "/mes-missions" },
  ],
  PROFESSIONNEL: [
    { icon: "🏢", title: "Mon entreprise", sub: "Profil, activité, capacités déclarées", href: "/mon-entreprise" },
    { icon: "🎓", title: "Mes capacités & offres", sub: "Publier une capacité de transport", href: "/mon-entreprise" },
    { icon: "📋", title: "Mes missions publiées", sub: "Suivre vos publications et offres reçues", href: "/mes-missions" },
    { icon: "📄", title: "Contrats & signature", sub: "Consulter et signer vos contrats", href: "/contrats" },
  ],
  TRANSPORTEUR: [
    { icon: "🔎", title: "Missions à pourvoir", sub: "Trouver des missions compatibles", href: "/missions" },
    { icon: "📨", title: "Mes offres", sub: "Suivre vos offres envoyées", href: "#mes-offres" },
    { icon: "🎓", title: "Mes capacités & offres", sub: "Publier votre capacité disponible", href: "/mon-entreprise" },
    { icon: "📄", title: "Contrats & signature", sub: "Consulter et signer vos contrats", href: "/contrats" },
  ],
  DISPATCHER: [
    { icon: "🚦", title: "Centrale Dispatcher", sub: "Aperçu — module en construction", href: "/dispatcher" },
    { icon: "👨‍✈️", title: "Mes livreurs", sub: "Bientôt disponible", href: "#" },
    { icon: "🗺️", title: "Tournées", sub: "Bientôt disponible", href: "#" },
    { icon: "📍", title: "Suivi en temps réel", sub: "Bientôt disponible", href: "#" },
  ],
};

const ROLE_TITLES: Record<string, string> = {
  ANONYME: "Votre partenaire logistique mondial",
  PARTICULIER: "Votre transport, simplement.",
  PROFESSIONNEL: "Tableau de bord entreprise",
  TRANSPORTEUR: "Missions à pourvoir",
  DISPATCHER: "Centrale de dispatch",
};

export function RoleHero() {
  const { user } = useAuth();
  const role = user?.role ?? "ANONYME";
  const actions = QUICK_ACTIONS_BY_ROLE[role] ?? QUICK_ACTIONS_BY_ROLE.ANONYME;

  return (
    <>
      <section className="hero">
        {user && <p className="greeting">Bonjour, {user.name.split(" ")[0]} 👋</p>}
        <h1>{ROLE_TITLES[role]}</h1>
        <p>Import · Export · Transport · Douane · Marketplace · Contrats · Suivi</p>
        <div className="hero-search">
          <span>🔎</span>
          <input placeholder="Rechercher une mission, un prestataire, un service…" disabled />
        </div>
      </section>

      <div className="quick-actions">
        {actions.map((qa) => (
          <Link className="quick-action" href={qa.href} key={qa.title}>
            <span className="quick-icon">{qa.icon}</span>
            <span>
              <strong>{qa.title}</strong>
              <span className="muted">{qa.sub}</span>
            </span>
          </Link>
        ))}
      </div>

      {role === "PROFESSIONNEL" && <ProfessionnelPanel />}
      {role === "TRANSPORTEUR" && <TransporteurPanel />}
      {role === "DISPATCHER" && <DispatcherNotice />}
    </>
  );
}

function ProfessionnelPanel() {
  const [organizations, setOrganizations] = useState<Organization[] | null>(null);

  useEffect(() => {
    apiFetch<{ organizations: Organization[] }>("/api/organizations/mine")
      .then((d) => setOrganizations(d.organizations))
      .catch(() => setOrganizations([]));
  }, []);

  return (
    <section className="section">
      <h2>🏢 Mes entreprises</h2>
      {organizations === null && <p className="muted">Chargement…</p>}
      {organizations?.length === 0 && (
        <p className="muted">
          Aucune entreprise créée. <Link href="/mon-entreprise">Créer mon entreprise de transport</Link>.
        </p>
      )}
      <div className="grid">
        {organizations?.map((org) => (
          <article className="card" key={org.id}>
            <span className="tag">{org.verificationStatus}</span>
            <h3>{org.name}</h3>
            <p className="muted">{org.activity} · {org.country}</p>
            <p className="muted">{org.capacities?.length ?? 0} capacité(s) publiée(s)</p>
            <Link className="btn secondary" href="/mon-entreprise">Gérer</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function TransporteurPanel() {
  const [offers, setOffers] = useState<OfferWithMission[] | null>(null);

  useEffect(() => {
    apiFetch<{ offers: OfferWithMission[] }>("/api/missions/offers/mine")
      .then((d) => setOffers(d.offers))
      .catch(() => setOffers([]));
  }, []);

  return (
    <section className="section" id="mes-offres">
      <h2>📨 Mes offres</h2>
      {offers === null && <p className="muted">Chargement…</p>}
      {offers?.length === 0 && (
        <p className="muted">
          Vous n'avez fait aucune offre. <Link href="/missions">Voir les missions disponibles</Link>.
        </p>
      )}
      <div className="grid">
        {offers?.map((o) => (
          <article className="card" key={o.id}>
            <span className="tag">{o.status}</span>
            <h3>{o.mission.fromCity} → {o.mission.toCity}</h3>
            <p className="price">{o.price} €</p>
            <Link className="btn secondary" href={`/missions/${o.missionId}`}>Voir la mission</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function DispatcherNotice() {
  return (
    <section className="section">
      <div className="card" style={{ borderColor: "#fde68a", background: "#fffbeb" }}>
        <p className="muted">
          🚧 Le module Dispatcher/Centrale (tournées, livreurs, scans, preuves de livraison) est en cours de
          construction. Vous voyez ci-dessus un aperçu de l'interface prévue, pas encore relié à des données réelles.
        </p>
      </div>
    </section>
  );
}
