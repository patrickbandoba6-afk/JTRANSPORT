import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../lib/theme";
import { Button } from "./ui";
import { useAuth } from "../lib/auth-context";
import { ApiRequestError } from "../lib/api";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiRequestError && err.code === "INVALID_CREDENTIALS"
          ? "E-mail ou mot de passe incorrect."
          : "Connexion impossible pour le moment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      {error && <Text style={styles.muted}>{error}</Text>}
      <Button title={submitting ? "Connexion…" : "Se connecter →"} onPress={onSubmit} disabled={submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 13, backgroundColor: "#fff" },
  muted: { color: colors.muted, fontSize: 13 },
});
