import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SearchBar } from "@/components/SearchBar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  INSPIRATION_DATA,
  type InspirationItem,
} from "@/constants/inspirationData";
import { fontFamily, palette, radius, space } from "@/constants/theme";

const SCREEN_W = Dimensions.get("window").width;
const CARD_GAP = 10;
const CARD_W = (SCREEN_W - CARD_GAP * 3) / 2;
const HERO_H = 230;

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Living", value: "living_room" },
  { label: "Bedroom", value: "bedroom" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Dining", value: "dining" },
  { label: "Bathroom", value: "bathroom" },
  { label: "Office", value: "home_office" },
  { label: "Hallway", value: "hallway" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryChips({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (v: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsRow}
    >
      {CATEGORIES.map((cat) => (
        <Pressable
          key={cat.value}
          style={[styles.chip, active === cat.value && styles.chipActive]}
          onPress={() => onSelect(cat.value)}
        >
          <Text style={[styles.chipText, active === cat.value && styles.chipTextActive]}>
            {cat.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

/** Full-width featured hero card — first item in the feed. */
function HeroCard({ item }: { item: InspirationItem }) {
  return (
    <View style={styles.hero}>
      <Image
        source={{ uri: item.url }}
        style={styles.heroImage}
        resizeMode="cover"
      />
      {/* Bottom gradient only — keeps top of image clean */}
      <View style={styles.heroOverlay} />

      {/* Featured badge */}
      <View style={styles.heroBadge}>
        <View style={styles.heroBadgeDot} />
        <Text style={styles.heroBadgeText}>Featured</Text>
      </View>

      {/* Bottom meta */}
      <View style={styles.heroMeta}>
        <View style={styles.heroStyleRow}>
          <Text style={styles.heroStyle}>{item.style}</Text>
          <Text style={styles.heroCat}>
            {item.category.replace("_", " ")}
          </Text>
        </View>
        <Text style={styles.heroLabel} numberOfLines={2}>
          {item.label}
        </Text>
      </View>
    </View>
  );
}

/** Two-column grid card. */
function InspirationCard({ item }: { item: InspirationItem }) {
  const tall = item.category === "bedroom" || item.category === "bathroom";
  return (
    <View style={[styles.card, { width: CARD_W }]}>
      <Image
        source={{ uri: item.url }}
        style={[styles.cardImage, { aspectRatio: tall ? 3 / 4 : 4 / 3 }]}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <View style={styles.cardMeta}>
        <Text style={styles.cardStyle}>{item.style}</Text>
        <Text style={styles.cardLabel} numberOfLines={2}>
          {item.label}
        </Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const debounced = useDebouncedValue(query, 300);

  const feed = useMemo(() => {
    let list = [...INSPIRATION_DATA];
    if (activeCategory) {
      list = list.filter((item) => item.category === activeCategory);
    }
    const q = debounced.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.style.toLowerCase().includes(q) ||
          item.category.toLowerCase().replace("_", " ").includes(q) ||
          item.tags.some((t) => t.includes(q)),
      );
    }
    return list;
  }, [activeCategory, debounced]);

  const heroItem = feed[0] ?? null;
  const gridItems = feed.slice(1);

  const ListHeader = (
    <>
      <SearchBar value={query} onChangeText={setQuery} />

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>Curated</Text>
          <Text style={styles.sectionTitle}>Inspiration</Text>
        </View>
        <View style={styles.sectionMeta}>
          <Text style={styles.sectionCount}>{INSPIRATION_DATA.length}</Text>
          <Text style={styles.sectionCountLabel}>spaces</Text>
        </View>
      </View>

      <CategoryChips active={activeCategory} onSelect={setActiveCategory} />

      {heroItem && <HeroCard item={heroItem} />}

      {gridItems.length > 0 && (
        <View style={styles.gridHeader}>
          <Text style={styles.gridHeaderText}>More spaces</Text>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={gridItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          !heroItem ? (
            <Text style={styles.empty}>No spaces match your search.</Text>
          ) : null
        }
        renderItem={({ item }) => <InspirationCard item={item} />}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },

  // ── Grid ─────────────────────────────────────────────────────────────────
  list: {
    paddingHorizontal: CARD_GAP,
    paddingBottom: space.xl,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },

  // ── Hero card ─────────────────────────────────────────────────────────────
  hero: {
    marginHorizontal: CARD_GAP,
    marginBottom: CARD_GAP,
    borderRadius: radius.xxl,
    overflow: "hidden",
    height: HERO_H,
    backgroundColor: palette.surface2,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  // Single bottom-only overlay — image visible in top ~60%
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "48%",
    backgroundColor: "rgba(8, 11, 20, 0.62)",
  },
  heroBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: palette.sage,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.white,
  },
  heroBadgeText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.white,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  heroMeta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    paddingBottom: 20,
  },
  heroStyleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  heroStyle: {
    fontFamily: fontFamily.sansSemiBold,
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  heroCat: {
    fontFamily: fontFamily.sans,
    color: "rgba(255, 255, 255, 0.55)",
    fontSize: 11,
    textTransform: "capitalize",
  },
  heroLabel: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.white,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
  },

  // ── Grid card ─────────────────────────────────────────────────────────────
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: palette.surface2,
  },
  cardImage: {
    width: "100%",
    backgroundColor: palette.surface2,
  },
  // Tighter overlay — just enough to read the label
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "38%",
    backgroundColor: "rgba(8, 11, 20, 0.55)",
  },
  cardMeta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingBottom: 11,
  },
  cardStyle: {
    fontFamily: fontFamily.sansSemiBold,
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 3,
  },
  cardLabel: {
    fontFamily: fontFamily.sansMedium,
    color: palette.white,
    fontSize: 12,
    lineHeight: 17,
  },

  // ── Grid sub-header ───────────────────────────────────────────────────────
  gridHeader: {
    paddingHorizontal: CARD_GAP + 2,
    paddingBottom: CARD_GAP,
    paddingTop: 4,
  },
  gridHeaderText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // ── Section header ────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: space.md + 2,
    paddingTop: space.xs,
    paddingBottom: space.sm,
  },
  sectionEyebrow: {
    fontFamily: fontFamily.sansMedium,
    color: palette.sage,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 4,
    opacity: 0.85,
  },
  sectionTitle: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 30,
    color: palette.text,
    letterSpacing: -0.3,
  },
  sectionMeta: {
    alignItems: "flex-end",
    marginBottom: 4,
  },
  sectionCount: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 22,
    color: palette.sage,
    lineHeight: 24,
  },
  sectionCountLabel: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 11,
  },

  // ── Category chips ────────────────────────────────────────────────────────
  chipsRow: {
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
  },
  chipActive: {
    backgroundColor: palette.sageMuted,
    borderColor: palette.sageBorder,
  },
  chipText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 13,
  },
  chipTextActive: {
    color: palette.sage,
  },

  // ── Empty ─────────────────────────────────────────────────────────────────
  empty: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    textAlign: "center",
    marginTop: 56,
    paddingHorizontal: space.lg,
    fontSize: 15,
    lineHeight: 22,
  },
});
