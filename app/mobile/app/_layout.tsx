import { Stack } from "expo-router";
import { AuthProvider } from "../lib/auth-context";
import { Bootstrap } from "../components/Bootstrap";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Bootstrap>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="missions/[id]" options={{ headerShown: true, headerTitle: "Mission" }} />
          <Stack.Screen name="login" options={{ headerShown: true, headerTitle: "Connexion" }} />
          <Stack.Screen name="register" options={{ headerShown: true, headerTitle: "Créer un compte" }} />
          <Stack.Screen name="mon-entreprise" options={{ headerShown: true, headerTitle: "Mon entreprise" }} />
          <Stack.Screen name="capacites" options={{ headerShown: true, headerTitle: "Capacités" }} />
          <Stack.Screen name="contrats" options={{ headerShown: true, headerTitle: "Contrats" }} />
          <Stack.Screen name="mes-missions" options={{ headerShown: true, headerTitle: "Mes missions" }} />
        </Stack>
      </Bootstrap>
    </AuthProvider>
  );
}
