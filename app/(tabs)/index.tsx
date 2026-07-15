import React, { useMemo, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SearchBar } from "@/components/SearchBar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  INSPIRATION_DATA,
  type InspirationItem,
} from "@/constants/inspirationData";
import { fontFamily, palette, radius, space } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";

const SCREEN_W = Dimensions.get("window").width;
const CARD_GAP = 12;
/** FlatList already pads CARD_GAP; cards share one gap between columns */
const CARD_W = (SCREEN_W - CARD_GAP * 3) / 2;
/** 4:5 — large enough to read as rooms, not stubby strips */
const CARD_H = Math.round(CARD_W * (5 / 4));
const HERO_W = SCREEN_W - CARD_GAP * 2;
/** Featured tile — tall enough to showcase a full room */
const HERO_H = Math.round(HERO_W * 1.05);

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Living", value: "living_room" },
  { label: "Bedroom", value: "bedroom" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Dining", value: "dining" },
  { label: "Bathroom", value: "bathroom" },
  { label: "Office", value: "home_office" },
];

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
          <Text
            style={[
              styles.chipText,
              active === cat.value && styles.chipTextActive,
            ]}
          >
            {cat.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

/** Full-bleed featured space — photography leads, type sits quietly. */
function HeroCard({ item }: { item: InspirationItem }) {
  return (
    <View style={[styles.hero, { width: HERO_W, height: HERO_H }]}>
      <Image
        source={item.image}
        style={{ width: HERO_W, height: HERO_H }}
        resizeMode="cover"
      />
      <View style={styles.heroOverlay} />
      <View style={styles.heroMeta}>
        <Text style={styles.heroStyle}>{item.style}</Text>
        <Text style={styles.heroLabel} numberOfLines={2}>
          {item.label}
        </Text>
      </View>
    </View>
  );
}

/** Grid tile — short 3:2 frames so rooms read as photos, not skyscrapers. */
function InspirationCard({ item }: { item: InspirationItem }) {
  return (
    <View style={[styles.card, { width: CARD_W, height: CARD_H }]}>
      <Image
        source={item.image}
        style={{ width: CARD_W, height: CARD_H }}
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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
      <View style={[styles.brandBlock, { paddingTop: Math.max(insets.top, 0) + 28 }]}>
        <Text style={styles.brandEyebrow}>Spatial interior studio</Text>
        <Text style={styles.brandTitle}>Interio</Text>
        <Text style={styles.brandSub}>
          Rooms, pieces, and try-on in place — curated for how you live.
        </Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>Curated</Text>
          <Text style={styles.sectionTitle}>Inspiration</Text>
        </View>
        <Text style={styles.sectionCount}>
          {INSPIRATION_DATA.length} spaces
        </Text>
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
      <StatusBar style="dark" backgroundColor={palette.bg} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },

  brandBlock: {
    paddingHorizontal: space.md + 2,
    paddingBottom: space.sm,
  },
  brandEyebrow: {
    fontFamily: fontFamily.sansMedium,
    color: palette.sage,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  brandTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: 42,
    color: palette.text,
    letterSpacing: -0.8,
    lineHeight: 46,
  },
  brandSub: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 22,
    color: palette.textSecondary,
    marginTop: 8,
    maxWidth: 320,
  },

  list: {
    paddingHorizontal: CARD_GAP,
    paddingBottom: space.xl + 16,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },

  hero: {
    marginBottom: CARD_GAP + 4,
    borderRadius: radius.xxl,
    overflow: "hidden",
    backgroundColor: palette.surface2,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    height: "32%",
    backgroundColor: "rgba(28, 25, 22, 0.42)",
  },
  heroMeta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 22,
  },
  heroStyle: {
    fontFamily: fontFamily.sansMedium,
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  heroLabel: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.white,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
  },

  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: palette.surface2,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: "rgba(28, 25, 22, 0.38)",
  },
  cardMeta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 8,
  },
  cardStyle: {
    fontFamily: fontFamily.sansMedium,
    color: "rgba(255, 255, 255, 0.68)",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  cardLabel: {
    fontFamily: fontFamily.displaySemibold,
    color: palette.white,
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.2,
  },

  gridHeader: {
    paddingHorizontal: CARD_GAP + 2,
    paddingBottom: CARD_GAP,
    paddingTop: 8,
  },
  gridHeaderText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: space.md + 2,
    paddingTop: space.md,
    paddingBottom: space.sm,
  },
  sectionEyebrow: {
    fontFamily: fontFamily.sansMedium,
    color: palette.sage,
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 32,
    color: palette.text,
    letterSpacing: -0.4,
  },
  sectionCount: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },

  chipsRow: {
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipActive: {
    backgroundColor: palette.text,
    borderColor: palette.text,
  },
  chipText: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textSecondary,
    fontSize: 13,
  },
  chipTextActive: {
    color: palette.bg,
  },

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
