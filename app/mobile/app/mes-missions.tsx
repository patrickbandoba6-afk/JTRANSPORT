import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Mission } from "../lib/api";

export default function MesMissions() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[] | null>(null);

  useEffect(() => {
    if (!user) return;
    apiFetch<{ missions: Mission[] }>("/api/missions?mine=true")
      .then((data) => setMissions(data.missions))
      .catch(() => setMissions([]));
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>📋 Mes missions</Text>
        <Text style={styles.muted}>Connectez-vous pour voir vos missions publiées.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={[styles.title, { padding: 16, paddingTop: 60 }]}>📋 Mes missions</Text>
      <FlatList
        data={missions ?? []}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={missions?.length === 0 ? <Text style={styles.muted}>Aucune mission publiée.</Text> : null}
        renderItem={({ item }) => (
          <Link href={`/missions/${item.id}`} asChild>
            <Card>
              <Tag label={item.vehicleType} />
              <Tag label={item.status} />
              <Text style={styles.route}>{item.fromCity} → {item.toCity}</Text>
              <Text style={styles.muted}>{item.cargo} · {item.weightKg} kg</Text>
              <Text style={styles.price}>{item.budget} €</Text>
              <Text style={styles.muted}>{item._count?.offers ?? 0} offre(s) reçue(s)</Text>
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
  route: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 8 },
  price: { fontSize: 18, fontWeight: "800", color: colors.navy900, marginTop: 4 },
});
