import { Pressable, StyleSheet, Text, View, type PressableProps, type ViewProps } from "react-native";
import { colors, radius } from "../lib/theme";

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function IconBadge({ icon, size = 44 }: { icon: string; size?: number }) {
  return (
    <View style={[styles.iconBadge, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Text style={{ fontSize: size * 0.45 }}>{icon}</Text>
    </View>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

type ButtonProps = PressableProps & { title: string; variant?: "primary" | "secondary"; disabled?: boolean };

export function Button({ title, variant = "primary", disabled, style, ...props }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        variant === "secondary" && styles.btnSecondary,
        disabled && styles.btnDisabled,
        pressed && !disabled && { opacity: 0.85 },
        typeof style === "function" ? undefined : style,
      ]}
      {...props}
    >
      <Text style={[styles.btnText, variant === "secondary" && styles.btnTextSecondary]}>{title}</Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  iconBadge: {
    backgroundColor: colors.blue600,
    alignItems: "center",
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "#eaf1ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  tagText: { color: colors.blue600, fontSize: 12, fontWeight: "700" },
  btn: {
    backgroundColor: colors.blue600,
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  btnSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  btnTextSecondary: { color: colors.navy900 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 13,
    backgroundColor: "#fff",
    fontSize: 14,
    color: colors.ink,
  },
});
