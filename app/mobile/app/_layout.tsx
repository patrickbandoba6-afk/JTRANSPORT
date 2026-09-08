import { Stack } from "expo-router";
import { AuthProvider } from "../lib/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="missions/[id]" options={{ headerShown: true, headerTitle: "Mission" }} />
        <Stack.Screen name="login" options={{ headerShown: true, headerTitle: "Connexion" }} />
        <Stack.Screen name="register" options={{ headerShown: true, headerTitle: "Créer un compte" }} />
      </Stack>
    </AuthProvider>
  );
}
