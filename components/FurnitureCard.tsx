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
      <View style={styles.meta}>
        <Text style={styles.type} numberOfLines={1}>
          {item.type}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "Remove from saved" : "Save item"}
        onPress={onToggleSave}
        disabled={saveDisabled}
        style={styles.heartBtn}
      >
        <FontAwesome
          name={isSaved ? "heart" : "heart-o"}
          size={20}
          color={isSaved ? palette.sage : palette.textMuted}
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
    backgroundColor: palette.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: palette.borderSubtle,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: palette.surface2,
  },
  meta: {
    padding: 10,
    paddingRight: 40,
  },
  type: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textSecondary,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  name: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.text,
    fontSize: 15,
    marginTop: 4,
    lineHeight: 20,
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: palette.overlay,
  },
});
