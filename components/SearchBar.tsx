import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { fontFamily, palette, radius, space } from "@/constants/theme";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.inputRow}>
        <FontAwesome
          name="search"
          size={15}
          color={palette.textMuted}
          style={styles.icon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? "Search spaces, style, or room…"}
          placeholderTextColor={palette.textMuted}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: space.md,
    paddingVertical: 13,
    gap: space.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: 15,
    color: palette.text,
    padding: 0,
    margin: 0,
  },
});
