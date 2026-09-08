import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { colors, radius } from "../../lib/theme";
import { Card, Tag, Button } from "../../components/ui";
import { apiFetch, type Mission } from "../../lib/api";

export default function Missions() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromCity) params.set("fromCity", fromCity);
      if (toCity) params.set("toCity", toCity);
      const data = await apiFetch<{ missions: Mission[] }>(`/api/missions?${params.toString()}`);
      setMissions(data.missions);
    } catch {
      setMissions([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>🔎 Rechercher une mission</Text>
      <View style={styles.filters}>
        <TextInput placeholder="Départ" value={fromCity} onChangeText={setFromCity} style={styles.input} />
        <TextInput placeholder="Destination" value={toCity} onChangeText={setToCity} style={styles.input} />
        <Button title={loading ? "Recherche…" : "Rechercher"} onPress={search} disabled={loading} />
      </View>

      <FlatList
        data={missions}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={searched ? <Text style={styles.muted}>Aucune mission trouvée.</Text> : null}
        renderItem={({ item }) => (
          <Link href={`/missions/${item.id}`} asChild>
            <Card>
              <Tag label={item.vehicleType} />
              <Text style={styles.route}>{item.fromCity} → {item.toCity}</Text>
              <Text style={styles.muted}>{item.cargo} · {item.weightKg} kg</Text>
              <Text style={styles.price}>{item.budget} €</Text>
            </Card>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink, paddingHorizontal: 16, marginBottom: 12 },
  filters: { paddingHorizontal: 16, gap: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, backgroundColor: "#fff" },
  muted: { color: colors.muted, fontSize: 13 },
  route: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 8 },
  price: { fontSize: 18, fontWeight: "800", color: colors.navy900, marginTop: 4 },
});
