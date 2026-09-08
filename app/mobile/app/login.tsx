import { View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../lib/theme";
import { LoginForm } from "../components/LoginForm";

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: 24 }}>
      <LoginForm onSuccess={() => router.replace("/(tabs)")} />
    </View>
  );
}
