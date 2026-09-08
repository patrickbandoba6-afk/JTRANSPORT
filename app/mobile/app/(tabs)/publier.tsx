import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../../lib/theme";
import { Button } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Mission } from "../../lib/api";

export default function Publish() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ fromCity: "", toCity: "", date: "", vehicleType: "Fourgon", cargo: "", weightKg: "", budget: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const data = await apiFetch<{ mission: Mission }>("/api/missions", {
        method: "POST",
        body: JSON.stringify({
          fromCity: form.fromCity,
          toCity: form.toCity,
          date: form.date,
          vehicleType: form.vehicleType,
          cargo: form.cargo,
          weightKg: Number(form.weightKg),
          budget: Number(form.budget),
        }),
      });
      router.push(`/missions/${data.mission.id}`);
    } catch {
      setError("Impossible de publier la mission. Vérifiez les champs (date au format AAAA-MM-JJ).");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return <View style={styles.screen} />;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 100, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>📢 Publier une mission</Text>
        <Text style={styles.muted}>Connectez-vous pour publier une mission.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingTop: 60, gap: 12 }}>
      <Text style={styles.title}>📢 Publier une mission</Text>
      <TextInput style={styles.input} placeholder="Lieu de départ" value={form.fromCity} onChangeText={(v) => update("fromCity", v)} />
      <TextInput style={styles.input} placeholder="Lieu d'arrivée" value={form.toCity} onChangeText={(v) => update("toCity", v)} />
      <TextInput style={styles.input} placeholder="Date (AAAA-MM-JJ)" value={form.date} onChangeText={(v) => update("date", v)} />
      <TextInput style={styles.input} placeholder="Type de véhicule" value={form.vehicleType} onChangeText={(v) => update("vehicleType", v)} />
      <TextInput style={styles.input} placeholder="Type de marchandise" value={form.cargo} onChangeText={(v) => update("cargo", v)} />
      <TextInput style={styles.input} placeholder="Poids (kg)" keyboardType="numeric" value={form.weightKg} onChangeText={(v) => update("weightKg", v)} />
      <TextInput style={styles.input} placeholder="Budget (€)" keyboardType="numeric" value={form.budget} onChangeText={(v) => update("budget", v)} />
      {error && <Text style={styles.muted}>{error}</Text>}
      <Button title={submitting ? "Publication…" : "Publier la mission"} onPress={onSubmit} disabled={submitting} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink, marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 13 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 13, backgroundColor: "#fff" },
});
