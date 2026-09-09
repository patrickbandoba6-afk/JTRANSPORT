import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../lib/theme";
import { Card, IconBadge, Tag } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Mission } from "../../lib/api";
import { useRoleContent, QuickActionsGrid, ProfessionnelPanel, TransporteurPanel, DispatcherNotice } from "../../components/RoleHome";

const LOGO = require("../../assets/logo.png");

// Structure et libellés repris du menu principal de référence (cahier des
// charges §3). href null = module pas encore construit : la tuile reste
// visible pour respecter la structure, mais marquée "Bientôt" plutôt que
// de faire semblant de fonctionner.
type Href = "/(tabs)/missions" | "/capacites" | "/expeditions" | "/contrats" | "/factures" | null;

const CATEGORIES: { icon: keyof typeof Ionicons.glyphMap; label: string; href: Href }[] = [
  { icon: "cube", label: "Transport\nde marchandises", href: "/(tabs)/missions" },
  { icon: "bus", label: "Transport\nde voyageurs", href: null },
  { icon: "boat", label: "Fret maritime", href: null },
  { icon: "airplane", label: "Fret aérien", href: null },
  { icon: "train", label: "Fret ferroviaire", href: null },
  { icon: "car-sport", label: "Transport de\nvéhicules", href: null },
  { icon: "file-tray-full", label: "Colis & palettes", href: "/expeditions" },
  { icon: "shield-checkmark", label: "Douane &\ndédouanement", href: null },
  { icon: "globe", label: "Import / Export", href: null },
  { icon: "business", label: "Logistique &\nentreposage", href: null },
  { icon: "bus-outline", label: "Location de\ncapacité", href: "/capacites" },
  { icon: "grid", label: "Toutes\nles catégories", href: "/(tabs)/missions" },
];

const SERVICES: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; href: Href }[] = [
  { icon: "cash", label: "Devis & Factures", sub: "Générez vos factures", href: "/factures" },
  { icon: "create", label: "Contrats & Signature", sub: "Signez en ligne", href: "/contrats" },
  { icon: "location", label: "Suivi & Tracking", sub: "Suivez vos marchandises", href: "/expeditions" },
  { icon: "shield", label: "Assurance Transport", sub: "Protégez vos envois", href: null },
  { icon: "headset", label: "Gestion des litiges", sub: "En cas de problème", href: null },
];

const FREIGHT_MODES: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: "boat", label: "Fret maritime" },
  { icon: "airplane", label: "Fret aérien" },
  { icon: "bus", label: "Fret routier" },
  { icon: "train", label: "Fret ferroviaire" },
  { icon: "shield-checkmark", label: "Douane & dédouanement" },
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
            <Image source={LOGO} style={styles.logo} />
            <View>
              <Text style={styles.logoTitle}>JTransport</Text>
              <Text style={styles.logoSub}>Tout votre transport, au même endroit !</Text>
            </View>
          </View>
          <View style={styles.heroActions}>
            <Ionicons name="notifications-outline" color="#fff" size={22} />
            <Pressable style={styles.avatarRow} onPress={() => router.push("/(tabs)/profil")}>
              <View style={styles.avatar}>
                <Ionicons name="person" color="#fff" size={16} />
              </View>
              {user && (
                <View>
                  <Text style={styles.helloSmall}>Bonjour,</Text>
                  <Text style={styles.helloName}>{user.name.split(" ")[0]}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSub}>Import · Export · Transport · Douane ·{"\n"}Marketplace · Contrats · Suivi</Text>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            placeholder="Rechercher une mission, un prestataire, un service…"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            editable={false}
          />
          <Ionicons name="options-outline" size={18} color={colors.muted} />
        </View>
      </View>

      <QuickActionsGrid actions={actions} />

      {role === "PROFESSIONNEL" && <ProfessionnelPanel />}
      {role === "TRANSPORTEUR" && <TransporteurPanel />}
      {role === "DISPATCHER" && <DispatcherNotice />}

      <View style={styles.promo}>
        <View style={styles.promoEyebrowPill}>
          <Text style={styles.promoEyebrow}>TRANSPORT INTERNATIONAL</Text>
        </View>
        <Text style={styles.promoTitle}>Envoyez vos colis{"\n"}partout dans le monde</Text>
        <Text style={styles.promoSub}>Par avion, par mer, par terre… en toute sécurité !</Text>
        <Pressable style={styles.promoBtn} onPress={() => router.push("/expeditions")}>
          <Text style={styles.promoBtnText}>Calculer mon envoi →</Text>
        </Pressable>

        <View style={styles.freightCard}>
          {FREIGHT_MODES.map((m) => (
            <View key={m.label} style={styles.freightRow}>
              <Ionicons name={m.icon} size={16} color={colors.blue600} />
              <Text style={styles.freightLabel}>{m.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📦 Nos catégories</Text>
        <Link href="/(tabs)/missions">
          <Text style={styles.link}>Voir toutes ›</Text>
        </Link>
      </View>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((c) =>
          c.href ? (
            <Link key={c.label} href={c.href} asChild>
              <Pressable style={styles.categoryTile}>
                <Ionicons name={c.icon} size={26} color={colors.blue600} />
                <Text style={styles.categoryLabel}>{c.label}</Text>
              </Pressable>
            </Link>
          ) : (
            <View key={c.label} style={[styles.categoryTile, styles.tileDisabled]}>
              <Text style={styles.soonBadge}>Bientôt</Text>
              <Ionicons name={c.icon} size={26} color={colors.blue400} />
              <Text style={[styles.categoryLabel, { color: colors.muted }]}>{c.label}</Text>
            </View>
          ),
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⚙️ Nos services</Text>
      </View>
      <View style={styles.servicesWrap}>
        {SERVICES.map((s) =>
          s.href ? (
            <Link key={s.label} href={s.href} asChild>
              <Pressable style={styles.serviceTile}>
                <View style={styles.serviceIcon}>
                  <Ionicons name={s.icon} size={18} color={colors.blue600} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceLabel}>{s.label}</Text>
                  <Text style={styles.serviceSub}>{s.sub}</Text>
                </View>
              </Pressable>
            </Link>
          ) : (
            <View key={s.label} style={[styles.serviceTile, styles.tileDisabled]}>
              <Text style={styles.soonBadge}>Bientôt</Text>
              <View style={styles.serviceIcon}>
                <Ionicons name={s.icon} size={18} color={colors.blue400} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.serviceLabel, { color: colors.muted }]}>{s.label}</Text>
                <Text style={styles.serviceSub}>{s.sub}</Text>
              </View>
            </View>
          ),
        )}
      </View>

      <Pressable style={styles.proBanner} onPress={() => router.push("/mon-entreprise")}>
        <View style={{ flex: 1 }}>
          <View style={styles.proPill}>
            <Text style={styles.proPillText}>Mode PRO</Text>
          </View>
          <Text style={styles.proTitle}>Espace Entreprises</Text>
          <Text style={styles.proSub}>Des outils puissants pour gérer votre activité de transport et vos partenaires.</Text>
        </View>
        <View style={styles.proBtn}>
          <Text style={styles.proBtnText}>Accéder ›</Text>
        </View>
      </Pressable>

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
    paddingTop: 58,
    paddingHorizontal: 18,
    paddingBottom: 46,
  },
  heroTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  logo: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff" },
  logoTitle: { color: "#fff", fontWeight: "800", fontSize: 17 },
  logoSub: { color: colors.mutedOnNavy, fontSize: 10 },
  heroActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  helloSmall: { color: colors.mutedOnNavy, fontSize: 9 },
  helloName: { color: "#fff", fontSize: 12, fontWeight: "700" },
  heroTitle: { color: "#fff", fontSize: 25, fontWeight: "800", marginTop: 18, marginBottom: 6 },
  heroSub: { color: colors.mutedOnNavy, fontSize: 13, lineHeight: 19 },

  searchWrap: { paddingHorizontal: 16, marginTop: -24 },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: colors.ink,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.ink },

  promo: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: radius.lg,
    padding: 20,
    backgroundColor: colors.blue600,
  },
  promoEyebrowPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  promoEyebrow: { color: "#fff", fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  promoTitle: { color: "#fff", fontSize: 21, fontWeight: "800", marginBottom: 6, lineHeight: 26 },
  promoSub: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginBottom: 14 },
  promoBtn: {
    backgroundColor: "#fff",
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
  },
  promoBtnText: { color: colors.navy900, fontWeight: "800", fontSize: 13 },
  freightCard: { backgroundColor: "#fff", borderRadius: radius.md, padding: 12, marginTop: 16, gap: 10 },
  freightRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  freightLabel: { fontSize: 12, fontWeight: "600", color: colors.ink },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.ink },
  link: { color: colors.blue600, fontWeight: "700", fontSize: 13 },

  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingHorizontal: 16, marginBottom: 22 },
  categoryTile: {
    width: "30.6%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 6,
    alignItems: "center",
    minHeight: 92,
    justifyContent: "center",
  },
  categoryLabel: { fontSize: 10, fontWeight: "700", color: colors.ink, textAlign: "center", marginTop: 8, lineHeight: 13 },
  tileDisabled: { backgroundColor: "#f8fafc" },
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

  servicesWrap: { paddingHorizontal: 16, gap: 10, marginBottom: 22 },
  serviceTile: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#eaf1ff",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceLabel: { fontSize: 13, fontWeight: "700", color: colors.ink },
  serviceSub: { fontSize: 11, color: colors.muted, marginTop: 2 },

  proBanner: {
    marginHorizontal: 16,
    marginBottom: 22,
    borderRadius: radius.lg,
    padding: 18,
    backgroundColor: "#e8f0ff",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  proPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.navy900,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginBottom: 8,
  },
  proPillText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  proTitle: { fontSize: 16, fontWeight: "800", color: colors.ink },
  proSub: { fontSize: 11, color: colors.muted, marginTop: 3 },
  proBtn: { backgroundColor: colors.blue600, borderRadius: radius.pill, paddingVertical: 11, paddingHorizontal: 16 },
  proBtnText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  muted: { color: colors.muted, fontSize: 13, paddingHorizontal: 16 },
  missionRoute: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 8 },
  missionPrice: { fontSize: 18, fontWeight: "800", color: colors.navy900, marginTop: 4 },
});
