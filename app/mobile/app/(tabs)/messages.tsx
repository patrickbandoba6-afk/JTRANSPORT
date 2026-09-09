import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../lib/theme";

export default function Messages() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>💬 Messages</Text>
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          🚧 La messagerie interne (conversations liées à une mission, un devis, une expédition ou un contrat) est en
          cours de construction. Rien n'est affiché ici tant que le module n'est pas réellement branché.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 60, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink, marginBottom: 16 },
  notice: { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a", borderRadius: radius.md, padding: 14 },
  noticeText: { color: "#92400e", fontSize: 13, lineHeight: 19 },
});
