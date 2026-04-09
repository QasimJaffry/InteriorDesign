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
        <ActivityIndicator size="large" color="#c45c5c" />
      </View>
    );
  }

  if (savedItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No saved pieces yet</Text>
        <Text style={styles.emptySub}>
          Save items from the catalogue with the heart icon.
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
    backgroundColor: "#0f0f12",
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    paddingHorizontal: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0f0f12",
  },
  emptyTitle: {
    color: "#eef2f6",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySub: {
    color: "#889",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  primary: {
    backgroundColor: "#c45c5c",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
