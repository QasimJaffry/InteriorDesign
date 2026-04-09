import { Redirect, router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FurnitureCard } from "@/components/FurnitureCard";
import { useAuthSession } from "@/contexts/AuthContext";
import { useFurniture } from "@/contexts/FurnitureContext";
import { getRoomSuggestionsForType } from "@/constants/roomSuggestions";
import { useToggleFavourite } from "@/hooks/useFavourites";
import { useAppStore } from "@/store/appStore";
import type { Furniture } from "@/types/models";

function pickSuggestions(
  items: Furniture[],
  detected: string,
  complementary: string[],
): Furniture[] {
  const d = detected.toLowerCase();
  const primary = items.filter((i) => i.type.toLowerCase() === d);
  const secondary = items.filter((i) => {
    const t = i.type.toLowerCase();
    return t !== d && complementary.includes(t);
  });
  const out: Furniture[] = [];
  const seen = new Set<string>();
  for (const list of [primary, secondary]) {
    for (const row of list) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      out.push(row);
      if (out.length >= 14) {
        return out;
      }
    }
  }
  return out;
}

export default function PostScanScreen() {
  const { user, isOfflineMode } = useAuthSession();
  const params = useLocalSearchParams<{
    detectedType?: string;
    confidence?: string;
  }>();
  const detectedType =
    typeof params.detectedType === "string"
      ? params.detectedType
      : params.detectedType?.[0];
  const confidenceStr =
    typeof params.confidence === "string"
      ? params.confidence
      : params.confidence?.[0];

  const { items, loading, error, isDemoCatalog } = useFurniture();
  const { toggle, busy: favBusy } = useToggleFavourite();
  const savedIds = useAppStore((s) => s.savedIds);

  const bundle = useMemo(
    () => getRoomSuggestionsForType(detectedType ?? ""),
    [detectedType],
  );

  const suggestions = useMemo(() => {
    if (!detectedType) {
      return [];
    }
    return pickSuggestions(
      items,
      detectedType,
      bundle.complementaryTypes,
    );
  }, [items, detectedType, bundle.complementaryTypes]);

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!detectedType) {
    return <Redirect href="/(tabs)" />;
  }

  const confPct = confidenceStr
    ? Math.round(Number.parseFloat(confidenceStr) * 100)
    : null;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.kicker}>Based on your scan</Text>
        <Text style={styles.title}>{bundle.headline}</Text>
        <Text style={styles.detected}>
          Detected category:{" "}
          <Text style={styles.detectedStrong}>{detectedType}</Text>
          {confPct != null && !Number.isNaN(confPct) ? (
            <Text style={styles.conf}> · ~{confPct}% confidence</Text>
          ) : null}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{bundle.intro}</Text>

        {isOfflineMode ? (
          <Text style={styles.demoNote}>
            Offline mode: bundled catalogue only; heart saves stay on this
            device.
          </Text>
        ) : isDemoCatalog ? (
          <Text style={styles.demoNote}>
            Using the built-in demo catalogue until Firestore has furniture
            documents.
          </Text>
        ) : null}

        <Text style={styles.sectionLabel}>Room layout ideas</Text>
        {bundle.layoutIdeas.map((line, idx) => (
          <View key={idx} style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{line}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Suggested pieces for you</Text>
        <Text style={styles.subLabel}>
          Matching your category first, then pieces that pair well in a typical
          layout.
        </Text>

        {error ? (
          <Text style={styles.err}>{error}</Text>
        ) : loading ? (
          <Text style={styles.muted}>Loading catalogue…</Text>
        ) : suggestions.length === 0 ? (
          <Text style={styles.muted}>
            No pieces matched this category in the catalogue. Try another scan
            or browse Home for all types.
          </Text>
        ) : (
          <FlatList
            data={suggestions}
            keyExtractor={(row) => row.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <FurnitureCard
                item={item}
                isSaved={savedIds.includes(item.id)}
                saveDisabled={favBusy}
                onToggleSave={() => {
                  void toggle(item.id, savedIds.includes(item.id));
                }}
              />
            )}
          />
        )}

        <View style={styles.actions}>
          <Pressable
            style={styles.primary}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.primaryText}>Browse full catalogue</Text>
          </Pressable>
          <Pressable
            style={styles.secondary}
            onPress={() => router.replace("/(tabs)/ar")}
          >
            <Text style={styles.secondaryText}>Place in AR</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f0f12",
    paddingTop: 56,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2e2e38",
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    top: 0,
    padding: 8,
    zIndex: 2,
  },
  closeText: {
    color: "#aab",
    fontSize: 22,
  },
  kicker: {
    color: "#8ab4ff",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    color: "#eef2f6",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    paddingRight: 36,
  },
  detected: {
    color: "#aab",
    fontSize: 15,
  },
  detectedStrong: {
    color: "#e8ecf0",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  conf: {
    color: "#889",
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    color: "#c5cad3",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  demoNote: {
    color: "#8ab4ff",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1e2430",
    overflow: "hidden",
  },
  sectionLabel: {
    color: "#eef2f6",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 8,
  },
  subLabel: {
    color: "#889",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: "row",
    marginBottom: 10,
    paddingRight: 8,
  },
  tipBullet: {
    color: "#c45c5c",
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    color: "#b8c0cc",
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    paddingHorizontal: 4,
  },
  err: {
    color: "#f88",
    marginBottom: 12,
  },
  muted: {
    color: "#889",
    marginBottom: 12,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  primary: {
    backgroundColor: "#c45c5c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  secondary: {
    borderWidth: 1,
    borderColor: "#4a4a58",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: "#e8ecf0",
    fontSize: 17,
    fontWeight: "600",
  },
});
