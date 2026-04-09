import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function CameraWebPlaceholder() {
  return (
    <View style={styles.center}>
      <Text style={styles.msg}>
        Room scanning runs on iOS and Android with a development build that
        includes Google ML Kit native modules.
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
