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
import { fontFamily, palette, radius, space } from "@/constants/theme";
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
            <Text style={styles.tipBullet}>·</Text>
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
    backgroundColor: palette.bg,
    paddingTop: 56,
  },
  header: {
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  closeBtn: {
    position: "absolute",
    right: space.md,
    top: 0,
    padding: space.sm,
    zIndex: 2,
  },
  closeText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 22,
  },
  kicker: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.link,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: space.sm,
  },
  title: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.text,
    fontSize: 26,
    marginBottom: space.sm,
    paddingRight: 40,
    lineHeight: 32,
  },
  detected: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  detectedStrong: {
    color: palette.text,
    fontFamily: fontFamily.sansSemiBold,
    textTransform: "capitalize",
  },
  conf: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
  },
  scroll: {
    padding: space.lg,
    paddingBottom: 40,
  },
  intro: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: space.lg,
  },
  demoNote: {
    fontFamily: fontFamily.sans,
    color: palette.link,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: space.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    backgroundColor: palette.infoBg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: palette.infoBorder,
  },
  sectionLabel: {
    fontFamily: fontFamily.displayMedium,
    color: palette.text,
    fontSize: 20,
    marginBottom: space.sm,
    marginTop: space.sm,
  },
  subLabel: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: space.md,
  },
  tipRow: {
    flexDirection: "row",
    marginBottom: space.sm,
    paddingRight: space.sm,
  },
  tipBullet: {
    fontFamily: fontFamily.displayBold,
    color: palette.sage,
    fontSize: 20,
    marginRight: space.sm,
    marginTop: 0,
  },
  tipText: {
    flex: 1,
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  row: {
    paddingHorizontal: 4,
  },
  err: {
    fontFamily: fontFamily.sansMedium,
    color: palette.danger,
    marginBottom: space.md,
  },
  muted: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    marginBottom: space.md,
    lineHeight: 22,
  },
  actions: {
    marginTop: space.lg,
    gap: space.md,
  },
  primary: {
    backgroundColor: palette.sage,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 17,
  },
  secondary: {
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: "center",
    backgroundColor: palette.surface,
  },
  secondaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.text,
    fontSize: 17,
  },
});
