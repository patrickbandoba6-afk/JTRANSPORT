import { useCallback, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { colors, radius } from "../../lib/theme";
import { Button } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";
import { apiFetch, type ChatMessage } from "../../lib/api";

export default function Conversation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ messages: ChatMessage[] }>(`/api/conversations/${id}/messages`);
      setMessages(data.messages);
    } catch {
      setMessages([]);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (user) load();
    }, [user, load]),
  );

  async function send() {
    if (!body.trim()) return;
    setSending(true);
    try {
      await apiFetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: body.trim() }),
      });
      setBody("");
      await load();
      listRef.current?.scrollToEnd({ animated: true });
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={<Text style={styles.muted}>Aucun message pour le moment.</Text>}
        renderItem={({ item }) => {
          const mine = item.senderId === user?.id;
          return (
            <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
              {!mine && <Text style={styles.sender}>{item.sender?.name}</Text>}
              <Text style={[styles.body, mine && { color: "#fff" }]}>{item.body}</Text>
              <Text style={[styles.time, mine && { color: "rgba(255,255,255,0.7)" }]}>
                {new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Votre message…"
          value={body}
          onChangeText={setBody}
          multiline
        />
        <Button title={sending ? "…" : "Envoyer"} onPress={send} disabled={sending || !body.trim()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  muted: { color: colors.muted, fontSize: 13 },
  bubble: { maxWidth: "82%", borderRadius: radius.md, padding: 12 },
  bubbleMine: { alignSelf: "flex-end", backgroundColor: colors.blue600 },
  bubbleTheirs: { alignSelf: "flex-start", backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border },
  sender: { fontSize: 11, fontWeight: "700", color: colors.blue600, marginBottom: 4 },
  body: { fontSize: 14, color: colors.ink },
  time: { fontSize: 10, color: colors.muted, marginTop: 6, alignSelf: "flex-end" },
  composer: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: "#fff",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    maxHeight: 110,
    backgroundColor: "#fff",
  },
});
