import { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../lib/theme";

// The two launch screens are the client's own artwork
// (app/mobile/assets/splash-1.jpg and splash-2-*.jpg, cropped from the
// approved storyboard). The loading screen is split in two around its
// progress bar so the bar and the percentage are rendered natively and
// actually animate, instead of showing the frozen "68%" from the image.
const LAUNCH = require("../assets/splash-1.jpg");
const LOADING_TOP = require("../assets/splash-2-top.jpg");
const LOADING_BOTTOM = require("../assets/splash-2-bottom.jpg");

// Flex weights match the source crop heights so the composition keeps the
// proportions of the original artwork.
const TOP_WEIGHT = 1245;
const BOTTOM_WEIGHT = 530;

export function Splash({ phase }: { phase: "logo" | "loading" }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (phase !== "loading") return;
    setPercent(0);
    const timer = setInterval(() => {
      setPercent((p) => (p >= 100 ? 100 : p + 2));
    }, 34);
    return () => clearInterval(timer);
  }, [phase]);

  if (phase === "logo") {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <Image source={LAUNCH} style={styles.full} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <Image source={LOADING_TOP} style={{ flex: TOP_WEIGHT }} resizeMode="cover" />

      <View style={styles.progressBand}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      <Image source={LOADING_BOTTOM} style={{ flex: BOTTOM_WEIGHT }} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0c1c38" },
  full: { width: "100%", height: "100%" },
  progressBand: {
    backgroundColor: "#0c1c38",
    paddingHorizontal: "9%",
    paddingTop: 4,
    paddingBottom: 10,
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.blue500,
    shadowColor: colors.blue400,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  percent: { color: "#dbe6ff", fontSize: 15, fontWeight: "700", marginTop: 10 },
});
