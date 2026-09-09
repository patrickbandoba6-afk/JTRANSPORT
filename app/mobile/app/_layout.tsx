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
          <Stack.Screen name="contrats/[id]" options={{ headerShown: true, headerTitle: "Contrat de transport" }} />
          <Stack.Screen name="expeditions" options={{ headerShown: true, headerTitle: "Expéditions" }} />
          <Stack.Screen name="expeditions/[id]" options={{ headerShown: true, headerTitle: "Expédition" }} />
          <Stack.Screen name="factures" options={{ headerShown: true, headerTitle: "Factures" }} />
          <Stack.Screen name="conversations/[id]" options={{ headerShown: true, headerTitle: "Conversation" }} />
          <Stack.Screen name="driver/index" options={{ headerShown: true, headerTitle: "JTransport Driver" }} />
        </Stack>
      </Bootstrap>
    </AuthProvider>
  );
}
