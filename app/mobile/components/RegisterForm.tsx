import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../lib/theme";
import { Button, IconBadge } from "./ui";
import { useAuth } from "../lib/auth-context";
import { ApiRequestError, type Role } from "../lib/api";

const ROLE_OPTIONS: { role: Role; icon: string; title: string; description: string }[] = [
  { role: "PARTICULIER", icon: "👤", title: "Particulier", description: "Pour vos envois personnels" },
  { role: "PROFESSIONNEL", icon: "🏢", title: "Professionnel / Entreprise", description: "Gérer vos expéditions et activités" },
  { role: "TRANSPORTEUR", icon: "🚛", title: "Transporteur / Prestataire", description: "Proposer vos services de transport" },
  { role: "DISPATCHER", icon: "📦", title: "Dispatcher", description: "Gérer vos tournées et vos livreurs" },
  { role: "CHAUFFEUR", icon: "🧑‍✈️", title: "Chauffeur / Livreur", description: "Recevoir vos tournées et livrer" },
];

const STEPS = ["Informations", "Profil", "Finalisation"];

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onConfirmRole() {
    if (!role) return;
    setSubmitting(true);
    setError(null);
    try {
      await register({ name, email, password, phone: phone || undefined, role });
      setStep(3);
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

  return (
    <ScrollView contentContainerStyle={styles.form}>
      <View style={styles.stepper}>
        {STEPS.map((label, i) => {
          const index = (i + 1) as 1 | 2 | 3;
          const active = step >= index;
          return (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.stepDot, active && styles.stepDotActive]}>
                <Text style={[styles.stepDotText, active && { color: "#fff" }]}>{index}</Text>
              </View>
              <Text style={[styles.stepLabel, active && { color: colors.ink, fontWeight: "700" }]}>{label}</Text>
            </View>
          );
        })}
      </View>

      {step === 1 && (
        <>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.fieldLabel}>Nom complet</Text>
          <TextInput style={styles.input} placeholder="Ex : Dupont Jean" value={name} onChangeText={setName} />
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : jean@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.fieldLabel}>Téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="+33 6 12 34 56 78"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Text style={styles.fieldLabel}>Mot de passe</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Minimum 8 caractères"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.eye}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.muted} />
            </Pressable>
          </View>

          <Pressable style={styles.checkboxRow} onPress={() => setAcceptedTerms((a) => !a)}>
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxOn]}>
              {acceptedTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>
              J'accepte les Conditions générales d'utilisation et la Politique de confidentialité
            </Text>
          </Pressable>

          <Button
            title="Suivant →"
            onPress={() => setStep(2)}
            disabled={!name || !email || password.length < 8 || !acceptedTerms}
          />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Quel type de compte ?</Text>
          <Text style={styles.muted}>Choisissez le profil qui vous correspond pour une expérience personnalisée.</Text>
          <View style={{ gap: 10, marginTop: 12 }}>
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
          <Text style={styles.muted}>Vous pourrez changer de profil plus tard dans les paramètres.</Text>
          {error && <Text style={styles.muted}>{error}</Text>}
          <Button title={submitting ? "Création…" : "Continuer →"} onPress={onConfirmRole} disabled={!role || submitting} />
          <Button title="← Retour" variant="secondary" onPress={() => setStep(1)} />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Compte créé 🎉</Text>
          <Text style={styles.muted}>
            Bienvenue sur JTransport. Votre compte {role} est actif, vous pouvez commencer tout de suite.
          </Text>
          <View style={{ height: 10 }} />
          <Button title="Continuer →" onPress={onSuccess} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: { gap: 10, paddingBottom: 30 },
  stepper: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  stepItem: { alignItems: "center", flex: 1, gap: 6 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: { backgroundColor: colors.blue600 },
  stepDotText: { fontSize: 12, fontWeight: "800", color: colors.muted },
  stepLabel: { fontSize: 10, color: colors.muted },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  muted: { color: colors.muted, fontSize: 12 },
  fieldLabel: { fontSize: 12, fontWeight: "700", color: colors.ink, marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 13,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  passwordRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  eye: { padding: 8 },
  checkboxRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginVertical: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.blue600, borderColor: colors.blue600 },
  checkboxLabel: { fontSize: 12, color: colors.ink, flex: 1, lineHeight: 17 },
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
