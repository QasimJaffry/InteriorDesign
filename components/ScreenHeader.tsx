import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Pressable,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";

import { fontFamily, palette, space } from "@/constants/theme";

type Props = {
  title: string;
  subtitle?: string;
  /** Quiet trailing meta, e.g. "6 pieces" */
  trailing?: string;
  /** Hide bottom hairline */
  borderless?: boolean;
  /** Optional back — only when screen isn't a tab root */
  showBack?: boolean;
  /** Tighter chrome — use when a viewport (e.g. camera) needs the vertical budget */
  compact?: boolean;
};

/**
 * Editorial in-content header — replaces stock React Navigation chrome.
 * Sits flush under a light status bar; title uses display serif.
 */
export function ScreenHeader({
  title,
  subtitle,
  trailing,
  borderless = false,
  showBack = false,
  compact = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Xiaomi / MIUI often under-reports safe-area top. Stack every known signal
  // and keep a hard floor so header copy never rides under system icons.
  const statusClearance = Math.max(
    insets.top,
    RNStatusBar.currentHeight ?? 0,
    48,
  );

  return (
    <View
      style={[
        styles.wrap,
        compact && styles.wrapCompact,
        { paddingTop: statusClearance + (compact ? 12 : 16) },
        !borderless && styles.border,
      ]}
    >
      <StatusBar style="dark" backgroundColor={palette.bg} />
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <Feather name="arrow-left" size={20} color={palette.text} />
          </Pressable>
        ) : null}

        <View style={styles.copy}>
          {subtitle ? (
            <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
              {subtitle}
            </Text>
          ) : null}
          <Text
            style={[styles.title, compact && styles.titleCompact]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {trailing ? (
          <Text style={styles.trailing} numberOfLines={1}>
            {trailing}
          </Text>
        ) : (
          <View style={styles.trailingSpacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: palette.bg,
    paddingHorizontal: space.md + 4,
    paddingBottom: 16,
  },
  wrapCompact: {
    paddingBottom: 10,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderSubtle,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surface,
    marginBottom: 2,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  subtitle: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: palette.sageDeep,
    marginBottom: 6,
  },
  subtitleCompact: {
    marginBottom: 3,
  },
  title: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.7,
    color: palette.text,
  },
  titleCompact: {
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  trailing: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    color: palette.textMuted,
    marginBottom: 8,
  },
  trailingSpacer: {
    width: 8,
  },
});
