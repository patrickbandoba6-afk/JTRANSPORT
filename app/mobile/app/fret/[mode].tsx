import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../../lib/theme";
import { Button, Card, Tag } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Shipment } from "../../lib/api";

const MODE_CONFIG: Record<string, { title: string; emoji: string; apiMode: string; hint: string }> = {
  maritime: { title: "Fret maritime", emoji: "🚢", apiMode: "MARITIME", hint: "Conteneurs FCL/LCL, ports au départ et à l'arrivée." },
  aerien: { title: "Fret aérien", emoji: "✈️", apiMode: "AERIEN", hint: "Envois par avion, délais courts." },
  ferroviaire: { title: "Fret ferroviaire", emoji: "🚆", apiMode: "FERROVIAIRE", hint: "Wagons et capacité ferroviaire." },
};

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Créée", COLLECTED: "Collectée", AT_WAREHOUSE: "En entrepôt",
  GROUPED: "Groupée", IN_CONTAINER: "En conteneur", LOADED: "Chargée",
  DEPARTED: "Partie", IN_TRANSIT: "En transit", ARRIVED: "Arrivée",
  CUSTOMS: "En douane", CUSTOMS_CLEARED: "Dédouanée", OUT_FOR_DELIVERY: "En livraison",
  DELIVERED: "Livrée", INCIDENT: "Incident", CANCELLED: "Annulée",
};

export default function FretMode() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const config = MODE_CONFIG[mode] ?? MODE_CONFIG.maritime;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    originCity: "", originCountry: "FR", originPort: "", destinationCity: "", destinationCountry: "FR", destinationPort: "",
    recipientName: "", recipientAddress: "", description: "", weightKg: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ shipments: Shipment[] }>("/api/shipments/mine");
      setShipments(data.shipments.filter((s) => s.mode === config.apiMode));
    } catch {
      setShipments([]);
    }
  }, [config.apiMode]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function onSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const data = await apiFetch<{ shipment: Shipment }>("/api/shipments", {
        method: "POST",
        body: JSON.stringify({
          originCity: form.originCity,
          originCountry: form.originCountry,
          destinationCity: form.destinationCity,
          destinationCountry: form.destinationCountry,
          recipientName: form.recipientName,
          recipientAddress: form.recipientAddress,
          mode: config.apiMode,
          cargoType: "MARCHANDISE",
          parcels: [{ description: form.description, weightKg: Number(form.weightKg) }],
        }),
      });
      router.push(`/expeditions/${data.shipment.id}` as never);
    } catch {
      setError("Impossible de créer cette expédition.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>{config.emoji} {config.title}</Text>
        <Text style={styles.muted}>Connectez-vous pour créer et suivre une expédition {config.title.toLowerCase()}.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>{config.emoji} {config.title}</Text>
        <Text style={styles.muted}>{config.hint}</Text>
        <View style={{ height: 10 }} />
        <Button title={showForm ? "Annuler" : "+ Nouvelle expédition"} variant={showForm ? "secondary" : "primary"} onPress={() => setShowForm((s) => !s)} />
      </View>

      {showForm && (
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 12 }}>
          <TextInput style={styles.input} placeholder="Ville de départ" value={form.originCity} onChangeText={(v) => setForm((f) => ({ ...f, originCity: v }))} />
          <TextInput style={styles.input} placeholder="Pays de départ (FR)" value={form.originCountry} onChangeText={(v) => setForm((f) => ({ ...f, originCountry: v }))} />
          <TextInput style={styles.input} placeholder="Ville de destination" value={form.destinationCity} onChangeText={(v) => setForm((f) => ({ ...f, destinationCity: v }))} />
          <TextInput style={styles.input} placeholder="Pays de destination" value={form.destinationCountry} onChangeText={(v) => setForm((f) => ({ ...f, destinationCountry: v }))} />
          <TextInput style={styles.input} placeholder="Nom du destinataire" value={form.recipientName} onChangeText={(v) => setForm((f) => ({ ...f, recipientName: v }))} />
          <TextInput style={styles.input} placeholder="Adresse du destinataire" value={form.recipientAddress} onChangeText={(v) => setForm((f) => ({ ...f, recipientAddress: v }))} />
          <TextInput style={styles.input} placeholder="Description de la marchandise" value={form.description} onChangeText={(v) => setForm((f) => ({ ...f, description: v }))} />
          <TextInput style={styles.input} placeholder="Poids (kg)" keyboardType="numeric" value={form.weightKg} onChangeText={(v) => setForm((f) => ({ ...f, weightKg: v }))} />
          {error && <Text style={styles.muted}>{error}</Text>}
          <Button title={submitting ? "Création…" : "Créer l'expédition"} onPress={onSubmit} disabled={submitting} />
        </View>
      )}

      <FlatList
        data={shipments ?? []}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={shipments?.length === 0 ? <Text style={styles.muted}>Aucune expédition {config.title.toLowerCase()} pour le moment.</Text> : null}
        renderItem={({ item }) => (
          <Link href={`/expeditions/${item.id}` as never} asChild>
            <Card>
              <Tag label={STATUS_LABELS[item.status] ?? item.status} />
              <Text style={styles.route}>{item.originCity} → {item.destinationCity}</Text>
              <Text style={styles.muted}>{item.parcels?.length ?? 0} colis · {item.container ? `conteneur ${item.container.containerNumber}` : "sans conteneur assigné"}</Text>
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
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, backgroundColor: "#fff" },
});
