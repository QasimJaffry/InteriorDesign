import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SearchBar } from "@/components/SearchBar";
import { useAuthSession } from "@/contexts/AuthContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useScanResult } from "@/hooks/useScanResult";
import { useAppStore } from "@/store/appStore";
import {
  INSPIRATION_DATA,
  getInspirationForScan,
  type InspirationItem,
} from "@/constants/inspirationData";
import { getRoomSuggestionsForType } from "@/constants/roomSuggestions";
import { fontFamily, palette, radius, space } from "@/constants/theme";

const CARD_GAP = 12;
const SCREEN_W = Dimensions.get("window").width;
const CARD_W = (SCREEN_W - CARD_GAP * 3) / 2;

function ScanBanner({
  detectedType,
  onClear,
}: {
  detectedType: string;
  onClear: () => void;
}) {
  const suggestion = getRoomSuggestionsForType(detectedType);
  return (
    <View style={styles.scanBanner}>
      <View style={styles.scanBannerTop}>
        <View style={styles.scanChip}>
          <Text style={styles.scanChipText}>Scan · {detectedType}</Text>
        </View>
        <Pressable onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Show all</Text>
        </Pressable>
      </View>
      <Text style={styles.scanHeadline}>{suggestion.headline}</Text>
      <Text style={styles.scanIntro} numberOfLines={2}>
        {suggestion.intro}
      </Text>
    </View>
  );
}

function InspirationCard({ item }: { item: InspirationItem }) {
  const aspectRatio = item.category === "bedroom" ? 4 / 3 : 3 / 4;
  return (
    <View style={[styles.card, { width: CARD_W }]}>
      <Image
        source={{ uri: item.url }}
        style={[styles.cardImage, { aspectRatio }]}
        resizeMode="cover"
      />
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
  const { isOfflineMode } = useAuthSession();
  const { scanResult, loading: scanLoading } = useScanResult();
  const scanFilter = useAppStore((s) => s.scanFilter);
  const setScanFilter = useAppStore((s) => s.setScanFilter);
  const lastAppliedScanMs = useRef<number | null>(null);

  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 300);

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

  const feed = useMemo(() => {
    let list = getInspirationForScan(scanFilter);
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
  }, [scanFilter, debounced]);

  if (scanLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.sage} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />

      {isOfflineMode ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Offline — inspiration and saves stay on this device.
          </Text>
        </View>
      ) : null}

      {scanFilter ? (
        <ScanBanner
          detectedType={scanFilter}
          onClear={() => setScanFilter(null)}
        />
      ) : (
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Discover</Text>
            <Text style={styles.sectionTitle}>Inspiration</Text>
          </View>
          <Text style={styles.sectionSub}>
            {INSPIRATION_DATA.length} curated spaces
          </Text>
        </View>
      )}

      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No spaces match your search.</Text>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bg,
  },
  list: {
    paddingHorizontal: CARD_GAP,
    paddingBottom: space.xl,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: palette.borderSubtle,
  },
  cardImage: {
    width: "100%",
    backgroundColor: palette.surface2,
  },
  cardMeta: {
    padding: space.sm + 2,
  },
  cardStyle: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.sage,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardLabel: {
    fontFamily: fontFamily.sansMedium,
    color: palette.text,
    fontSize: 14,
    lineHeight: 19,
  },
  banner: {
    marginHorizontal: space.md,
    marginBottom: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    backgroundColor: palette.infoBg,
    borderWidth: 1,
    borderColor: palette.infoBorder,
  },
  bannerText: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: space.md + 2,
    paddingBottom: space.md,
  },
  sectionEyebrow: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 28,
    color: palette.text,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 13,
    marginBottom: 2,
  },
  scanBanner: {
    marginHorizontal: space.md,
    marginBottom: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.sageBorder,
  },
  scanBannerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.sm,
  },
  scanChip: {
    backgroundColor: palette.sageMuted,
    borderWidth: 1,
    borderColor: palette.sageBorder,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
  },
  scanChipText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.link,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  scanHeadline: {
    fontFamily: fontFamily.displayMedium,
    color: palette.text,
    fontSize: 20,
    marginBottom: 6,
  },
  scanIntro: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  clearBtn: {
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: palette.surface2,
  },
  clearBtnText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.link,
    fontSize: 12,
  },
  empty: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    textAlign: "center",
    marginTop: 48,
    paddingHorizontal: space.lg,
    fontSize: 15,
    lineHeight: 22,
  },
});
