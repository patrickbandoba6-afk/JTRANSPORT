import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Shipment } from "../lib/api";

const CUSTOMS_LABELS: Record<string, string> = {
  DOCUMENTS_PENDING: "Documents en attente", SUBMITTED: "Dossier soumis",
  UNDER_REVIEW: "En cours d'examen", CLEARED: "Dédouané", BLOCKED: "Bloqué",
};

export default function Douane() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ shipments: Shipment[] }>("/api/shipments/mine");
      setShipments(data.shipments.filter((s) => s.customsCase));
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
        <Text style={styles.title}>🛃 Douane & dédouanement</Text>
        <Text style={styles.muted}>Connectez-vous pour voir vos dossiers douaniers.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>🛃 Douane & dédouanement</Text>
        <Text style={styles.muted}>
          Dossiers douaniers ouverts automatiquement pour toute expédition internationale. Estimations de frais
          uniquement — jamais un montant officiel tant qu'une administration/courtier ne l'a pas notifié.
        </Text>
      </View>

      <FlatList
        data={shipments ?? []}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          shipments?.length === 0 ? (
            <Text style={styles.muted}>Aucun dossier douanier — apparaît automatiquement dès qu'une expédition traverse une frontière.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Link href={`/expeditions/${item.id}` as never} asChild>
            <Card>
              <Tag label={CUSTOMS_LABELS[item.customsCase!.status] ?? item.customsCase!.status} />
              <Text style={styles.route}>
                {item.originCity} ({item.originCountry}) → {item.destinationCity} ({item.destinationCountry})
              </Text>
              {item.customsCase!.hsCode && <Text style={styles.muted}>Code SH : {item.customsCase!.hsCode}</Text>}
              {item.customsCase!.estimatedFees != null && (
                <Text style={styles.muted}>Estimation frais : {item.customsCase!.estimatedFees} € (indicatif)</Text>
              )}
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
