import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { colors, radius } from "../../lib/theme";
import { Button, Card, Tag } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, ApiRequestError, type Mission, type MissionOffer } from "../../lib/api";

export default function MissionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);
  const [offers, setOffers] = useState<MissionOffer[] | null>(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyOfferId, setBusyOfferId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ mission: Mission }>(`/api/missions/${id}`);
      setMission(data.mission);
    } catch {
      setMission(null);
    }
  }, [id]);

  const loadOffers = useCallback(async () => {
    try {
      const data = await apiFetch<{ offers: MissionOffer[] }>(`/api/missions/${id}/offers`);
      setOffers(data.offers);
    } catch {
      setOffers(null);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useFocusEffect(
    useCallback(() => {
      if (mission && user && mission.ownerId === user.id) loadOffers();
    }, [mission, user, loadOffers]),
  );

  async function submitOffer() {
    setSubmitting(true);
    setStatus("idle");
    setErrorMessage(null);
    try {
      await apiFetch(`/api/missions/${id}/offers`, {
        method: "POST",
        body: JSON.stringify({ price: Number(price), message: message || undefined }),
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof ApiRequestError && err.code === "OFFER_ALREADY_SUBMITTED"
          ? "Vous avez déjà fait une offre sur cette mission."
          : "Impossible d'envoyer l'offre.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function acceptOffer(offerId: string) {
    setBusyOfferId(offerId);
    try {
      await apiFetch(`/api/missions/${id}/offers/${offerId}/accept`, { method: "POST" });
      await load();
      await loadOffers();
    } finally {
      setBusyOfferId(null);
    }
  }

  if (!mission) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Chargement…</Text>
      </View>
    );
  }

  const isOwner = user?.id === mission.ownerId;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Tag label={mission.vehicleType} />
        <Text style={styles.route}>{mission.fromCity} → {mission.toCity}</Text>
        <Text style={styles.muted}>{new Date(mission.date).toLocaleDateString("fr-FR")}</Text>
        <Text style={styles.muted}>{mission.cargo} · {mission.weightKg} kg</Text>
        <Text style={styles.price}>{mission.budget} €</Text>
        <Tag label={mission.status} />
      </Card>

      {authLoading ? null : !user ? (
        <Card>
          <Text style={styles.muted}>Connectez-vous pour faire une offre ou gérer cette mission.</Text>
          <View style={{ height: 10 }} />
          <Button title="Se connecter" onPress={() => router.push("/login")} />
        </Card>
      ) : isOwner ? (
        <Card>
          <Text style={styles.h2}>Offres reçues</Text>
          {offers === null && <Text style={styles.muted}>Chargement…</Text>}
          {offers?.length === 0 && <Text style={styles.muted}>Aucune offre reçue pour le moment.</Text>}
          {offers?.map((offer) => (
            <View key={offer.id} style={styles.offerRow}>
              <Text style={styles.offerProvider}>{offer.provider?.name} — {offer.price} €</Text>
              {offer.message && <Text style={styles.muted}>{offer.message}</Text>}
              <Tag label={offer.status} />
              {offer.status === "PENDING" && mission.status === "PUBLISHED" && (
                <Button
                  title={busyOfferId === offer.id ? "…" : "Accepter cette offre"}
                  onPress={() => acceptOffer(offer.id)}
                  disabled={busyOfferId === offer.id}
                />
              )}
            </View>
          ))}
        </Card>
      ) : user.role === "TRANSPORTEUR" ? (
        mission.status !== "PUBLISHED" ? (
          <Card>
            <Text style={styles.muted}>Cette mission n'accepte plus d'offres.</Text>
          </Card>
        ) : status === "sent" ? (
          <Card>
            <Text>✅ Votre offre a été envoyée au donneur d'ordre.</Text>
          </Card>
        ) : (
          <Card>
            <Text style={styles.h2}>Faire une offre</Text>
            <TextInput style={styles.input} placeholder="Votre prix (€)" keyboardType="numeric" value={price} onChangeText={setPrice} />
            <TextInput style={styles.input} placeholder="Message au client" multiline value={message} onChangeText={setMessage} />
            {errorMessage && <Text style={styles.muted}>{errorMessage}</Text>}
            <Button title={submitting ? "Envoi…" : "Envoyer l'offre"} onPress={submitOffer} disabled={submitting || !price} />
          </Card>
        )
      ) : (
        <Card>
          <Text style={styles.muted}>Seuls les transporteurs peuvent faire une offre sur cette mission.</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  route: { fontSize: 20, fontWeight: "800", color: colors.ink, marginTop: 8 },
  muted: { color: colors.muted, fontSize: 13, marginTop: 2 },
  price: { fontSize: 22, fontWeight: "800", color: colors.navy900, marginTop: 8, marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: "700", color: colors.ink, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, backgroundColor: "#fff", marginBottom: 10 },
  offerRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12, gap: 6 },
  offerProvider: { fontWeight: "700", color: colors.ink },
});
