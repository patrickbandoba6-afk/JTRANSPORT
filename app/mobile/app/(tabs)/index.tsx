import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../lib/theme";
import { Card, IconBadge, Tag, Button } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Mission } from "../../lib/api";
import { useRoleContent, QuickActionsGrid, ProfessionnelPanel, TransporteurPanel, DispatcherNotice } from "../../components/RoleHome";

// null = module pas encore construit — visible pour respecter la structure
// du cahier des charges, mais honnêtement marqué "Bientôt".
const CATEGORIES: { icon: string; label: string; href: "/(tabs)/missions" | "/capacites" | null }[] = [
  { icon: "🚚", label: "Marchandises", href: "/(tabs)/missions" },
  { icon: "🚌", label: "Voyageurs", href: null },
  { icon: "🚢", label: "Maritime", href: null },
  { icon: "✈️", label: "Aérien", href: null },
  { icon: "🚆", label: "Ferroviaire", href: null },
  { icon: "🚗", label: "Véhicules", href: null },
  { icon: "📦", label: "Colis & palettes", href: "/(tabs)/missions" },
  { icon: "🛃", label: "Douane", href: null },
  { icon: "🚛", label: "Capacités", href: "/capacites" },
  { icon: "🔲", label: "Toutes", href: "/(tabs)/missions" },
];

export default function Home() {
  const { user } = useAuth();
  const { title, actions, role } = useRoleContent();
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ missions: Mission[] }>("/api/missions");
      setMissions(data.missions);
    } catch {
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>J</Text>
            </View>
            <View>
              <Text style={styles.logoTitle}>JTransport</Text>
              <Text style={styles.logoSub}>Tout votre transport, au même endroit</Text>
            </View>
          </View>
          <Ionicons name="notifications-outline" color="#fff" size={22} />
        </View>

        {user && <Text style={styles.greeting}>Bonjour, {user.name.split(" ")[0]} 👋</Text>}

        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSub}>Import · Export · Transport · Douane · Marketplace</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput placeholder="Rechercher une mission, un prestataire…" placeholderTextColor={colors.muted} style={styles.searchInput} editable={false} />
        </View>
      </View>

      <QuickActionsGrid actions={actions} />

      {role === "PROFESSIONNEL" && <ProfessionnelPanel />}
      {role === "TRANSPORTEUR" && <TransporteurPanel />}
      {role === "DISPATCHER" && <DispatcherNotice />}

      <View style={styles.promo}>
        <Text style={styles.promoEyebrow}>TRANSPORT INTERNATIONAL</Text>
        <Text style={styles.promoTitle}>Envoyez vos colis partout dans le monde</Text>
        <Text style={styles.promoSub}>Par route, par mer, par air… en toute sécurité.</Text>
        <Button title="Calculer mon envoi →" variant="secondary" onPress={() => router.push("/publier")} />
      </View>

      <Text style={styles.sectionTitle}>📦 Nos catégories</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((c) =>
          c.href ? (
            <Link key={c.label} href={c.href} asChild>
              <Pressable style={styles.categoryTile}>
                <IconBadge icon={c.icon} size={36} />
                <Text style={styles.categoryLabel}>{c.label}</Text>
              </Pressable>
            </Link>
          ) : (
            <View key={c.label} style={[styles.categoryTile, { opacity: 0.5 }]}>
              <Text style={styles.soonBadge}>Bientôt</Text>
              <IconBadge icon={c.icon} size={36} />
              <Text style={styles.categoryLabel}>{c.label}</Text>
            </View>
          ),
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Missions disponibles</Text>
        <Link href="/(tabs)/missions">
          <Text style={styles.link}>Voir tout →</Text>
        </Link>
      </View>

      {loading && <Text style={styles.muted}>Chargement…</Text>}
      {!loading && missions.length === 0 && <Text style={styles.muted}>Aucune mission publiée pour le moment.</Text>}

      <View style={{ gap: 12, paddingHorizontal: 16 }}>
        {missions.map((m) => (
          <Link key={m.id} href={`/missions/${m.id}`} asChild>
            <Card>
              <Tag label={m.vehicleType} />
              <Text style={styles.missionRoute}>{m.fromCity} → {m.toCity}</Text>
              <Text style={styles.muted}>{m.cargo} · {m.weightKg} kg</Text>
              <Text style={styles.missionPrice}>{m.budget} €</Text>
            </Card>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: {
    backgroundColor: colors.navy900,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.blue600,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadgeText: { color: "#fff", fontWeight: "900", fontSize: 17 },
  logoTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  logoSub: { color: colors.mutedOnNavy, fontSize: 11 },
  greeting: { color: colors.mutedOnNavy, fontSize: 14, marginBottom: 4 },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 6, marginBottom: 4 },
  heroSub: { color: colors.mutedOnNavy, fontSize: 13, marginBottom: 18 },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.ink },
  promo: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: radius.lg,
    padding: 22,
    backgroundColor: colors.blue600,
  },
  promoEyebrow: { color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 8 },
  promoTitle: { color: "#fff", fontSize: 19, fontWeight: "800", marginBottom: 6 },
  promoSub: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.ink, paddingHorizontal: 16, marginBottom: 12, marginTop: 4 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingHorizontal: 16, marginBottom: 20 },
  categoryTile: {
    width: "30%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    alignItems: "center",
  },
  categoryLabel: { fontSize: 10, fontWeight: "700", color: colors.ink, textAlign: "center", marginTop: 6 },
  soonBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontSize: 8,
    fontWeight: "800",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  link: { color: colors.blue600, fontWeight: "700", fontSize: 13 },
  muted: { color: colors.muted, fontSize: 13, paddingHorizontal: 16 },
  missionRoute: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 8 },
  missionPrice: { fontSize: 18, fontWeight: "800", color: colors.navy900, marginTop: 4 },
});
