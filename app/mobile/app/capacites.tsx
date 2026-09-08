import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";
import { Card, Tag } from "../components/ui";
import { apiFetch, type TransportCapacity } from "../lib/api";

export default function Capacites() {
  const [capacities, setCapacities] = useState<TransportCapacity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ capacities: TransportCapacity[] }>("/api/capacities")
      .then((data) => setCapacities(data.capacities))
      .catch(() => setCapacities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={[styles.title, { padding: 16, paddingTop: 60 }]}>🚚 Capacités disponibles</Text>
      {loading && <Text style={[styles.muted, { paddingHorizontal: 16 }]}>Chargement…</Text>}
      <FlatList
        data={capacities}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={!loading ? <Text style={styles.muted}>Aucune capacité publiée pour le moment.</Text> : null}
        renderItem={({ item }) => (
          <Card>
            <Tag label={item.vehicleType} />
            <Tag label={item.organization?.verificationStatus ?? ""} />
            <Text style={styles.orgName}>{item.organization?.name}</Text>
            <Text style={styles.muted}>Zone : {item.zone}</Text>
            <Text style={styles.muted}>Capacité : {item.weightCapacityKg} kg</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  muted: { color: colors.muted, fontSize: 13, marginTop: 4 },
  orgName: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 8 },
});
