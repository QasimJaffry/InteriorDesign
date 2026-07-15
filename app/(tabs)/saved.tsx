import Feather from "@expo/vector-icons/Feather";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { FurnitureCard } from "@/components/FurnitureCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useSavedFurniture } from "@/hooks/useSavedFurniture";
import { useToggleFavourite } from "@/hooks/useFavourites";
import { useArShots } from "@/hooks/useArShots";
import { fontFamily, palette, radius, space } from "@/constants/theme";

type TabKey = "pieces" | "rooms";

export default function SavedScreen() {
  const { savedItems, loading, error } = useSavedFurniture();
  const { toggle, busy } = useToggleFavourite();
  const { shots, loading: shotsLoading, refresh, remove } = useArShots();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<TabKey>(
    params.tab === "rooms" ? "rooms" : "pieces",
  );

  useFocusEffect(
    useCallback(() => {
      void refresh();
      if (params.tab === "rooms") setTab("rooms");
    }, [refresh, params.tab]),
  );

  useEffect(() => {
    if (error) {
      Toast.show({ type: "error", text1: "Saved items", text2: error });
    }
  }, [error]);

  useEffect(() => {
    // Jump to AR rooms when user just saved a shot and has no pieces
    if (shots.length > 0 && savedItems.length === 0) {
      setTab("rooms");
    }
  }, [shots.length, savedItems.length]);

  const trailing =
    tab === "pieces"
      ? `${savedItems.length} ${savedItems.length === 1 ? "piece" : "pieces"}`
      : `${shots.length} ${shots.length === 1 ? "room" : "rooms"}`;

  if (loading && shotsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.sage} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Saved"
        subtitle="Your collection"
        trailing={trailing}
      />

      <View style={styles.segment}>
        <Pressable
          style={[styles.segBtn, tab === "pieces" && styles.segBtnActive]}
          onPress={() => setTab("pieces")}
        >
          <Text
            style={[styles.segText, tab === "pieces" && styles.segTextActive]}
          >
            Pieces
          </Text>
        </Pressable>
        <Pressable
          style={[styles.segBtn, tab === "rooms" && styles.segBtnActive]}
          onPress={() => setTab("rooms")}
        >
          <Text
            style={[styles.segText, tab === "rooms" && styles.segTextActive]}
          >
            AR rooms
          </Text>
        </Pressable>
      </View>

      {tab === "pieces" ? (
        savedItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Feather name="heart" size={32} color={palette.sage} />
            </View>
            <Text style={styles.emptyTitle}>No pieces yet</Text>
            <Text style={styles.emptySub}>
              Heart furniture from the catalogue or after a scan — they show up
              here for AR and checkout.
            </Text>
            <Link href="/(tabs)" asChild>
              <Pressable style={styles.primary}>
                <Text style={styles.primaryText}>Browse inspiration</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
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
        )
      ) : shots.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Feather name="camera" size={32} color={palette.sage} />
          </View>
          <Text style={styles.emptyTitle}>No AR rooms yet</Text>
          <Text style={styles.emptySub}>
            Place furniture in AR Studio, then tap Save to keep a snapshot of
            your room layout here.
          </Text>
          <Link href="/(tabs)/ar" asChild>
            <Pressable style={styles.primary}>
              <Text style={styles.primaryText}>Open AR studio</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <FlatList
          data={shots}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.roomsList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.roomCard}>
              <Image
                source={{ uri: item.uri }}
                style={styles.roomImage}
                resizeMode="cover"
              />
              <View style={styles.roomMeta}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roomTitle}>
                    {item.pieceCount}{" "}
                    {item.pieceCount === 1 ? "piece" : "pieces"}
                  </Text>
                  <Text style={styles.roomSub} numberOfLines={1}>
                    {item.pieceNames.join(" · ") || "AR capture"}
                  </Text>
                  <Text style={styles.roomDate}>
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={async () => {
                    try {
                      await remove(item.id);
                    } catch {
                      Toast.show({
                        type: "error",
                        text1: "Could not delete room",
                      });
                    }
                  }}
                  accessibilityLabel="Delete AR room"
                >
                  <Feather name="trash-2" size={16} color={palette.danger} />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  segment: {
    flexDirection: "row",
    marginHorizontal: space.md,
    marginBottom: space.sm,
    padding: 4,
    borderRadius: radius.full,
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    gap: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: "center",
  },
  segBtnActive: {
    backgroundColor: palette.text,
  },
  segText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    color: palette.textSecondary,
  },
  segTextActive: {
    color: palette.bg,
  },
  list: {
    paddingHorizontal: 6,
    paddingBottom: space.xl,
    paddingTop: space.sm,
  },
  roomsList: {
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
    gap: 14,
  },
  row: {
    gap: 0,
  },
  roomCard: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: palette.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderSubtle,
  },
  roomImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: palette.elevated,
  },
  roomMeta: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.md,
    paddingVertical: 12,
    gap: 12,
  },
  roomTitle: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 15,
    color: palette.text,
  },
  roomSub: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  roomDate: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    color: palette.textMuted,
    marginTop: 4,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.dangerBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(184, 58, 50, 0.28)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: space.lg,
    backgroundColor: palette.bg,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: space.lg,
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
