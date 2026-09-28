import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors, radius } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Contract, type Dispute } from "../lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  RETARD: "Retard", DOMMAGE: "Dommage", COLIS_MANQUANT: "Colis manquant", DOUANE: "Douane",
  DOCUMENTAIRE: "Documentaire", PAIEMENT: "Paiement", DESACCORD_TARIFAIRE: "Désaccord tarifaire", AUTRE: "Autre",
};
const STATUS_LABELS: Record<string, string> = {
  OPEN: "Ouvert", UNDER_REVIEW: "En cours d'examen", RESOLVED: "Résolu", REJECTED: "Rejeté", CLOSED: "Clôturé",
};

export default function Litiges() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [disputes, setDisputes] = useState<Dispute[] | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [contractId, setContractId] = useState("");
  const [category, setCategory] = useState<keyof typeof CATEGORY_LABELS>("AUTRE");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ disputes: Dispute[] }>("/api/disputes/mine");
      setDisputes(data.disputes);
    } catch {
      setDisputes([]);
    }
    try {
      const data = await apiFetch<{ contracts: Contract[] }>("/api/contracts/mine");
      setContracts(data.contracts);
      if (data.contracts[0]) setContractId(data.contracts[0].id);
    } catch {
      setContracts([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function onSubmit() {
    if (!contractId) {
      setError("Vous devez avoir au moins un contrat pour ouvrir un litige.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/disputes", {
        method: "POST",
        body: JSON.stringify({ contractId, category, description }),
      });
      setShowForm(false);
      setDescription("");
      await load();
    } catch {
      setError("Impossible d'ouvrir ce litige.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>🆘 Gestion des litiges</Text>
        <Text style={styles.muted}>Connectez-vous pour ouvrir ou suivre un litige.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={styles.title}>🆘 Gestion des litiges</Text>
        <Text style={styles.muted}>Retard, dommage, colis manquant, désaccord… ouvrez un litige lié à un contrat.</Text>
        <View style={{ height: 10 }} />
        <Button title={showForm ? "Annuler" : "+ Ouvrir un litige"} variant={showForm ? "secondary" : "primary"} onPress={() => setShowForm((s) => !s)} disabled={contracts.length === 0} />
        {contracts.length === 0 && <Text style={styles.muted}>Aucun contrat disponible pour ouvrir un litige.</Text>}
      </View>

      {showForm && (
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 16 }}>
          <Text style={styles.muted}>Contrat concerné :</Text>
          <View style={styles.chipRow}>
            {contracts.map((c) => (
              <Text key={c.id} onPress={() => setContractId(c.id)} style={[styles.chip, contractId === c.id && styles.chipActive]}>
                {c.id.slice(0, 8)} · {c.price} €
              </Text>
            ))}
          </View>
          <Text style={styles.muted}>Catégorie :</Text>
          <View style={styles.chipRow}>
            {Object.keys(CATEGORY_LABELS).map((k) => (
              <Text key={k} onPress={() => setCategory(k as keyof typeof CATEGORY_LABELS)} style={[styles.chip, category === k && styles.chipActive]}>
                {CATEGORY_LABELS[k]}
              </Text>
            ))}
          </View>
          <TextInput style={[styles.input, { height: 90 }]} placeholder="Décrivez le problème" multiline value={description} onChangeText={setDescription} />
          {error && <Text style={styles.muted}>{error}</Text>}
          <Button title={submitting ? "Envoi…" : "Ouvrir le litige"} onPress={onSubmit} disabled={submitting || !description} />
        </View>
      )}

      <FlatList
        data={disputes ?? []}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={disputes?.length === 0 ? <Text style={styles.muted}>Aucun litige pour le moment.</Text> : null}
        renderItem={({ item }) => (
          <Link href={`/litiges/${item.id}` as never} asChild>
            <Card>
              <Tag label={CATEGORY_LABELS[item.category] ?? item.category} />
              <Tag label={STATUS_LABELS[item.status] ?? item.status} />
              <Text style={styles.route}>{item.description}</Text>
              <Text style={styles.muted}>{item._count?.messages ?? 0} message(s)</Text>
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
  route: { fontSize: 14, fontWeight: "700", color: colors.ink, marginTop: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, backgroundColor: "#fff" },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8, fontSize: 11, color: colors.ink, backgroundColor: "#fff" },
  chipActive: { backgroundColor: colors.blue600, borderColor: colors.blue600, color: "#fff" },
});
