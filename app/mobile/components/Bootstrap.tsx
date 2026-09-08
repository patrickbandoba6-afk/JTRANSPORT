import { useEffect, useState, type ReactNode } from "react";
import { ScrollView, Text } from "react-native";
import { useAuth } from "../lib/auth-context";
import { hasOnboarded, setOnboarded } from "../lib/onboarding";
import { colors } from "../lib/theme";
import { Splash } from "./Splash";
import { Onboarding } from "./Onboarding";
import { Welcome } from "./Welcome";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type Stage = "logo" | "loading" | "onboarding" | "welcome-home" | "welcome-login" | "welcome-register" | "app";

// Mirrors app/web/components/AppBootstrap.tsx — cahier des charges §21:
// SPLASH → INITIALIZING → SESSION_CHECK → {ONBOARDING | LOGIN | HOME}.
// Login/Register are rendered inline here (not as expo-router routes)
// because this component runs BEFORE the real navigator mounts; once the
// user is authenticated or chooses to continue as a guest, it steps aside
// and renders `children` — the actual app Stack.
export function Bootstrap({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [stage, setStage] = useState<Stage>("logo");
  const [guest, setGuest] = useState(false);
  const [onboarded, setOnboardedState] = useState<boolean | null>(null);

  useEffect(() => {
    hasOnboarded().then(setOnboardedState);
  }, []);

  useEffect(() => {
    if (stage !== "logo") return;
    const t = setTimeout(() => setStage("loading"), 900);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "loading") return;
    if (loading || onboarded === null) return;
    const t = setTimeout(() => {
      setStage(onboarded ? "welcome-home" : "onboarding");
    }, 1300);
    return () => clearTimeout(t);
  }, [stage, loading, onboarded]);

  if (user || guest) {
    return <>{children}</>;
  }

  if (stage === "logo" || stage === "loading") {
    return <Splash phase={stage} />;
  }

  if (stage === "onboarding") {
    return (
      <Onboarding
        onDone={async () => {
          await setOnboarded();
          setStage("welcome-home");
        }}
      />
    );
  }

  if (stage === "welcome-login") {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ color: colors.blue600, fontWeight: "700", marginBottom: 16 }} onPress={() => setStage("welcome-home")}>
          ← Retour
        </Text>
        <LoginForm onSuccess={() => setStage("app")} />
      </ScrollView>
    );
  }

  if (stage === "welcome-register") {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ color: colors.blue600, fontWeight: "700", marginBottom: 16 }} onPress={() => setStage("welcome-home")}>
          ← Retour
        </Text>
        <RegisterForm onSuccess={() => setStage("app")} />
      </ScrollView>
    );
  }

  return (
    <Welcome
      onLogin={() => setStage("welcome-login")}
      onRegister={() => setStage("welcome-register")}
      onGuest={() => setGuest(true)}
    />
  );
}
