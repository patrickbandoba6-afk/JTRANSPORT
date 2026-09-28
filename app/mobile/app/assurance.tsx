import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, apiUpload, type Contract, type DocumentRecord } from "../lib/api";

export default function Assurance() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [docCounts, setDocCounts] = useState<Record<string, number>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ contracts: Contract[] }>("/api/contracts/mine");
      setContracts(data.contracts);
      const counts: Record<string, number> = {};
      await Promise.all(
        data.contracts.map(async (c) => {
          try {
            const docs = await apiFetch<{ documents: DocumentRecord[] }>(`/api/documents?dossierType=CONTRACT&dossierId=${c.id}`);
            counts[c.id] = docs.documents.filter((d) => d.type === "ASSURANCE").length;
          } catch {
            counts[c.id] = 0;
          }
        }),
      );
      setDocCounts(counts);
    } catch {
      setContracts([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function addProof(contractId: string) {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Autorisez l'accès à la caméra pour scanner l'attestation d'assurance.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (result.canceled || !result.assets?.[0]) return;

    setBusyId(contractId);
    setError(null);
    try {
      const form = new FormData();
      form.append("dossierType", "CONTRACT");
      form.append("dossierId", contractId);
      form.append("type", "ASSURANCE");
      form.append("file", { uri: result.assets[0].uri, name: `assurance-${Date.now()}.jpg`, type: "image/jpeg" } as unknown as Blob);
      await apiUpload("/api/documents", form);
      await load();
    } catch {
      setError("Impossible d'enregistrer cette attestation d'assurance.");
    } finally {
      setBusyId(null);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>🛡️ Assurance Transport</Text>
        <Text style={styles.muted}>Connectez-vous pour gérer les attestations d'assurance de vos contrats.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>🛡️ Assurance Transport</Text>
        <Text style={styles.muted}>
          Rattachez l'attestation d'assurance de chaque contrat à son dossier documentaire — accessible aux deux
          parties et à la douane si besoin. JTransport ne vend pas de police d'assurance : il centralise vos
          justificatifs.
        </Text>
        {error && <Text style={[styles.muted, { color: "#dc2626" }]}>{error}</Text>}
      </View>

      <FlatList
        data={contracts ?? []}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={contracts?.length === 0 ? <Text style={styles.muted}>Aucun contrat pour le moment.</Text> : null}
        renderItem={({ item }) => (
          <Card>
            <Tag label={item.type} />
            <Text style={styles.route}>Contrat {item.id.slice(0, 8)} · {item.price} €</Text>
            <Text style={styles.muted}>
              {docCounts[item.id] > 0 ? `✅ ${docCounts[item.id]} attestation(s) jointe(s)` : "Aucune attestation jointe"}
            </Text>
            <Button
              title={busyId === item.id ? "Envoi…" : "📷 Scanner une attestation"}
              variant="secondary"
              onPress={() => addProof(item.id)}
              disabled={busyId === item.id}
            />
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
  route: { fontSize: 15, fontWeight: "700", color: colors.ink, marginTop: 8 },
});
