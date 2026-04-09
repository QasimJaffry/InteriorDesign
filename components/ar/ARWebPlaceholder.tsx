import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ARWebPlaceholder() {
  return (
    <View style={styles.center}>
      <Text style={styles.msg}>
        AR furniture placement uses ViroReact native modules. Build the iOS or
        Android app with EAS or run a development build locally.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0f0f12",
  },
  msg: {
    color: "#ccd",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
