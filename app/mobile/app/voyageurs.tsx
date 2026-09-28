import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { colors, radius } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Mission } from "../lib/api";

const VEHICLE_TYPES = ["Taxi/VTC", "Minibus", "Autocar"];

export default function Voyageurs() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fromCity: "", toCity: "", date: "", vehicleType: VEHICLE_TYPES[0], seats: "", budget: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: "VOYAGEURS" });
      if (fromCity) params.set("fromCity", fromCity);
      if (toCity) params.set("toCity", toCity);
      const data = await apiFetch<{ missions: Mission[] }>(`/api/missions?${params.toString()}`);
      setTrips(data.missions);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [fromCity, toCity]);

  useFocusEffect(
    useCallback(() => {
      search();
    }, [search]),
  );

  async function onSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const data = await apiFetch<{ mission: Mission }>("/api/missions", {
        method: "POST",
        body: JSON.stringify({
          category: "VOYAGEURS",
          fromCity: form.fromCity,
          toCity: form.toCity,
          date: form.date,
          vehicleType: form.vehicleType,
          seats: Number(form.seats),
          budget: Number(form.budget),
        }),
      });
      setShowForm(false);
      router.push(`/missions/${data.mission.id}` as never);
    } catch {
      setError("Impossible de publier ce trajet. Vérifiez les champs (date au format AAAA-MM-JJ).");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>🚌 Transport de voyageurs</Text>
        <Text style={styles.muted}>Taxi/VTC, minibus, autocar — trajets pour personnes.</Text>
      </View>

      {!user ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.muted}>Connectez-vous pour publier ou réserver un trajet voyageurs.</Text>
          <View style={{ height: 12 }} />
          <Button title="Se connecter" onPress={() => router.push("/login")} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <Button title={showForm ? "Annuler" : "+ Publier un trajet voyageurs"} variant={showForm ? "secondary" : "primary"} onPress={() => setShowForm((s) => !s)} />
        </View>
      )}

      {showForm && (
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 16 }}>
          <TextInput style={styles.input} placeholder="Lieu de départ" value={form.fromCity} onChangeText={(v) => setForm((f) => ({ ...f, fromCity: v }))} />
          <TextInput style={styles.input} placeholder="Lieu d'arrivée" value={form.toCity} onChangeText={(v) => setForm((f) => ({ ...f, toCity: v }))} />
          <TextInput style={styles.input} placeholder="Date (AAAA-MM-JJ)" value={form.date} onChangeText={(v) => setForm((f) => ({ ...f, date: v }))} />
          <View style={styles.chipRow}>
            {VEHICLE_TYPES.map((v) => (
              <Text
                key={v}
                onPress={() => setForm((f) => ({ ...f, vehicleType: v }))}
                style={[styles.chip, form.vehicleType === v && styles.chipActive]}
              >
                {v}
              </Text>
            ))}
          </View>
          <TextInput style={styles.input} placeholder="Places disponibles" keyboardType="numeric" value={form.seats} onChangeText={(v) => setForm((f) => ({ ...f, seats: v }))} />
          <TextInput style={styles.input} placeholder="Prix par place (€)" keyboardType="numeric" value={form.budget} onChangeText={(v) => setForm((f) => ({ ...f, budget: v }))} />
          {error && <Text style={styles.muted}>{error}</Text>}
          <Button title={submitting ? "Publication…" : "Publier le trajet"} onPress={onSubmit} disabled={submitting} />
        </View>
      )}

      <View style={styles.filters}>
        <TextInput placeholder="Départ" value={fromCity} onChangeText={setFromCity} style={styles.input} />
        <TextInput placeholder="Destination" value={toCity} onChangeText={setToCity} style={styles.input} />
        <Button title={loading ? "Recherche…" : "Rechercher"} onPress={search} disabled={loading} />
      </View>

      <FlatList
        data={trips}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={!loading ? <Text style={styles.muted}>Aucun trajet voyageurs publié pour le moment.</Text> : null}
        renderItem={({ item }) => (
          <Link href={`/missions/${item.id}` as never} asChild>
            <Card>
              <Tag label={item.vehicleType} />
              <Text style={styles.route}>{item.fromCity} → {item.toCity}</Text>
              <Text style={styles.muted}>{new Date(item.date).toLocaleDateString("fr-FR")} · {item.seats} places</Text>
              <Text style={styles.price}>{item.budget} € / place</Text>
            </Card>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink, marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 13, marginTop: 2 },
  filters: { paddingHorizontal: 16, gap: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, backgroundColor: "#fff" },
  route: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 8 },
  price: { fontSize: 18, fontWeight: "800", color: colors.navy900, marginTop: 4 },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: colors.ink,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: colors.blue600, borderColor: colors.blue600, color: "#fff" },
});
