import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../lib/theme";
import { Button, Card } from "../../components/ui";
import { useAuth } from "../../lib/auth-context";

export default function Profil() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return <View style={styles.screen} />;

  if (!user) {
    return (
      <View style={[styles.screen, { paddingTop: 100, paddingHorizontal: 24, gap: 12 }]}>
        <Text style={styles.title}>Mon compte</Text>
        <Text style={styles.muted}>Connectez-vous pour accéder à votre profil, vos missions et vos contrats.</Text>
        <Button title="Se connecter" onPress={() => router.push("/login")} />
        <Button title="Créer un compte" variant="secondary" onPress={() => router.push("/register")} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: 60, paddingHorizontal: 16, gap: 12 }]}>
      <Text style={styles.title}>Mon compte</Text>
      <Card>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.muted}>{user.email}</Text>
        <Text style={styles.muted}>Profil : {user.role}</Text>
      </Card>
      <Button title="📋 Mes missions" variant="secondary" onPress={() => router.push("/(tabs)/mes-missions")} />
      <Button title="📮 Mes expéditions" variant="secondary" onPress={() => router.push("/expeditions")} />
      <Button title="📄 Mes contrats" variant="secondary" onPress={() => router.push("/contrats")} />
      <Button title="🧾 Mes factures" variant="secondary" onPress={() => router.push("/factures")} />
      <Button title="🏢 Mon entreprise" variant="secondary" onPress={() => router.push("/mon-entreprise")} />
      <Button title="Déconnexion" variant="secondary" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  muted: { color: colors.muted, fontSize: 13 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.blue600,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 22 },
  name: { fontSize: 17, fontWeight: "700", color: colors.ink },
});
