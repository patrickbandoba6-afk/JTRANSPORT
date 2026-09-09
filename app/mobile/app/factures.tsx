import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, type Invoice } from "../lib/api";

export default function Factures() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ invoices: Invoice[] }>("/api/invoices/mine");
      setInvoices(data.invoices);
    } catch {
      setInvoices([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function markPaid(id: string) {
    setBusyId(id);
    try {
      await apiFetch(`/api/invoices/${id}/mark-paid`, { method: "POST" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>🧾 Mes factures</Text>
        <Text style={styles.muted}>Connectez-vous pour voir vos factures.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={[styles.title, { padding: 16, paddingTop: 60 }]}>🧾 Mes factures</Text>
      <FlatList
        data={invoices ?? []}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={invoices?.length === 0 ? <Text style={styles.muted}>Aucune facture pour le moment.</Text> : null}
        renderItem={({ item }) => {
          const isIssuer = item.issuerId === user.id;
          return (
            <Card>
              <Tag label={item.status} />
              <Text style={styles.number}>{item.number}</Text>
              <Text style={styles.total}>{item.total.toFixed(2)} {item.currency}</Text>
              <Text style={styles.muted}>{isIssuer ? "Vous émettez" : "Vous recevez"}</Text>
              {item.eInvoicingStatus === "FAILED" && (
                <Text style={styles.muted}>Transmission plateforme agréée : non connectée</Text>
              )}
              {isIssuer && item.status !== "PAID" && (
                <Button title={busyId === item.id ? "…" : "Marquer payée"} onPress={() => markPaid(item.id)} disabled={busyId === item.id} />
              )}
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  muted: { color: colors.muted, fontSize: 13, marginTop: 4 },
  number: { fontSize: 15, fontWeight: "700", color: colors.ink, marginTop: 8 },
  total: { fontSize: 20, fontWeight: "800", color: colors.navy900, marginTop: 4 },
});
