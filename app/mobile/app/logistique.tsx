import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Shipment } from "../lib/api";

const WAREHOUSE_STATUSES = ["AT_WAREHOUSE", "GROUPED"];

export default function Logistique() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ shipments: Shipment[] }>("/api/shipments/mine");
      setShipments(data.shipments.filter((s) => WAREHOUSE_STATUSES.includes(s.status)));
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
        <Text style={styles.title}>🏭 Logistique & entreposage</Text>
        <Text style={styles.muted}>Connectez-vous pour voir vos marchandises en entrepôt.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>🏭 Logistique & entreposage</Text>
        <Text style={styles.muted}>
          Marchandises actuellement en entrepôt ou en cours de groupage avant expédition.
        </Text>
      </View>

      <FlatList
        data={shipments ?? []}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          shipments?.length === 0 ? (
            <Text style={styles.muted}>Aucune marchandise en entrepôt actuellement. Ce statut apparaît automatiquement pendant le transit de vos expéditions.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Link href={`/expeditions/${item.id}` as never} asChild>
            <Card>
              <Tag label={item.status === "AT_WAREHOUSE" ? "En entrepôt" : "Groupée"} />
              <Text style={styles.route}>{item.originCity} → {item.destinationCity}</Text>
              <Text style={styles.muted}>{item.parcels?.length ?? 0} colis</Text>
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
});
