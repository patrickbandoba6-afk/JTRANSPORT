import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../lib/theme";
import { Button, IconBadge } from "./ui";
import { useState } from "react";

const SLIDES = [
  {
    title: "Une seule application pour tous vos transports",
    body: "Import / Export · Fret maritime · Fret aérien · Transport routier · Douane · Logistique",
    features: null,
  },
  {
    title: "Des solutions complètes pour les particuliers et les professionnels",
    body: "Import / Export · Fret maritime · Fret aérien · Transport routier · Douane · Logistique",
    features: [
      { icon: "📦", label: "Expédier vos colis" },
      { icon: "📍", label: "Suivre vos livraisons" },
      { icon: "📄", label: "Gérer vos contrats & factures" },
      { icon: "🤝", label: "Trouver des prestataires" },
    ],
  },
  {
    title: "Une plateforme complète et sécurisée",
    body: null,
    checklist: [
      "Suivi en temps réel",
      "Devis & factures",
      "Gestion des douanes",
      "Contrats & signature électronique",
    ],
  },
] as const;

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>{slide.title}</Text>
        {"body" in slide && slide.body && <Text style={styles.body}>{slide.body}</Text>}

        {"features" in slide && slide.features && (
          <View style={styles.featureGrid}>
            {slide.features.map((f) => (
              <View key={f.label} style={styles.featureCard}>
                <IconBadge icon={f.icon} size={36} />
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>
        )}

        {"checklist" in slide && slide.checklist && (
          <View style={styles.checklist}>
            {slide.checklist.map((item) => (
              <View key={item} style={styles.checklistRow}>
                <Ionicons name="checkmark-circle" size={20} color={colors.blue400} />
                <Text style={styles.checklistLabel}>{item}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.actions}>
        <Button title={isLast ? "Commencer →" : "Suivant →"} onPress={() => (isLast ? onDone() : setIndex((i) => i + 1))} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navy950, padding: 28, paddingTop: 90, justifyContent: "space-between" },
  content: { flex: 1 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800", marginBottom: 12 },
  body: { color: colors.mutedOnNavy, fontSize: 13, marginBottom: 20 },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  featureCard: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: radius.md,
    padding: 14,
    gap: 8,
  },
  featureLabel: { color: "#fff", fontSize: 12, fontWeight: "600" },
  checklist: { gap: 14, marginTop: 8 },
  checklistRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checklistLabel: { color: "#fff", fontSize: 14 },
  dots: { flexDirection: "row", gap: 6, justifyContent: "center", marginBottom: 20 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.25)" },
  dotActive: { backgroundColor: colors.blue400, width: 20 },
  actions: { paddingBottom: 10 },
});
