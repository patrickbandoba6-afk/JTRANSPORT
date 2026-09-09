import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../lib/theme";
import { Button, Card, Tag } from "../../components/ui";
import { SignaturePad, type Stroke } from "../../components/SignaturePad";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type Contract, type DocumentRecord } from "../../lib/api";

export default function ContratDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ contract: Contract }>(`/api/contracts/${id}`);
      setContract(data.contract);
    } catch {
      setContract(null);
    }
    try {
      const docs = await apiFetch<{ documents: DocumentRecord[] }>(
        `/api/documents?dossierType=CONTRACT&dossierId=${id}`,
      );
      setDocuments(docs.documents);
    } catch {
      setDocuments([]);
    }
  }, [id]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function sign() {
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch(`/api/contracts/${id}/sign`, {
        method: "POST",
        body: JSON.stringify({
          acceptedTerms: accepted,
          signaturePath: JSON.stringify(strokes),
        }),
      });
      await load();
      setStrokes([]);
    } catch {
      setError("Signature impossible (contrat déjà signé de votre part ?).");
    } finally {
      setSubmitting(false);
    }
  }

  if (!contract) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Chargement…</Text>
      </View>
    );
  }

  const isOwner = contract.ownerId === user?.id;
  const alreadySigned = isOwner ? contract.ownerSignedAt : contract.counterpartySignedAt;
  const canSign = !alreadySigned && contract.status !== "FULLY_SIGNED" && contract.status !== "CANCELLED";
  const signatureDrawn = strokes.some((s) => s.length > 1);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Tag label={contract.type} />
        <Tag label={contract.status} />
        <Text style={styles.price}>{contract.price} €</Text>
        <Text style={styles.muted}>Vous êtes : {isOwner ? "donneur d'ordre" : "prestataire"}</Text>
        {contract.terms && <Text style={styles.terms}>{contract.terms}</Text>}
      </Card>

      <Card>
        <Text style={styles.h2}>Documents du contrat</Text>
        {documents.length === 0 && (
          <Text style={styles.muted}>
            Aucun document joint. Les pièces (contrat signé, conditions générales) s'ajoutent depuis le coffre-fort
            documentaire.
          </Text>
        )}
        {documents.map((doc) => (
          <View key={doc.id} style={styles.docRow}>
            <Ionicons name="document-text" size={22} color="#dc2626" />
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doc.filename}</Text>
              <Text style={styles.muted}>
                {doc.type} · {(doc.sizeBytes / 1024).toFixed(0)} Ko
              </Text>
            </View>
          </View>
        ))}
      </Card>

      {alreadySigned && (
        <Card>
          <Text style={styles.h2}>✅ Signé de votre part</Text>
          <Text style={styles.muted}>Le {new Date(alreadySigned).toLocaleString("fr-FR")}</Text>
          {contract.status === "FULLY_SIGNED" && (
            <Text style={styles.muted}>Les deux parties ont signé — le contrat est complet.</Text>
          )}
        </Card>
      )}

      {canSign && (
        <Card>
          <Pressable style={styles.checkboxRow} onPress={() => setAccepted((a) => !a)}>
            <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
              {accepted && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>J'accepte les conditions générales</Text>
          </Pressable>

          <View style={{ height: 14 }} />
          <SignaturePad strokes={strokes} onStrokesChange={setStrokes} />

          <Text style={styles.legal}>
            Signature interne horodatée et tracée. Ce n'est pas une signature électronique qualifiée : une telle
            signature nécessite un prestataire conforme, qui se branche ici via l'adaptateur prévu.
          </Text>

          {error && <Text style={styles.muted}>{error}</Text>}
          <View style={{ height: 12 }} />
          <Button
            title={submitting ? "Signature…" : "Signer le contrat"}
            onPress={sign}
            disabled={submitting || !accepted || !signatureDrawn}
          />
          {!accepted && <Text style={styles.muted}>Cochez les conditions générales pour signer.</Text>}
          {accepted && !signatureDrawn && <Text style={styles.muted}>Dessinez votre signature pour continuer.</Text>}
        </Card>
      )}

      <Button title="← Retour aux contrats" variant="secondary" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  h2: { fontSize: 15, fontWeight: "700", color: colors.ink, marginBottom: 10 },
  muted: { color: colors.muted, fontSize: 12, marginTop: 4 },
  price: { fontSize: 22, fontWeight: "800", color: colors.navy900, marginTop: 8 },
  terms: { color: colors.ink, fontSize: 13, marginTop: 8 },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 8,
  },
  docName: { fontSize: 13, fontWeight: "700", color: colors.ink },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.blue600, borderColor: colors.blue600 },
  checkboxLabel: { fontSize: 13, color: colors.ink, flex: 1 },
  legal: { color: colors.muted, fontSize: 11, marginTop: 12, lineHeight: 15 },
});
