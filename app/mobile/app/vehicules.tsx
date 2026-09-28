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

export default function Vehicules() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    originCity: "", originCountry: "FR", destinationCity: "", destinationCountry: "FR",
    recipientName: "", recipientAddress: "", make: "", model: "", year: "", plate: "", condition: "ROULANT",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ shipments: Shipment[] }>("/api/shipments/mine");
      setShipments(data.shipments.filter((s) => s.cargoType === "VEHICULE"));
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
          mode: "ROUTIER",
          cargoType: "VEHICULE",
          vehicles: [{ make: form.make, model: form.model, year: form.year ? Number(form.year) : undefined, plate: form.plate || undefined, condition: form.condition }],
        }),
      });
      router.push(`/expeditions/${data.shipment.id}` as never);
    } catch {
      setError("Impossible de créer ce transport de véhicule.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>🚗 Transport de véhicules</Text>
        <Text style={styles.muted}>Connectez-vous pour expédier un véhicule.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>🚗 Transport de véhicules</Text>
        <Text style={styles.muted}>Voiture, moto, utilitaire — roulant ou non roulant.</Text>
        <View style={{ height: 10 }} />
        <Button title={showForm ? "Annuler" : "+ Nouveau transport de véhicule"} variant={showForm ? "secondary" : "primary"} onPress={() => setShowForm((s) => !s)} />
      </View>

      {showForm && (
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 12 }}>
          <TextInput style={styles.input} placeholder="Ville de départ" value={form.originCity} onChangeText={(v) => setForm((f) => ({ ...f, originCity: v }))} />
          <TextInput style={styles.input} placeholder="Pays de départ (FR)" value={form.originCountry} onChangeText={(v) => setForm((f) => ({ ...f, originCountry: v }))} />
          <TextInput style={styles.input} placeholder="Ville de destination" value={form.destinationCity} onChangeText={(v) => setForm((f) => ({ ...f, destinationCity: v }))} />
          <TextInput style={styles.input} placeholder="Pays de destination" value={form.destinationCountry} onChangeText={(v) => setForm((f) => ({ ...f, destinationCountry: v }))} />
          <TextInput style={styles.input} placeholder="Nom du destinataire" value={form.recipientName} onChangeText={(v) => setForm((f) => ({ ...f, recipientName: v }))} />
          <TextInput style={styles.input} placeholder="Adresse du destinataire" value={form.recipientAddress} onChangeText={(v) => setForm((f) => ({ ...f, recipientAddress: v }))} />
          <TextInput style={styles.input} placeholder="Marque" value={form.make} onChangeText={(v) => setForm((f) => ({ ...f, make: v }))} />
          <TextInput style={styles.input} placeholder="Modèle" value={form.model} onChangeText={(v) => setForm((f) => ({ ...f, model: v }))} />
          <TextInput style={styles.input} placeholder="Année" keyboardType="numeric" value={form.year} onChangeText={(v) => setForm((f) => ({ ...f, year: v }))} />
          <TextInput style={styles.input} placeholder="Plaque d'immatriculation" value={form.plate} onChangeText={(v) => setForm((f) => ({ ...f, plate: v }))} />
          {error && <Text style={styles.muted}>{error}</Text>}
          <Button title={submitting ? "Création…" : "Créer le transport"} onPress={onSubmit} disabled={submitting} />
        </View>
      )}

      <FlatList
        data={shipments ?? []}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={shipments?.length === 0 ? <Text style={styles.muted}>Aucun véhicule en transport pour le moment.</Text> : null}
        renderItem={({ item }) => (
          <Link href={`/expeditions/${item.id}` as never} asChild>
            <Card>
              <Tag label={STATUS_LABELS[item.status] ?? item.status} />
              <Text style={styles.route}>{item.originCity} → {item.destinationCity}</Text>
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
