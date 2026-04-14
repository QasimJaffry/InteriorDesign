import Feather from "@expo/vector-icons/Feather";
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
        <View style={styles.emptyIcon}>
          <Feather name="heart" size={32} color={palette.sage} />
        </View>
        <Text style={styles.emptyTitle}>Nothing saved yet</Text>
        <Text style={styles.emptySub}>
          Heart pieces from the catalogue or after a scan — they'll appear here
          for AR placement and checkout prep.
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
      {/* Collection count header */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>Your collection</Text>
        <Text style={styles.headerCount}>
          {savedItems.length} {savedItems.length === 1 ? "piece" : "pieces"}
        </Text>
      </View>

      <FlatList
        data={savedItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
  header: {
    paddingHorizontal: space.md + 2,
    paddingTop: space.md,
    paddingBottom: space.sm,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderSubtle,
    marginBottom: space.xs,
  },
  headerEyebrow: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 26,
    color: palette.text,
    letterSpacing: -0.2,
  },
  headerCount: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    color: palette.textMuted,
    marginBottom: 3,
  },
  list: {
    paddingHorizontal: 6,
    paddingBottom: space.xl,
    paddingTop: space.xs,
  },
  row: {
    gap: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: space.lg,
    backgroundColor: palette.bg,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.sageMuted,
    borderWidth: 1,
    borderColor: palette.sageBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.lg,
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
    maxWidth: 300,
  },
  primary: {
    backgroundColor: palette.sage,
    paddingHorizontal: space.xl,
    paddingVertical: 15,
    borderRadius: radius.full,
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
