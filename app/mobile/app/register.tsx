import { View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../lib/theme";
import { RegisterForm } from "../components/RegisterForm";

export default function RegisterScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: 24 }}>
      <RegisterForm onSuccess={() => router.replace("/(tabs)")} />
    </View>
  );
}
