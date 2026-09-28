import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { colors, radius } from "../../lib/theme";
import { Button, Card, Tag } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Dispute } from "../../lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  RETARD: "Retard", DOMMAGE: "Dommage", COLIS_MANQUANT: "Colis manquant", DOUANE: "Douane",
  DOCUMENTAIRE: "Documentaire", PAIEMENT: "Paiement", DESACCORD_TARIFAIRE: "Désaccord tarifaire", AUTRE: "Autre",
};
const STATUS_LABELS: Record<string, string> = {
  OPEN: "Ouvert", UNDER_REVIEW: "En cours d'examen", RESOLVED: "Résolu", REJECTED: "Rejeté", CLOSED: "Clôturé",
};

export default function LitigeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ dispute: Dispute }>(`/api/disputes/${id}`);
      setDispute(data.dispute);
    } catch {
      setDispute(null);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (user) load();
    }, [user, load]),
  );

  async function send() {
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/disputes/${id}/messages`, { method: "POST", body: JSON.stringify({ body }) });
      setBody("");
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  if (!dispute) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Chargement…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Tag label={CATEGORY_LABELS[dispute.category] ?? dispute.category} />
        <Tag label={STATUS_LABELS[dispute.status] ?? dispute.status} />
        <Text style={styles.desc}>{dispute.description}</Text>
        {dispute.resolution && (
          <View style={styles.resolutionBox}>
            <Text style={styles.h2}>Résolution</Text>
            <Text style={styles.muted}>{dispute.resolution}</Text>
            {dispute.refundAmount != null && <Text style={styles.muted}>Remboursement décidé : {dispute.refundAmount} €</Text>}
          </View>
        )}
      </Card>

      <View>
        <Text style={styles.h2}>Échanges</Text>
        {(dispute.messages ?? []).length === 0 && <Text style={styles.muted}>Aucun message pour le moment.</Text>}
        {dispute.messages?.map((m) => (
          <View key={m.id} style={[styles.messageBubble, m.authorId === user?.id && styles.messageBubbleMine]}>
            <Text style={styles.messageAuthor}>{m.author?.name ?? "—"}</Text>
            <Text style={styles.messageBody}>{m.body}</Text>
            <Text style={styles.messageDate}>{new Date(m.createdAt).toLocaleString("fr-FR")}</Text>
          </View>
        ))}
      </View>

      {dispute.status !== "CLOSED" && (
        <View style={{ gap: 10 }}>
          <TextInput style={[styles.input, { height: 70 }]} placeholder="Écrire un message…" multiline value={body} onChangeText={setBody} />
          <Button title={submitting ? "Envoi…" : "Envoyer"} onPress={send} disabled={submitting || !body.trim()} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  h2: { fontSize: 15, fontWeight: "700", color: colors.ink, marginBottom: 10 },
  muted: { color: colors.muted, fontSize: 12, marginTop: 4 },
  desc: { color: colors.ink, fontSize: 14, marginTop: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, backgroundColor: "#fff" },
  resolutionBox: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  messageBubble: { backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 10, marginBottom: 8 },
  messageBubbleMine: { backgroundColor: "#eaf1ff" },
  messageAuthor: { fontSize: 11, fontWeight: "700", color: colors.ink },
  messageBody: { fontSize: 13, color: colors.ink, marginTop: 3 },
  messageDate: { fontSize: 10, color: colors.muted, marginTop: 4 },
});
