import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";
import { Button } from "./ui";

// No Google/Apple sign-in buttons here — those providers aren't wired up
// on the backend, and the cahier des charges explicitly bans decorative
// buttons with no real behavior behind them.
export function Welcome({
  onLogin,
  onRegister,
  onGuest,
}: {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
}) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>J</Text>
      </View>
      <Text style={styles.title}>JTRANSPORT</Text>
      <Text style={styles.tagline}>VOTRE TRANSPORT, NOTRE PRIORITÉ</Text>

      <View style={{ height: 60 }} />

      <Text style={styles.welcome}>Bienvenue !</Text>
      <Text style={styles.sub}>Connectez-vous ou créez votre compte pour accéder à toutes les fonctionnalités.</Text>

      <View style={{ height: 24 }} />
      <Button title="Se connecter →" onPress={onLogin} />
      <View style={{ height: 10 }} />
      <Button title="Créer un compte" variant="secondary" onPress={onRegister} />

      <View style={{ height: 20 }} />
      <Text style={styles.guest} onPress={onGuest}>
        Continuer sans compte
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { alignItems: "center", padding: 28, paddingTop: 90 },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.blue600,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 30 },
  title: { color: colors.navy900, fontSize: 20, fontWeight: "800" },
  tagline: { color: colors.muted, fontSize: 10, letterSpacing: 1, marginTop: 2 },
  welcome: { fontSize: 22, fontWeight: "800", color: colors.ink, marginBottom: 8 },
  sub: { color: colors.muted, fontSize: 13, textAlign: "center" },
  guest: { color: colors.blue600, fontWeight: "700", fontSize: 14 },
});
