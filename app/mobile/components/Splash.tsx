import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../lib/theme";

export function Splash({ phase }: { phase: "logo" | "loading" }) {
  const [percent, setPercent] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = setInterval(() => {
      setPercent((p) => (p >= 100 ? 100 : p + 4));
    }, 40);
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }),
    ).start();
    return () => clearInterval(timer);
  }, [phase, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={styles.screen}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>J</Text>
      </View>
      <Text style={styles.title}>JTRANSPORT</Text>
      <View style={styles.rule} />
      <Text style={styles.tagline}>VOTRE TRANSPORT, NOTRE PRIORITÉ</Text>

      {phase === "logo" ? (
        <Text style={styles.slogan}>Tout à portée de clic</Text>
      ) : (
        <View style={styles.loadingBlock}>
          <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]}>
            <Ionicons name="earth" size={40} color={colors.blue400} />
          </Animated.View>
          <Text style={styles.loadingLabel}>Chargement de votre expérience…</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
          <Text style={styles.percent}>{percent}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.navy950,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.blue600,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 42 },
  title: { color: "#fff", fontSize: 28, fontWeight: "800", letterSpacing: 1 },
  rule: { width: 40, height: 2, backgroundColor: "#e02424", marginVertical: 10 },
  tagline: { color: colors.mutedOnNavy, fontSize: 11, letterSpacing: 1.5 },
  slogan: { color: colors.mutedOnNavy, fontSize: 14, marginTop: 48 },
  loadingBlock: { alignItems: "center", marginTop: 56, gap: 14 },
  spinner: { marginBottom: 4 },
  loadingLabel: { color: colors.mutedOnNavy, fontSize: 13 },
  progressTrack: { width: 220, height: 6, borderRadius: radius.pill, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: radius.pill, backgroundColor: colors.blue500 },
  percent: { color: colors.mutedOnNavy, fontSize: 12 },
});
