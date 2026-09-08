"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../lib/auth-context";
import { Splash } from "./Splash";
import { Onboarding } from "./Onboarding";

const ONBOARDED_KEY = "jt_onboarded";

// Implements the launch flow from the cahier des charges §21:
// SPLASH → INITIALIZING → SESSION_CHECK → {ONBOARDING | HOME}.
// A returning user with a valid session (or who has already seen
// onboarding) skips straight past both screens once the session check
// resolves — no forced re-login after initialization.
export function AppBootstrap({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth();
  const [phase, setPhase] = useState<"splash" | "onboarding" | "app">("splash");
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinDelayDone(true), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "splash" || loading || !minDelayDone) return;
    const alreadyOnboarded = typeof window !== "undefined" && localStorage.getItem(ONBOARDED_KEY);
    setPhase(!alreadyOnboarded && !user ? "onboarding" : "app");
  }, [phase, loading, minDelayDone, user]);

  if (phase === "splash") return <Splash />;
  if (phase === "onboarding") {
    return (
      <Onboarding
        onDone={() => {
          localStorage.setItem(ONBOARDED_KEY, "1");
          setPhase("app");
        }}
      />
    );
  }
  return <>{children}</>;
}
