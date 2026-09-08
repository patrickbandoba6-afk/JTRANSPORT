import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../lib/theme";
import { Button, IconBadge } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { ApiRequestError, type Role } from "../lib/api";

const ROLE_OPTIONS: { role: Role; icon: string; title: string; description: string }[] = [
  { role: "PARTICULIER", icon: "👤", title: "Particulier", description: "Envois personnels et achats en ligne" },
  { role: "PROFESSIONNEL", icon: "🏢", title: "Professionnel / Entreprise", description: "Gérer vos expéditions et activités" },
  { role: "TRANSPORTEUR", icon: "🚛", title: "Transporteur / Prestataire", description: "Proposer vos services de transport" },
  { role: "DISPATCHER", icon: "📦", title: "Dispatcher", description: "Gérer vos tournées et vos livreurs" },
];

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onConfirmRole() {
    if (!role) return;
    setSubmitting(true);
    setError(null);
    try {
      await register({ name, email, password, role });
      router.back();
    } catch (err) {
      setError(
        err instanceof ApiRequestError && err.code === "EMAIL_ALREADY_USED"
          ? "Un compte existe déjà avec cet e-mail."
          : "Inscription impossible pour le moment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 1) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.muted}>Étape 1 sur 2 — vos informations.</Text>
        <TextInput style={styles.input} placeholder="Nom complet" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Mot de passe (8 caractères min.)" secureTextEntry value={password} onChangeText={setPassword} />
        <Button title="Suivant →" onPress={() => setStep(2)} disabled={!name || !email || password.length < 8} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Quel type de compte ?</Text>
      <Text style={styles.muted}>Étape 2 sur 2 — choisissez votre profil.</Text>
      <View style={{ gap: 10 }}>
        {ROLE_OPTIONS.map((opt) => (
          <Pressable
            key={opt.role}
            onPress={() => setRole(opt.role)}
            style={[styles.roleOption, role === opt.role && styles.roleOptionSelected]}
          >
            <IconBadge icon={opt.icon} size={38} />
            <View style={{ flex: 1 }}>
              <Text style={styles.roleTitle}>{opt.title}</Text>
              <Text style={styles.muted}>{opt.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      {error && <Text style={styles.muted}>{error}</Text>}
      <Button title={submitting ? "Création…" : "Continuer →"} onPress={onConfirmRole} disabled={!role || submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 20, gap: 12, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  muted: { color: colors.muted, fontSize: 13 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 13, backgroundColor: "#fff" },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: "#fff",
  },
  roleOptionSelected: { borderColor: colors.blue500 },
  roleTitle: { fontWeight: "700", fontSize: 14, color: colors.ink },
});
