import { Link } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { FurnitureCard } from "@/components/FurnitureCard";
import { useSavedFurniture } from "@/hooks/useSavedFurniture";
import { useToggleFavourite } from "@/hooks/useFavourites";
import { fontFamily, palette, radius, space } from "@/constants/theme";

export default function SavedScreen() {
  const { savedItems, loading, error } = useSavedFurniture();
  const { toggle, busy } = useToggleFavourite();

  useEffect(() => {
    if (error) {
      Toast.show({ type: "error", text1: "Saved items", text2: error });
    }
  }, [error]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.sage} />
      </View>
    );
  }

  if (savedItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyEyebrow}>Collection</Text>
        <Text style={styles.emptyTitle}>Nothing saved yet</Text>
        <Text style={styles.emptySub}>
          Heart pieces from the catalogue or after a scan — they will appear
          here for AR placement and checkout prep.
        </Text>
        <Link href="/(tabs)" asChild>
          <Pressable style={styles.primary}>
            <Text style={styles.primaryText}>Browse catalogue</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FurnitureCard
            item={item}
            isSaved
            saveDisabled={busy}
            onToggleSave={async () => {
              try {
                await toggle(item.id, true);
              } catch {
                Toast.show({
                  type: "error",
                  text1: "Could not remove from saved",
                });
              }
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  list: {
    paddingBottom: space.lg,
  },
  row: {
    paddingHorizontal: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: space.lg,
    backgroundColor: palette.bg,
  },
  emptyEyebrow: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: space.sm,
  },
  emptyTitle: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.text,
    fontSize: 26,
    marginBottom: space.sm,
    textAlign: "center",
  },
  emptySub: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: space.lg,
    maxWidth: 320,
  },
  primary: {
    backgroundColor: palette.sage,
    paddingHorizontal: space.lg,
    paddingVertical: 16,
    borderRadius: radius.md,
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 16,
  },
});
