import { useRef } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../lib/theme";

export type Point = { x: number; y: number };
export type Stroke = Point[];

// Hand-drawn signature capture with no extra dependency: each pointer move
// becomes one thin rotated View, so a signature is a few hundred segments
// rather than thousands of dots. Strokes are serialised to JSON and stored
// with the contract / proof of delivery as part of the audit trail.
export function SignaturePad({
  strokes,
  onStrokesChange,
  height = 160,
  label = "Signature",
}: {
  strokes: Stroke[];
  onStrokesChange: (strokes: Stroke[]) => void;
  height?: number;
  label?: string;
}) {
  const strokesRef = useRef<Stroke[]>(strokes);
  strokesRef.current = strokes;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        onStrokesChange([...strokesRef.current, [{ x: locationX, y: locationY }]]);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        const current = strokesRef.current;
        if (current.length === 0) return;
        const last = current[current.length - 1];
        const prev = last[last.length - 1];
        // Skip sub-pixel jitter to keep the segment count reasonable.
        if (prev && Math.hypot(locationX - prev.x, locationY - prev.y) < 1.5) return;
        onStrokesChange([...current.slice(0, -1), [...last, { x: locationX, y: locationY }]]);
      },
    }),
  ).current;

  const isEmpty = strokes.every((s) => s.length < 2);

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {!isEmpty && (
          <Text style={styles.clear} onPress={() => onStrokesChange([])}>
            Effacer
          </Text>
        )}
      </View>
      <View style={[styles.pad, { height }]} {...responder.panHandlers}>
        {isEmpty && <Text style={styles.hint}>Signez ici avec votre doigt</Text>}
        {strokes.map((stroke, si) =>
          stroke.slice(1).map((point, pi) => {
            const prev = stroke[pi];
            const dx = point.x - prev.x;
            const dy = point.y - prev.y;
            const length = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);
            return (
              <View
                key={`${si}-${pi}`}
                style={{
                  position: "absolute",
                  left: prev.x,
                  top: prev.y - 1.5,
                  width: length,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: colors.navy900,
                  transform: [{ rotate: `${angle}rad` }],
                  transformOrigin: "left center",
                }}
              />
            );
          }),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "700", color: colors.ink },
  clear: { color: colors.blue600, fontWeight: "700", fontSize: 13 },
  pad: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: "#fff",
    overflow: "hidden",
    justifyContent: "center",
  },
  hint: { textAlign: "center", color: colors.muted, fontSize: 12 },
});
