import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { fontFamily, palette, radius, space } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <View style={styles.container}>
        <Text style={styles.eyebrow}>404</Text>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Text style={styles.sub}>
          The route may have moved — head back to your studio home.
        </Text>
        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Go to home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: space.lg,
    backgroundColor: palette.bg,
  },
  eyebrow: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 12,
    letterSpacing: 3,
    color: palette.sage,
    marginBottom: space.md,
  },
  title: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 26,
    color: palette.text,
    textAlign: "center",
    marginBottom: space.sm,
  },
  sub: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: space.lg,
    maxWidth: 300,
  },
  button: {
    backgroundColor: palette.sage,
    paddingHorizontal: space.lg,
    paddingVertical: 16,
    borderRadius: radius.md,
  },
  buttonText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 16,
  },
});
