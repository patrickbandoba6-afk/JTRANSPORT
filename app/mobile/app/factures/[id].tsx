import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { colors, radius } from "../../lib/theme";
import { Button, Card, Tag } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, ApiRequestError, type Invoice, type Payment } from "../../lib/api";

const METHODS: { key: "WALLET" | "VIREMENT" | "CARD"; label: string }[] = [
  { key: "WALLET", label: "Porte-monnaie JTransport" },
  { key: "VIREMENT", label: "Virement bancaire" },
  { key: "CARD", label: "Carte bancaire" },
];

export default function FactureDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ invoice: Invoice }>(`/api/invoices/${id}`);
      setInvoice(data.invoice);
    } catch {
      setInvoice(null);
    }
    try {
      const data = await apiFetch<{ payments: Payment[] }>("/api/payments/mine");
      setPayments(data.payments.filter((p) => p.invoiceId === id));
    } catch {
      setPayments([]);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (user) load();
    }, [user, load]),
  );

  async function pay(method: "WALLET" | "VIREMENT" | "CARD") {
    setBusy(true);
    setMessage(null);
    try {
      const data = await apiFetch<{ payment: Payment }>("/api/payments/intents", {
        method: "POST",
        body: JSON.stringify({ invoiceId: id, method }),
      });
      setMessage(
        data.payment.status === "SUCCEEDED"
          ? "✅ Paiement réussi."
          : data.payment.status === "PENDING"
            ? "⏳ Virement en attente de confirmation par le prestataire."
            : `❌ Paiement échoué : ${data.payment.failureReason ?? "raison inconnue"}.`,
      );
      await load();
    } catch (err) {
      setMessage(err instanceof ApiRequestError ? err.message ?? "Paiement impossible." : "Paiement impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function transmit() {
    setBusy(true);
    setMessage(null);
    try {
      const data = await apiFetch<{ transmission: { status: string } }>(`/api/invoices/${id}/transmit`, { method: "POST" });
      setMessage(
        data.transmission.status === "TRANSMITTED"
          ? "✅ Transmise à la plateforme agréée."
          : "Transmission plateforme agréée : non connectée pour le moment.",
      );
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (!invoice) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Chargement…</Text>
      </View>
    );
  }

  const isRecipient = invoice.recipientId === user?.id;
  const isIssuer = invoice.issuerId === user?.id;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Tag label={invoice.status} />
        <Text style={styles.number}>{invoice.number}</Text>
        <Text style={styles.muted}>{isIssuer ? "Vous émettez cette facture" : "Vous la recevez"}</Text>
      </Card>

      <View>
        <Text style={styles.h2}>Lignes</Text>
        {invoice.lines?.map((l) => (
          <View key={l.id} style={styles.lineRow}>
            <Text style={styles.lineDesc}>{l.description}</Text>
            <Text style={styles.muted}>{l.quantity} × {l.unitPrice.toFixed(2)} € = {l.amount.toFixed(2)} €</Text>
          </View>
        ))}
        <View style={styles.totalsBox}>
          <Text style={styles.muted}>Sous-total : {invoice.subtotal.toFixed(2)} €</Text>
          <Text style={styles.muted}>TVA ({(invoice.taxRate * 100).toFixed(0)}%) : {invoice.taxAmount.toFixed(2)} €</Text>
          <Text style={styles.total}>Total : {invoice.total.toFixed(2)} {invoice.currency}</Text>
        </View>
      </View>

      {message && <Text style={styles.muted}>{message}</Text>}

      {isRecipient && invoice.status !== "PAID" && (
        <Card>
          <Text style={styles.h2}>Payer cette facture</Text>
          {METHODS.map((m) => (
            <Button key={m.key} title={m.label} variant="secondary" onPress={() => pay(m.key)} disabled={busy} />
          ))}
        </Card>
      )}

      {isIssuer && (
        <Card>
          <Text style={styles.h2}>Actions émetteur</Text>
          <Text style={styles.muted}>Transmission e-invoicing : {invoice.eInvoicingStatus}</Text>
          <Button title="Transmettre à la plateforme agréée" variant="secondary" onPress={transmit} disabled={busy} />
        </Card>
      )}

      {payments.length > 0 && (
        <View>
          <Text style={styles.h2}>Paiements liés</Text>
          {payments.map((p) => (
            <View key={p.id} style={styles.lineRow}>
              <Text style={styles.lineDesc}>{p.method} — {p.amount.toFixed(2)} {p.currency}</Text>
              <Tag label={p.status} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  h2: { fontSize: 15, fontWeight: "700", color: colors.ink, marginBottom: 10 },
  muted: { color: colors.muted, fontSize: 12, marginTop: 4 },
  number: { fontSize: 16, fontWeight: "800", color: colors.ink, marginTop: 8 },
  lineRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, marginTop: 8, gap: 4 },
  lineDesc: { fontSize: 13, fontWeight: "600", color: colors.ink },
  totalsBox: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, gap: 2 },
  total: { fontSize: 17, fontWeight: "800", color: colors.navy900, marginTop: 4 },
});
