import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors, radius } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Shipment } from "../lib/api";

const MODE_LABELS: Record<string, string> = {
  ROUTIER: "Routier", MARITIME: "Maritime", AERIEN: "Aérien", FERROVIAIRE: "Ferroviaire", MULTIMODAL: "Multimodal",
};

export default function ImportExport() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ shipments: Shipment[] }>("/api/shipments/mine");
      setShipments(data.shipments.filter((s) => s.originCountry.toUpperCase() !== s.destinationCountry.toUpperCase()));
    } catch {
      setShipments([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>🌍 Import / Export</Text>
        <Text style={styles.muted}>Connectez-vous pour voir vos flux internationaux.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  const exportCount = shipments?.filter((s) => s.originCountry.toUpperCase() === "FR").length ?? 0;
  const importCount = (shipments?.length ?? 0) - exportCount;

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>🌍 Import / Export</Text>
        <Text style={styles.muted}>Toutes vos expéditions internationales, tous modes confondus.</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{exportCount}</Text>
            <Text style={styles.statLabel}>Exports</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{importCount}</Text>
            <Text style={styles.statLabel}>Imports</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={shipments ?? []}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={shipments?.length === 0 ? <Text style={styles.muted}>Aucun flux international pour le moment.</Text> : null}
        renderItem={({ item }) => (
          <Link href={`/expeditions/${item.id}` as never} asChild>
            <Card>
              <Tag label={MODE_LABELS[item.mode] ?? item.mode} />
              <Text style={styles.route}>
                {item.originCity} ({item.originCountry}) → {item.destinationCity} ({item.destinationCountry})
              </Text>
              {item.customsCase && <Text style={styles.muted}>🛃 Dossier douanier : {item.customsCase.status}</Text>}
            </Card>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  muted: { color: colors.muted, fontSize: 13, marginTop: 4 },
  route: { fontSize: 15, fontWeight: "700", color: colors.ink, marginTop: 8 },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  statCard: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "800", color: colors.navy900 },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
});
