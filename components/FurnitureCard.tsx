import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import { fontFamily, palette, radius } from "@/constants/theme";
import type { Furniture } from "@/types/models";

type Props = {
  item: Furniture;
  isSaved: boolean;
  onToggleSave: () => void;
  saveDisabled?: boolean;
  style?: ViewStyle;
};

export function FurnitureCard({
  item,
  isSaved,
  onToggleSave,
  saveDisabled,
  style,
}: Props) {
  return (
    <View style={[styles.card, style]}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      {/* Dark gradient overlay at bottom */}
      <View style={styles.overlay} />

      {/* Meta overlaid on image */}
      <View style={styles.meta}>
        <Text style={styles.type} numberOfLines={1}>
          {item.type}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
      </View>

      {/* Heart button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "Remove from saved" : "Save item"}
        onPress={onToggleSave}
        disabled={saveDisabled}
        style={styles.heartBtn}
      >
        <FontAwesome
          name={isSaved ? "heart" : "heart-o"}
          size={18}
          color={isSaved ? palette.sage : palette.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: palette.surface2,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: palette.surface2,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "38%",
    backgroundColor: "rgba(14, 16, 32, 0.58)",
  },
  meta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingRight: 38,
    paddingBottom: 12,
  },
  type: {
    fontFamily: fontFamily.sansMedium,
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  name: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.white,
    fontSize: 13,
    lineHeight: 18,
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(14, 16, 32, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
});
