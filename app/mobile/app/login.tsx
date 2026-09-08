import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors, radius } from "../lib/theme";
import { Button } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { ApiRequestError } from "../lib/api";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.back();
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
    <View style={styles.screen}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      {error && <Text style={styles.muted}>{error}</Text>}
      <Button title={submitting ? "Connexion…" : "Se connecter"} onPress={onSubmit} disabled={submitting} />
      <Link href="/register" style={{ marginTop: 14 }}>
        <Text style={styles.link}>Pas de compte ? Créer un compte</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 20, gap: 12, paddingTop: 24 },
  title: { fontSize: 24, fontWeight: "800", color: colors.ink, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 13, backgroundColor: "#fff" },
  muted: { color: colors.muted, fontSize: 13 },
  link: { color: colors.blue600, fontWeight: "700" },
});
