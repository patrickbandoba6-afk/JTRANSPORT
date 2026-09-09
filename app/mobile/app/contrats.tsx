import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../lib/theme";
import { Button, Card, Tag } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { apiFetch, ApiRequestError, type Contract } from "../lib/api";

export default function Contrats() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [invoicedIds, setInvoicedIds] = useState<Set<string>>(new Set());
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ contracts: Contract[] }>("/api/contracts/mine");
      setContracts(data.contracts);
    } catch {
      setContracts([]);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function sign(id: string) {
    setBusyId(id);
    try {
      await apiFetch(`/api/contracts/${id}/sign`, { method: "POST" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function generateInvoice(contractId: string) {
    setBusyId(contractId);
    setInvoiceError(null);
    try {
      await apiFetch("/api/invoices", { method: "POST", body: JSON.stringify({ contractId }) });
      setInvoicedIds((s) => new Set(s).add(contractId));
      router.push("/factures" as never);
    } catch (err) {
      setInvoiceError(
        err instanceof ApiRequestError && err.code === "INVOICE_ALREADY_EXISTS"
          ? "Une facture existe déjà pour ce contrat."
          : "Impossible de générer la facture.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>📄 Contrats & signature</Text>
        <Text style={styles.muted}>Connectez-vous pour voir vos contrats.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={[styles.title, { padding: 16, paddingTop: 60 }]}>📄 Contrats & signature</Text>
      {invoiceError && <Text style={[styles.muted, { paddingHorizontal: 16 }]}>{invoiceError}</Text>}
      <FlatList
        data={contracts ?? []}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={contracts?.length === 0 ? <Text style={styles.muted}>Aucun contrat pour le moment.</Text> : null}
        renderItem={({ item }) => {
          const isOwner = item.ownerId === user.id;
          const alreadySigned = isOwner ? item.ownerSignedAt : item.counterpartySignedAt;
          const canInvoice = !isOwner && item.status === "FULLY_SIGNED" && !invoicedIds.has(item.id);
          return (
            <Card>
              <Tag label={item.type} />
              <Tag label={item.status} />
              <Text style={styles.price}>{item.price} €</Text>
              <Text style={styles.muted}>Rôle : {isOwner ? "Donneur d'ordre" : "Prestataire"}</Text>
              <Button
                title="Ouvrir le contrat →"
                onPress={() => router.push(`/contrats/${item.id}` as never)}
              />
              {item.status !== "FULLY_SIGNED" && item.status !== "CANCELLED" && !alreadySigned && (
                <Button
                  title={busyId === item.id ? "…" : "Signer sans pièce jointe"}
                  variant="secondary"
                  onPress={() => sign(item.id)}
                  disabled={busyId === item.id}
                />
              )}
              {alreadySigned && <Text style={styles.muted}>✅ Signé de votre part</Text>}
              {canInvoice && (
                <Button
                  title={busyId === item.id ? "…" : "🧾 Générer la facture"}
                  variant="secondary"
                  onPress={() => generateInvoice(item.id)}
                  disabled={busyId === item.id}
                />
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
  price: { fontSize: 18, fontWeight: "800", color: colors.navy900, marginTop: 8 },
});
