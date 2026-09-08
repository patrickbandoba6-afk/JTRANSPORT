import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Organization } from "../lib/api";

const ACTIVITIES = [
  "MARCHANDISES",
  "VOYAGEURS",
  "COMMISSIONNAIRE",
  "LOGISTIQUE",
  "MARITIME",
  "AERIEN",
  "FERROVIAIRE",
  "AUTRE",
];

export default function MonEntreprise() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[] | null>(null);
  const [name, setName] = useState("");
  const [activity, setActivity] = useState(ACTIVITIES[0]);
  const [country, setCountry] = useState("FR");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ organizations: Organization[] }>("/api/organizations/mine");
      setOrganizations(data.organizations);
    } catch {
      setOrganizations([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function createOrganization() {
    setSubmitting(true);
    try {
      await apiFetch("/api/organizations", {
        method: "POST",
        body: JSON.stringify({ name, activity, country, hasProfessionalCapacity: false }),
      });
      setName("");
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>🏢 Créer mon entreprise</Text>
        <Text style={styles.muted}>Connectez-vous pour créer votre entreprise.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingTop: 60, gap: 16 }}>
      <Text style={styles.title}>🏢 Créer mon entreprise de transport</Text>
      <Text style={styles.muted}>
        Déclarer une entreprise ne délivre aucune capacité professionnelle : le statut reste « non vérifié » jusqu'à
        un contrôle administratif.
      </Text>

      <Card>
        <TextInput style={styles.input} placeholder="Nom de l'entreprise" value={name} onChangeText={setName} />
        <View style={styles.chipRow}>
          {ACTIVITIES.map((a) => (
            <Text
              key={a}
              onPress={() => setActivity(a)}
              style={[styles.chip, activity === a && styles.chipSelected]}
            >
              {a}
            </Text>
          ))}
        </View>
        <TextInput style={styles.input} placeholder="Pays (ex: FR)" value={country} onChangeText={setCountry} />
        <Button title={submitting ? "Création…" : "Créer l'entreprise"} onPress={createOrganization} disabled={submitting || !name} />
      </Card>

      <Text style={styles.h2}>Mes entreprises</Text>
      {organizations === null && <Text style={styles.muted}>Chargement…</Text>}
      {organizations?.length === 0 && <Text style={styles.muted}>Aucune entreprise créée pour le moment.</Text>}
      {organizations?.map((org) => (
        <Card key={org.id}>
          <Tag label={org.verificationStatus} />
          <Text style={styles.orgName}>{org.name}</Text>
          <Text style={styles.muted}>{org.activity} · {org.country}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  muted: { color: colors.muted, fontSize: 13 },
  h2: { fontSize: 16, fontWeight: "700", color: colors.ink },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, backgroundColor: "#fff", marginBottom: 10 },
  orgName: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 6 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  chip: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
  },
  chipSelected: { color: colors.blue600, borderColor: colors.blue500, backgroundColor: "#eaf1ff" },
});
