import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TextInput } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../lib/theme";
import { Card, IconBadge, Tag } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Mission } from "../../lib/api";

const QUICK_ACTIONS: { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string; href: "/publier" | "/(tabs)/missions" }[] = [
  { icon: "cube", title: "Publier une mission", sub: "Transportez vos marchandises", href: "/publier" },
  { icon: "search", title: "Rechercher une mission", sub: "Trouvez des missions compatibles", href: "/(tabs)/missions" },
];

export default function Home() {
  const { user } = useAuth();
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

        <Text style={styles.heroTitle}>Votre partenaire logistique mondial</Text>
        <Text style={styles.heroSub}>Import · Export · Transport · Douane · Marketplace</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput placeholder="Rechercher une mission, un prestataire…" placeholderTextColor={colors.muted} style={styles.searchInput} editable={false} />
        </View>
      </View>

      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((qa) => (
          <Link key={qa.title} href={qa.href} asChild>
            <View style={styles.quickCard}>
              <IconBadge icon={qa.icon === "cube" ? "📦" : "🔎"} size={40} />
              <Text style={styles.quickTitle}>{qa.title}</Text>
              <Text style={styles.quickSub}>{qa.sub}</Text>
            </View>
          </Link>
        ))}
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
  quickRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: -18, marginBottom: 20 },
  quickCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  quickTitle: { fontWeight: "700", fontSize: 13, marginTop: 10, color: colors.ink },
  quickSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.ink },
  link: { color: colors.blue600, fontWeight: "700", fontSize: 13 },
  muted: { color: colors.muted, fontSize: 13, paddingHorizontal: 16 },
  missionRoute: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 8 },
  missionPrice: { fontSize: 18, fontWeight: "800", color: colors.navy900, marginTop: 4 },
});
