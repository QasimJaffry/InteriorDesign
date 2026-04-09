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
          size={22}
          color={isSaved ? "#c45c5c" : "#888"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    backgroundColor: "#1a1a20",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#2a2a32",
  },
  meta: {
    padding: 10,
    paddingRight: 40,
  },
  type: {
    color: "#9ab",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    color: "#eef2f6",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});
