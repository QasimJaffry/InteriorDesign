import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { FurnitureCard } from "@/components/FurnitureCard";
import { SearchBar } from "@/components/SearchBar";
import { useAuthSession } from "@/contexts/AuthContext";
import { useFurniture } from "@/contexts/FurnitureContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useScanResult } from "@/hooks/useScanResult";
import { useToggleFavourite } from "@/hooks/useFavourites";
import { useAppStore } from "@/store/appStore";

export default function HomeScreen() {
  const { isOfflineMode } = useAuthSession();
  const { items, loading, error, isDemoCatalog } = useFurniture();
  const { scanResult } = useScanResult();
  const { toggle, busy: favBusy } = useToggleFavourite();
  const savedIds = useAppStore((s) => s.savedIds);
  const scanFilter = useAppStore((s) => s.scanFilter);
  const setScanFilter = useAppStore((s) => s.setScanFilter);

  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 300);
  const lastAppliedScanMs = useRef<number | null>(null);

  useEffect(() => {
    const scannedAt = scanResult?.scannedAt;
    const ts =
      scannedAt && typeof scannedAt.toMillis === "function"
        ? scannedAt.toMillis()
        : null;
    if (
      scanResult?.detectedType &&
      ts !== null &&
      ts !== lastAppliedScanMs.current
    ) {
      setScanFilter(scanResult.detectedType);
      lastAppliedScanMs.current = ts;
    }
  }, [scanResult, setScanFilter]);

  const filtered = useMemo(() => {
    let list = items;
    if (scanFilter) {
      list = list.filter(
        (f) => f.type.toLowerCase() === scanFilter.toLowerCase(),
      );
    }
    const q = debounced.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.type.toLowerCase().includes(q),
      );
    }
    return list;
  }, [items, debounced, scanFilter]);

  useEffect(() => {
    if (error && !isOfflineMode) {
      Toast.show({ type: "error", text1: "Catalogue", text2: error });
    }
  }, [error, isOfflineMode]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c45c5c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />
      {isOfflineMode ? (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>
            Offline mode — no Firebase. Catalogue, saved items, and last scan
            stay on this device only.
          </Text>
        </View>
      ) : isDemoCatalog ? (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>
            Demo catalogue (bundled CC0 models). Run{" "}
            <Text style={styles.demoMono}>npm run seed:furniture</Text> to load
            your own into Firestore.
          </Text>
        </View>
      ) : null}
      {scanFilter ? (
        <View style={styles.filterRow}>
          <Text style={styles.filterText}>
            Filter: {scanFilter}
          </Text>
          <Pressable onPress={() => setScanFilter(null)} style={styles.clearChip}>
            <Text style={styles.clearChipText}>Clear</Text>
          </Pressable>
        </View>
      ) : null}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No pieces match your filters.</Text>
        }
        renderItem={({ item }) => (
          <FurnitureCard
            item={item}
            isSaved={savedIds.includes(item.id)}
            saveDisabled={favBusy}
            onToggleSave={async () => {
              try {
                await toggle(item.id, savedIds.includes(item.id));
              } catch {
                Toast.show({
                  type: "error",
                  text1: "Could not update saved items",
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f12",
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    paddingHorizontal: 8,
  },
  empty: {
    color: "#889",
    textAlign: "center",
    marginTop: 48,
    paddingHorizontal: 24,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterText: {
    color: "#aab",
    fontSize: 14,
  },
  clearChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#2a2a32",
  },
  clearChipText: {
    color: "#8ab4ff",
    fontSize: 14,
    fontWeight: "600",
  },
  demoBanner: {
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1e2430",
    borderWidth: 1,
    borderColor: "#2e3a52",
  },
  demoBannerText: {
    color: "#aab6c9",
    fontSize: 13,
    lineHeight: 18,
  },
  demoMono: {
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    color: "#c9d4e8",
    fontSize: 12,
  },
});
