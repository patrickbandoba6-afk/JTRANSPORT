import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { colors, radius } from "../lib/theme";
import { Card, IconBadge, Tag } from "./ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Organization, type OfferWithMission } from "../lib/api";

type QuickAction = { icon: string; title: string; sub: string; href: string };

const QUICK_ACTIONS_BY_ROLE: Record<string, QuickAction[]> = {
  ANONYME: [
    { icon: "📦", title: "Publier une mission", sub: "Transportez vos marchandises", href: "/publier" },
    { icon: "🔎", title: "Rechercher une mission", sub: "Trouvez des missions", href: "/(tabs)/missions" },
    { icon: "🏢", title: "Créer mon entreprise", sub: "Accompagnement complet", href: "/mon-entreprise" },
    { icon: "📄", title: "Contrats & signature", sub: "Signature électronique", href: "/contrats" },
  ],
  PARTICULIER: [
    { icon: "📮", title: "Envoyer un colis", sub: "Suivi, douane, dernier km", href: "/expeditions" },
    { icon: "📦", title: "Publier une mission", sub: "Marchandises, palettes", href: "/publier" },
    { icon: "🔎", title: "Rechercher une mission", sub: "Comparer les prestataires", href: "/(tabs)/missions" },
    { icon: "📋", title: "Mes missions", sub: "Suivre mes publications", href: "/(tabs)/mes-missions" },
  ],
  PROFESSIONNEL: [
    { icon: "🏢", title: "Mon entreprise", sub: "Profil et activité", href: "/mon-entreprise" },
    { icon: "🎓", title: "Mes capacités", sub: "Publier une capacité", href: "/mon-entreprise" },
    { icon: "📋", title: "Mes missions", sub: "Publications et offres", href: "/(tabs)/mes-missions" },
    { icon: "📄", title: "Contrats", sub: "Consulter et signer", href: "/contrats" },
  ],
  TRANSPORTEUR: [
    { icon: "🔎", title: "Missions à pourvoir", sub: "Trouver des missions", href: "/(tabs)/missions" },
    { icon: "🎓", title: "Mes capacités", sub: "Publier ma capacité", href: "/mon-entreprise" },
    { icon: "📄", title: "Contrats", sub: "Consulter et signer", href: "/contrats" },
    { icon: "👤", title: "Mon compte", sub: "Profil et paramètres", href: "/(tabs)/profil" },
  ],
  DISPATCHER: [
    { icon: "🗺️", title: "Mes tournées", sub: "Créer et affecter", href: "/dispatch" },
    { icon: "💬", title: "Messages", sub: "Échanger avec vos livreurs", href: "/(tabs)/messages" },
    { icon: "📮", title: "Expéditions", sub: "Colis et conteneurs", href: "/expeditions" },
    { icon: "👤", title: "Mon compte", sub: "Profil et paramètres", href: "/(tabs)/profil" },
  ],
  CHAUFFEUR: [
    { icon: "🚚", title: "Ma tournée du jour", sub: "Arrêts, scans, livraisons", href: "/driver" },
    { icon: "💬", title: "Messages", sub: "Contacter la centrale", href: "/(tabs)/messages" },
    { icon: "📋", title: "Missions", sub: "Missions disponibles", href: "/(tabs)/missions" },
    { icon: "👤", title: "Mon compte", sub: "Profil et paramètres", href: "/(tabs)/profil" },
  ],
};

const ROLE_TITLES: Record<string, string> = {
  ANONYME: "Votre partenaire logistique mondial",
  PARTICULIER: "Votre transport, simplement.",
  PROFESSIONNEL: "Tableau de bord entreprise",
  TRANSPORTEUR: "Missions à pourvoir",
  DISPATCHER: "Centrale de dispatch",
  CHAUFFEUR: "Votre tournée du jour",
};

export function useRoleContent() {
  const { user } = useAuth();
  const role = user?.role ?? "ANONYME";
  return {
    role,
    title: ROLE_TITLES[role],
    actions: QUICK_ACTIONS_BY_ROLE[role] ?? QUICK_ACTIONS_BY_ROLE.ANONYME,
  };
}

export function QuickActionsGrid({ actions }: { actions: QuickAction[] }) {
  return (
    <View style={styles.quickGrid}>
      {actions.map((qa) =>
        qa.href.startsWith("#") ? (
          <View key={qa.title} style={[styles.quickCard, { opacity: 0.5 }]}>
            <IconBadge icon={qa.icon} size={38} />
            <Text style={styles.quickTitle}>{qa.title}</Text>
            <Text style={styles.quickSub}>{qa.sub}</Text>
          </View>
        ) : (
          <Link key={qa.title} href={qa.href as never} asChild>
            <Pressable style={styles.quickCard}>
              <IconBadge icon={qa.icon} size={38} />
              <Text style={styles.quickTitle}>{qa.title}</Text>
              <Text style={styles.quickSub}>{qa.sub}</Text>
            </Pressable>
          </Link>
        ),
      )}
    </View>
  );
}

export function ProfessionnelPanel() {
  const [organizations, setOrganizations] = useState<Organization[] | null>(null);

  useEffect(() => {
    apiFetch<{ organizations: Organization[] }>("/api/organizations/mine")
      .then((d) => setOrganizations(d.organizations))
      .catch(() => setOrganizations([]));
  }, []);

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>🏢 Mes entreprises</Text>
      {organizations === null && <Text style={styles.muted}>Chargement…</Text>}
      {organizations?.length === 0 && <Text style={styles.muted}>Aucune entreprise créée pour le moment.</Text>}
      <View style={{ gap: 10 }}>
        {organizations?.map((org) => (
          <Card key={org.id}>
            <Tag label={org.verificationStatus} />
            <Text style={styles.orgName}>{org.name}</Text>
            <Text style={styles.muted}>{org.activity} · {org.country}</Text>
          </Card>
        ))}
      </View>
    </View>
  );
}

export function TransporteurPanel() {
  const [offers, setOffers] = useState<OfferWithMission[] | null>(null);

  useEffect(() => {
    apiFetch<{ offers: OfferWithMission[] }>("/api/missions/offers/mine")
      .then((d) => setOffers(d.offers))
      .catch(() => setOffers([]));
  }, []);

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>📨 Mes offres</Text>
      {offers === null && <Text style={styles.muted}>Chargement…</Text>}
      {offers?.length === 0 && <Text style={styles.muted}>Vous n'avez fait aucune offre.</Text>}
      <View style={{ gap: 10 }}>
        {offers?.map((o) => (
          <Link key={o.id} href={`/missions/${o.missionId}`} asChild>
            <Pressable>
              <Card>
                <Tag label={o.status} />
                <Text style={styles.orgName}>{o.mission.fromCity} → {o.mission.toCity}</Text>
                <Text style={styles.price}>{o.price} €</Text>
              </Card>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

export function DispatcherNotice() {
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
      <View style={[styles.card, { borderColor: "#fde68a", backgroundColor: "#fffbeb" }]}>
        <Text style={styles.muted}>
          🚧 Le module Dispatcher/Centrale (tournées, livreurs, scans, preuves de livraison) est en cours de
          construction. Aperçu de l'interface prévue, pas encore relié à des données réelles.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 16, marginTop: 18, marginBottom: 12 },
  quickCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTitle: { fontWeight: "700", fontSize: 13, marginTop: 10, color: colors.ink },
  quickSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.ink, marginBottom: 10 },
  muted: { color: colors.muted, fontSize: 13 },
  orgName: { fontSize: 15, fontWeight: "700", color: colors.ink, marginTop: 6 },
  price: { fontSize: 16, fontWeight: "800", color: colors.navy900, marginTop: 6 },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: 16 },
});
