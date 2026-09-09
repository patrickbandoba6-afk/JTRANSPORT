import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../lib/theme";
import { Button, Card, Tag } from "../../components/ui";
import { SignaturePad, type Stroke } from "../../components/SignaturePad";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type DeliveryRound, type RoundStop } from "../../lib/api";

const STOP_LABELS: Record<RoundStop["status"], string> = {
  PENDING: "À faire",
  IN_PROGRESS: "En cours",
  DELIVERED: "Livré",
  FAILED: "Échec",
};

export default function DriverHome() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rounds, setRounds] = useState<DeliveryRound[] | null>(null);
  const [activeStop, setActiveStop] = useState<{ roundId: string; stop: RoundStop } | null>(null);
  const [scanCode, setScanCode] = useState("");
  const [podStrokes, setPodStrokes] = useState<Stroke[]>([]);
  const [failReason, setFailReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ rounds: DeliveryRound[] }>("/api/rounds/mine");
      setRounds(data.rounds);
    } catch {
      setRounds([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user) load();
    }, [user, load]),
  );

  async function act(path: string, payload: object) {
    setBusy(true);
    setError(null);
    try {
      await apiFetch(path, { method: "POST", body: JSON.stringify(payload) });
      await load();
      setActiveStop(null);
      setScanCode("");
      setPodStrokes([]);
      setFailReason("");
    } catch {
      setError("Action refusée (code colis incorrect, ou arrêt déjà clôturé).");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>JTransport Driver</Text>
        <Text style={styles.muted}>Connectez-vous avec votre compte chauffeur.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  if (user.role !== "CHAUFFEUR") {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>JTransport Driver</Text>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Cet espace est réservé aux comptes chauffeur/livreur. Votre profil actuel est « {user.role} ». Un
            dispatcher doit vous affecter une tournée sur un compte chauffeur.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingTop: 56, gap: 14 }}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.driverName}>{user.name}</Text>
          <Text style={styles.muted}>JTransport Driver</Text>
        </View>
      </View>

      {rounds?.length === 0 && <Text style={styles.muted}>Aucune tournée affectée pour le moment.</Text>}

      {rounds?.map((round) => (
        <Card key={round.id}>
          <View style={styles.roundHeader}>
            <Text style={styles.roundRef}>Tournée {round.reference}</Text>
            <Tag label={round.status} />
          </View>
          <Text style={styles.muted}>{new Date(round.date).toLocaleDateString("fr-FR")}</Text>

          <View style={{ marginTop: 12, gap: 10 }}>
            {round.stops?.map((stop) => (
              <View key={stop.id} style={styles.stopRow}>
                <Ionicons
                  name={
                    stop.status === "DELIVERED"
                      ? "checkmark-circle"
                      : stop.status === "FAILED"
                        ? "close-circle"
                        : "ellipse-outline"
                  }
                  size={22}
                  color={
                    stop.status === "DELIVERED"
                      ? "#16a34a"
                      : stop.status === "FAILED"
                        ? "#dc2626"
                        : colors.blue500
                  }
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.stopLabel}>
                    {stop.position}. {stop.label}
                  </Text>
                  <Text style={styles.muted}>{stop.address}</Text>
                  {stop.failureReason && <Text style={styles.muted}>Motif : {stop.failureReason}</Text>}
                </View>
                <Tag label={STOP_LABELS[stop.status]} />
              </View>
            ))}
          </View>

          {round.stops?.some((s) => s.status !== "DELIVERED" && s.status !== "FAILED") && (
            <>
              <View style={{ height: 12 }} />
              <Button
                title="Scanner un colis"
                onPress={() => {
                  const next = round.stops?.find((s) => s.status !== "DELIVERED" && s.status !== "FAILED");
                  if (next) setActiveStop({ roundId: round.id, stop: next });
                }}
              />
            </>
          )}
        </Card>
      ))}

      {activeStop && (
        <Card>
          <Text style={styles.h2}>
            Arrêt {activeStop.stop.position} — {activeStop.stop.label}
          </Text>

          {activeStop.stop.status === "PENDING" ? (
            <>
              <Text style={styles.muted}>Scannez ou saisissez le code du colis pour prendre en charge cet arrêt.</Text>
              <TextInput
                style={styles.input}
                placeholder="Code colis (ex: JT-C-001)"
                autoCapitalize="characters"
                value={scanCode}
                onChangeText={setScanCode}
              />
              <Button
                title={busy ? "…" : "Valider le scan"}
                onPress={() => act(`/api/rounds/${activeStop.roundId}/stops/${activeStop.stop.id}/scan`, { parcelCode: scanCode })}
                disabled={busy || !scanCode.trim()}
              />
            </>
          ) : (
            <>
              <SignaturePad
                strokes={podStrokes}
                onStrokesChange={setPodStrokes}
                label="Signature du destinataire"
                height={140}
              />
              <View style={{ height: 12 }} />
              <Button
                title={busy ? "…" : "Confirmer la livraison"}
                onPress={() =>
                  act(`/api/rounds/${activeStop.roundId}/stops/${activeStop.stop.id}/deliver`, {
                    podSignature: JSON.stringify(podStrokes),
                  })
                }
                disabled={busy || !podStrokes.some((s) => s.length > 1)}
              />
              <View style={{ height: 14 }} />
              <TextInput
                style={styles.input}
                placeholder="Motif d'échec (destinataire absent…)"
                value={failReason}
                onChangeText={setFailReason}
              />
              <Button
                title="Signaler un échec"
                variant="secondary"
                onPress={() =>
                  act(`/api/rounds/${activeStop.roundId}/stops/${activeStop.stop.id}/fail`, { reason: failReason })
                }
                disabled={busy || !failReason.trim()}
              />
            </>
          )}

          {error && <Text style={styles.muted}>{error}</Text>}
          <View style={{ height: 10 }} />
          <Button title="Annuler" variant="secondary" onPress={() => setActiveStop(null)} />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  h2: { fontSize: 15, fontWeight: "700", color: colors.ink, marginBottom: 10 },
  muted: { color: colors.muted, fontSize: 12, marginTop: 4 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.blue600,
    alignItems: "center",
    justifyContent: "center",
  },
  driverName: { fontSize: 16, fontWeight: "800", color: colors.ink },
  roundHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  roundRef: { fontSize: 15, fontWeight: "800", color: colors.ink },
  stopRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stopLabel: { fontSize: 13, fontWeight: "700", color: colors.ink },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  notice: { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a", borderRadius: radius.md, padding: 14, marginTop: 12 },
  noticeText: { color: "#92400e", fontSize: 13, lineHeight: 19 },
});
