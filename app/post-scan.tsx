import Feather from "@expo/vector-icons/Feather";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FurnitureCard } from "@/components/FurnitureCard";
import { useAuthSession } from "@/contexts/AuthContext";
import { useFurniture } from "@/contexts/FurnitureContext";
import {
  INSPIRATION_DATA,
  type InspirationItem,
} from "@/constants/inspirationData";
import { getRoomSuggestionsForType } from "@/constants/roomSuggestions";
import { useToggleFavourite } from "@/hooks/useFavourites";
import { useAppStore } from "@/store/appStore";
import { fontFamily, palette, radius, space } from "@/constants/theme";
import type { Furniture } from "@/types/models";

const SCREEN_W = Dimensions.get("window").width;
const INSPO_CARD_W = SCREEN_W * 0.62;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickSuggestions(
  items: Furniture[],
  detectedTypes: string[],
  complementaryTypes: string[],
): Furniture[] {
  const primarySet = new Set(detectedTypes.map((t) => t.toLowerCase()));
  const secondary = complementaryTypes.filter((t) => !primarySet.has(t));

  const primary = items.filter((i) => primarySet.has(i.type.toLowerCase()));
  const comp = items.filter((i) => {
    const t = i.type.toLowerCase();
    return !primarySet.has(t) && secondary.includes(t);
  });

  const out: Furniture[] = [];
  const seen = new Set<string>();
  for (const list of [primary, comp]) {
    for (const row of list) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      out.push(row);
      if (out.length >= 14) return out;
    }
  }
  return out;
}

function filterInspirationByTypes(
  detectedTypes: string[],
): InspirationItem[] {
  const types = new Set(detectedTypes.map((t) => t.toLowerCase()));
  const matched = INSPIRATION_DATA.filter((item) =>
    item.tags.some((tag) => types.has(tag.toLowerCase())),
  );
  // Deduplicate and cap
  return matched.slice(0, 12);
}

// ─── Inspiration scroll card ──────────────────────────────────────────────────

function InspoCard({ item }: { item: InspirationItem }) {
  return (
    <View style={styles.inspoCard}>
      <Image source={{ uri: item.url }} style={styles.inspoImage} resizeMode="cover" />
      <View style={styles.inspoOverlay} />
      <View style={styles.inspoMeta}>
        <Text style={styles.inspoStyle}>{item.style}</Text>
        <Text style={styles.inspoLabel} numberOfLines={2}>
          {item.label}
        </Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PostScanScreen() {
  const { user } = useAuthSession();
  const params = useLocalSearchParams<{
    detectedType?: string;
    confidence?: string;
    allTypes?: string;
  }>();

  const detectedType =
    typeof params.detectedType === "string"
      ? params.detectedType
      : params.detectedType?.[0];
  const confidenceStr =
    typeof params.confidence === "string"
      ? params.confidence
      : params.confidence?.[0];
  const allTypesStr =
    typeof params.allTypes === "string"
      ? params.allTypes
      : params.allTypes?.[0];

  // All detected types (primary first). Falls back to just the primary type.
  const allDetectedTypes = useMemo(() => {
    if (allTypesStr) {
      const parts = allTypesStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length > 0) return parts;
    }
    return detectedType ? [detectedType] : [];
  }, [allTypesStr, detectedType]);

  const { items, loading, error } = useFurniture();
  const { toggle, busy: favBusy } = useToggleFavourite();
  const savedIds = useAppStore((s) => s.savedIds);

  // Use the primary (highest-confidence) type for copy/layout ideas
  const primaryType = allDetectedTypes[0] ?? "";
  const bundle = useMemo(
    () => getRoomSuggestionsForType(primaryType),
    [primaryType],
  );

  // Union of complementary types for all detected furniture
  const complementaryTypes = useMemo(() => {
    const all = allDetectedTypes.flatMap(
      (t) => getRoomSuggestionsForType(t).complementaryTypes,
    );
    return [...new Set(all)];
  }, [allDetectedTypes]);

  const suggestions = useMemo(
    () => pickSuggestions(items, allDetectedTypes, complementaryTypes),
    [items, allDetectedTypes, complementaryTypes],
  );

  const inspoImages = useMemo(
    () => filterInspirationByTypes(allDetectedTypes),
    [allDetectedTypes],
  );

  if (!user) return <Redirect href="/login" />;
  if (!detectedType) return <Redirect href="/(tabs)" />;

  const confPct = confidenceStr
    ? Math.round(Number.parseFloat(confidenceStr) * 100)
    : null;

  return (
    <View style={styles.root}>
      {/* Fixed header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Feather name="x" size={20} color={palette.textMuted} />
        </Pressable>

        <Text style={styles.kicker}>Scan result</Text>
        <Text style={styles.title}>{bundle.headline}</Text>

        {/* Detected type chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {allDetectedTypes.map((t, idx) => (
            <View key={t} style={[styles.chip, idx === 0 && styles.chipPrimary]}>
              <View style={[styles.chipDot, idx === 0 && styles.chipDotPrimary]} />
              <Text style={[styles.chipText, idx === 0 && styles.chipTextPrimary]}>
                {t}
                {idx === 0 && confPct != null && !Number.isNaN(confPct)
                  ? ` · ${confPct}%`
                  : ""}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Text style={styles.intro}>{bundle.intro}</Text>

        {/* IRL Inspiration images */}
        {inspoImages.length > 0 && (
          <View style={styles.inspoSection}>
            <Text style={styles.sectionLabel}>Interior inspiration</Text>
            <Text style={styles.sectionSub}>
              Real spaces featuring {allDetectedTypes.slice(0, 2).join(" & ")} pieces
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.inspoRow}
            >
              {inspoImages.map((item) => (
                <InspoCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Layout ideas */}
        <Text style={styles.sectionLabel}>Layout tips</Text>
        {bundle.layoutIdeas.map((line, idx) => (
          <View key={idx} style={styles.tipRow}>
            <View style={styles.tipBullet}>
              <Feather name="check" size={11} color={palette.sage} />
            </View>
            <Text style={styles.tipText}>{line}</Text>
          </View>
        ))}

        {/* AR CTA banner */}
        <Pressable
          style={styles.arBanner}
          onPress={() => router.replace("/(tabs)/ar")}
        >
          <View style={styles.arBannerLeft}>
            <View style={styles.arIconWrap}>
              <Feather name="box" size={20} color={palette.sage} />
            </View>
            <View>
              <Text style={styles.arBannerTitle}>Place in your room</Text>
              <Text style={styles.arBannerSub}>
                See how {primaryType} pieces look in AR
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color={palette.sage} />
        </Pressable>

        {/* Furniture suggestions */}
        <Text style={styles.sectionLabel}>Suggested pieces</Text>
        <Text style={styles.sectionSub}>
          Matched to your scan — primary detections first, then complementary picks.
        </Text>

        {error ? (
          <Text style={styles.err}>{error}</Text>
        ) : loading ? (
          <Text style={styles.muted}>Loading catalogue…</Text>
        ) : suggestions.length === 0 ? (
          <Text style={styles.muted}>
            No pieces matched this category. Try another scan or browse Home.
          </Text>
        ) : (
          <FlatList
            data={suggestions}
            keyExtractor={(row) => row.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
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

        {/* Bottom actions */}
        <Pressable
          style={styles.primary}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.primaryText}>Browse full catalogue</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
    paddingTop: 56,
  },

  // ── Header ────────────────────────────────────────────────────────────────
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
    backgroundColor: palette.surface,
    borderRadius: radius.full,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  kicker: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.sage,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: space.xs,
  },
  title: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.text,
    fontSize: 24,
    marginBottom: space.md,
    paddingRight: 44,
    lineHeight: 30,
    letterSpacing: -0.2,
  },

  // Detection chips
  chipsRow: {
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipPrimary: {
    backgroundColor: palette.sageMuted,
    borderColor: palette.sageBorder,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.textMuted,
  },
  chipDotPrimary: {
    backgroundColor: palette.sage,
  },
  chipText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textSecondary,
    fontSize: 13,
    textTransform: "capitalize",
  },
  chipTextPrimary: {
    color: palette.sage,
    fontFamily: fontFamily.sansSemiBold,
  },

  // ── Scroll body ───────────────────────────────────────────────────────────
  scroll: {
    padding: space.lg,
    paddingBottom: 48,
  },
  intro: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: space.lg,
  },

  // ── Inspiration strip ─────────────────────────────────────────────────────
  inspoSection: {
    marginBottom: space.lg,
  },
  inspoRow: {
    gap: 10,
    paddingRight: space.lg,
  },
  inspoCard: {
    width: INSPO_CARD_W,
    height: INSPO_CARD_W * 0.7,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: palette.surface2,
  },
  inspoImage: {
    width: "100%",
    height: "100%",
  },
  inspoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(8, 11, 20, 0.6)",
  },
  inspoMeta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  inspoStyle: {
    fontFamily: fontFamily.sansSemiBold,
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  inspoLabel: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.white,
    fontSize: 13,
    lineHeight: 18,
  },

  // ── Section labels ────────────────────────────────────────────────────────
  sectionLabel: {
    fontFamily: fontFamily.displayMedium,
    color: palette.text,
    fontSize: 19,
    marginBottom: 4,
    marginTop: space.xs,
  },
  sectionSub: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: space.md,
    textTransform: "capitalize",
  },

  // ── Layout tips ───────────────────────────────────────────────────────────
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  tipBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.sageMuted,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  // ── AR banner ─────────────────────────────────────────────────────────────
  arBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: palette.sageMuted,
    borderWidth: 1,
    borderColor: palette.sageBorder,
    borderRadius: radius.xl,
    padding: space.md,
    marginTop: space.md,
    marginBottom: space.lg,
  },
  arBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    flex: 1,
  },
  arIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.bg,
    borderWidth: 1,
    borderColor: palette.sageBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  arBannerTitle: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.text,
    fontSize: 15,
  },
  arBannerSub: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 12,
    textTransform: "capitalize",
    marginTop: 2,
  },

  // ── Grid ─────────────────────────────────────────────────────────────────
  gridRow: {
    paddingHorizontal: 4,
  },

  // ── Error / empty ─────────────────────────────────────────────────────────
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

  // ── Bottom CTA ────────────────────────────────────────────────────────────
  primary: {
    backgroundColor: palette.sage,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: space.lg,
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 16,
  },
});
