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

/**
 * Catalogue product sheet — cutout on warm stage, meta below the image.
 * Distinct from inspiration mood-board tiles.
 */
export function FurnitureCard({
  item,
  isSaved,
  onToggleSave,
  saveDisabled,
  style,
}: Props) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.stage}>
        <Image
          source={item.image ?? { uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSaved ? "Remove from saved" : "Save item"}
          onPress={onToggleSave}
          disabled={saveDisabled}
          style={[styles.heartBtn, isSaved && styles.heartBtnActive]}
        >
          <FontAwesome
            name={isSaved ? "heart" : "heart-o"}
            size={15}
            color={isSaved ? palette.sageDeep : palette.textSecondary}
          />
        </Pressable>
      </View>

      <View style={styles.meta}>
        <Text style={styles.type} numberOfLines={1}>
          {item.type}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: palette.elevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderSubtle,
  },
  stage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  meta: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 3,
  },
  type: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  name: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.text,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.elevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  heartBtnActive: {
    backgroundColor: palette.sageMuted,
    borderColor: palette.sageBorder,
  },
});
