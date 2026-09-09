import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors, radius } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Shipment } from "../lib/api";

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Créée", COLLECTED: "Collectée", AT_WAREHOUSE: "En entrepôt",
  GROUPED: "Groupée", IN_CONTAINER: "En conteneur", LOADED: "Chargée",
  DEPARTED: "Partie", IN_TRANSIT: "En transit", ARRIVED: "Arrivée",
  CUSTOMS: "En douane", CUSTOMS_CLEARED: "Dédouanée", OUT_FOR_DELIVERY: "En livraison",
  DELIVERED: "Livrée", INCIDENT: "Incident", CANCELLED: "Annulée",
};

export default function Expeditions() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    originCity: "", originCountry: "FR", destinationCity: "", destinationCountry: "FR",
    recipientName: "", recipientAddress: "", description: "", weightKg: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ shipments: Shipment[] }>("/api/shipments/mine");
      setShipments(data.shipments);
    } catch {
      setShipments([]);
    }
  }, []);

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
          parcels: [{ description: form.description, weightKg: Number(form.weightKg) }],
        }),
      });
      router.push(`/expeditions/${data.shipment.id}` as never);
    } catch {
      setError("Impossible de créer l'expédition.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>📮 Mes expéditions</Text>
        <Text style={styles.muted}>Connectez-vous pour envoyer et suivre un colis.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>📮 Mes expéditions</Text>
        <Button title={showForm ? "Annuler" : "+ Envoyer un colis"} variant={showForm ? "secondary" : "primary"} onPress={() => setShowForm((s) => !s)} />
      </View>

      {showForm && (
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 12 }}>
          <TextInput style={styles.input} placeholder="Ville de départ" value={form.originCity} onChangeText={(v) => setForm((f) => ({ ...f, originCity: v }))} />
          <TextInput style={styles.input} placeholder="Pays de départ (FR)" value={form.originCountry} onChangeText={(v) => setForm((f) => ({ ...f, originCountry: v }))} />
          <TextInput style={styles.input} placeholder="Ville de destination" value={form.destinationCity} onChangeText={(v) => setForm((f) => ({ ...f, destinationCity: v }))} />
          <TextInput style={styles.input} placeholder="Pays de destination" value={form.destinationCountry} onChangeText={(v) => setForm((f) => ({ ...f, destinationCountry: v }))} />
          <TextInput style={styles.input} placeholder="Nom du destinataire" value={form.recipientName} onChangeText={(v) => setForm((f) => ({ ...f, recipientName: v }))} />
          <TextInput style={styles.input} placeholder="Adresse du destinataire" value={form.recipientAddress} onChangeText={(v) => setForm((f) => ({ ...f, recipientAddress: v }))} />
          <TextInput style={styles.input} placeholder="Description du colis" value={form.description} onChangeText={(v) => setForm((f) => ({ ...f, description: v }))} />
          <TextInput style={styles.input} placeholder="Poids (kg)" keyboardType="numeric" value={form.weightKg} onChangeText={(v) => setForm((f) => ({ ...f, weightKg: v }))} />
          {error && <Text style={styles.muted}>{error}</Text>}
          <Button title={submitting ? "Création…" : "Créer l'expédition"} onPress={onSubmit} disabled={submitting} />
        </View>
      )}

      <FlatList
        data={shipments ?? []}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={shipments?.length === 0 ? <Text style={styles.muted}>Aucune expédition pour le moment.</Text> : null}
        renderItem={({ item }) => (
          <Link href={`/expeditions/${item.id}` as never} asChild>
            <Card>
              <Tag label={STATUS_LABELS[item.status] ?? item.status} />
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
  title: { fontSize: 20, fontWeight: "800", color: colors.ink, marginBottom: 12 },
  muted: { color: colors.muted, fontSize: 13, marginTop: 4 },
  route: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, backgroundColor: "#fff" },
});
