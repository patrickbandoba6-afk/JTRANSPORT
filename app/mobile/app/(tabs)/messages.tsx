import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { colors } from "../../lib/theme";
import { Button, Card } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type ConversationSummary } from "../../lib/api";

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ conversations: ConversationSummary[] }>("/api/conversations");
      setConversations(data.conversations);
    } catch {
      setConversations([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user) load();
    }, [user, load]),
  );

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 90, paddingHorizontal: 24 }]}>
        <Text style={styles.title}>💬 Messages</Text>
        <Text style={styles.muted}>Connectez-vous pour accéder à votre messagerie.</Text>
        <View style={{ height: 12 }} />
        <Button title="Se connecter" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={[styles.title, { padding: 16, paddingTop: 60 }]}>💬 Messages</Text>
      <FlatList
        data={conversations ?? []}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          conversations?.length === 0 ? (
            <Text style={styles.muted}>
              Aucune conversation. Contactez un prestataire depuis une mission ou une capacité pour démarrer un
              échange.
            </Text>
          ) : null
        }
        renderItem={({ item }) => {
          const other = item.participants.find((p) => p.userId !== user.id)?.user;
          const last = item.messages[0];
          return (
            <Card onTouchEnd={() => router.push(`/conversations/${item.id}` as never)}>
              <Text style={styles.name}>{other?.name ?? "Conversation"}</Text>
              {item.subject && <Text style={styles.subject}>{item.subject}</Text>}
              {last && (
                <Text style={styles.preview} numberOfLines={1}>
                  {last.senderId === user.id ? "Vous : " : ""}
                  {last.body}
                </Text>
              )}
              <Text style={styles.muted}>{new Date(item.updatedAt).toLocaleString("fr-FR")}</Text>
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
  muted: { color: colors.muted, fontSize: 12, marginTop: 6 },
  name: { fontSize: 15, fontWeight: "700", color: colors.ink },
  subject: { fontSize: 12, color: colors.blue600, fontWeight: "600", marginTop: 2 },
  preview: { fontSize: 13, color: colors.ink, marginTop: 6 },
});
