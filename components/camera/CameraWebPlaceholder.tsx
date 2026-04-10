import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { fontFamily, palette, space } from "@/constants/theme";

export function CameraWebPlaceholder() {
  return (
    <View style={styles.center}>
      <Text style={styles.eyebrow}>Scan</Text>
      <Text style={styles.title}>Native ML scanning</Text>
      <Text style={styles.msg}>
        Room scanning runs on iOS and Android with a development build that
        includes Google ML Kit. Use a device build to detect furniture and open
        tailored suggestions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: space.lg,
    backgroundColor: palette.bg,
  },
  eyebrow: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: palette.sage,
    marginBottom: space.sm,
  },
  title: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 24,
    color: palette.text,
    marginBottom: space.md,
    textAlign: "center",
  },
  msg: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 340,
  },
});
