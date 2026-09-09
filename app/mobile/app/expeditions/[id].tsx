import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { colors, radius } from "../../lib/theme";
import { Card, Tag } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Shipment } from "../../lib/api";

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Créée", COLLECTED: "Collectée", AT_WAREHOUSE: "En entrepôt",
  GROUPED: "Groupée", IN_CONTAINER: "En conteneur", LOADED: "Chargée",
  DEPARTED: "Partie", IN_TRANSIT: "En transit", ARRIVED: "Arrivée",
  CUSTOMS: "En douane", CUSTOMS_CLEARED: "Dédouanée", OUT_FOR_DELIVERY: "En livraison",
  DELIVERED: "Livrée", INCIDENT: "Incident", CANCELLED: "Annulée",
};

export default function ExpeditionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [shipment, setShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    if (!user) return;
    apiFetch<{ shipment: Shipment }>(`/api/shipments/${id}`)
      .then((d) => setShipment(d.shipment))
      .catch(() => setShipment(null));
  }, [id, user]);

  if (!shipment) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Chargement…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Tag label={STATUS_LABELS[shipment.status] ?? shipment.status} />
        <Text style={styles.route}>{shipment.originCity} ({shipment.originCountry}) → {shipment.destinationCity} ({shipment.destinationCountry})</Text>
        <Text style={styles.muted}>Destinataire : {shipment.recipientName}</Text>
        {shipment.parcels?.map((p) => (
          <Text key={p.id} style={styles.muted}>📦 {p.description} · {p.weightKg} kg</Text>
        ))}
      </Card>

      {shipment.container && (
        <Card>
          <Text style={styles.h2}>🚢 Conteneur</Text>
          <Text style={styles.route}>{shipment.container.containerNumber}</Text>
          <Text style={styles.muted}>{shipment.container.originPort} → {shipment.container.destinationPort}</Text>
        </Card>
      )}

      {shipment.customsCase && (
        <Card>
          <Text style={styles.h2}>🛃 Dossier douanier</Text>
          <Tag label={shipment.customsCase.status} />
          {shipment.customsCase.estimatedFees != null && (
            <View style={styles.estimateNotice}>
              <Text style={styles.estimateText}>
                Estimation : {shipment.customsCase.estimatedFees} € — pas un montant officiel.
              </Text>
            </View>
          )}
        </Card>
      )}

      <View>
        <Text style={styles.h2}>📍 Suivi</Text>
        {(!shipment.events || shipment.events.length === 0) && <Text style={styles.muted}>Aucun événement.</Text>}
        {shipment.events?.map((ev) => (
          <View key={ev.id} style={styles.timelineRow}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.eventType}>{STATUS_LABELS[ev.type] ?? ev.type}</Text>
              <Text style={styles.muted}>
                {new Date(ev.createdAt).toLocaleString("fr-FR")}{ev.location ? ` · ${ev.location}` : ""}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  muted: { color: colors.muted, fontSize: 13, marginTop: 4 },
  route: { fontSize: 17, fontWeight: "800", color: colors.ink, marginTop: 8 },
  h2: { fontSize: 15, fontWeight: "700", color: colors.ink, marginBottom: 10 },
  estimateNotice: { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a", borderRadius: radius.md, padding: 10, marginTop: 8 },
  estimateText: { color: "#92400e", fontSize: 12 },
  timelineRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue500, marginTop: 4 },
  eventType: { fontWeight: "700", fontSize: 14, color: colors.ink },
});
