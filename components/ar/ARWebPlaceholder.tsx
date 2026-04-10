import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { fontFamily, palette, space } from "@/constants/theme";

export function ARWebPlaceholder() {
  return (
    <View style={styles.center}>
      <Text style={styles.eyebrow}>AR studio</Text>
      <Text style={styles.title}>Place furniture in your room</Text>
      <Text style={styles.msg}>
        AR uses ViroReact native modules. Run the iOS or Android app via EAS or
        a local development build to tap-to-place GLB models with drag, pinch,
        and rotate.
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
