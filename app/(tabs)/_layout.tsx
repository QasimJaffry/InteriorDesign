import Feather from "@expo/vector-icons/Feather";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { FavouritesSync } from "@/components/FavouritesSync";
import { useAuthSession } from "@/contexts/AuthContext";
import { fontFamily, palette, radius } from "@/constants/theme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

/** Elevated circular FAB for the centre Scan tab. */
function ScanFAB({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.scanFab, focused && styles.scanFabActive]}>
      {/* Inner glow ring when active */}
      {focused && <View style={styles.scanFabGlow} />}
      <Feather
        name="camera"
        size={22}
        color={focused ? palette.white : palette.textSecondary}
      />
    </View>
  );
}

/** Small active-indicator dot shown above the label. */
function TabIcon({
  name,
  color,
  focused,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIconWrap}>
      {focused && <View style={styles.activeIndicator} />}
      <Feather name={name} size={21} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const { user, initializing } = useAuthSession();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.sage} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <FavouritesSync />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: palette.sage,
          tabBarInactiveTintColor: palette.textMuted,
          tabBarStyle: {
            backgroundColor: palette.elevated,
            borderTopColor: palette.border,
            borderTopWidth: StyleSheet.hairlineWidth,
            height: 74,
            paddingBottom: 14,
            paddingTop: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 20,
          },
          tabBarLabelStyle: {
            fontFamily: fontFamily.sansMedium,
            fontSize: 10,
            letterSpacing: 0.4,
            marginTop: 1,
          },
          headerStyle: {
            backgroundColor: palette.bg,
            shadowOpacity: 0,
            elevation: 0,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: palette.border,
          },
          headerTitleStyle: {
            fontFamily: fontFamily.displaySemibold,
            fontSize: 20,
            color: palette.text,
            letterSpacing: 1,
          },
          headerTintColor: palette.link,
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="home" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="heart" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: "",
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => <ScanFAB focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="ar"
          options={{
            title: "AR",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="box" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="user" color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bg,
  },

  // Active indicator dot above icon
  tabIconWrap: {
    alignItems: "center",
    gap: 3,
  },
  activeIndicator: {
    position: "absolute",
    top: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.sage,
  },

  // Scan FAB
  scanFab: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: palette.surface2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
    borderWidth: 2.5,
    borderColor: palette.elevated,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 12,
  },
  scanFabActive: {
    backgroundColor: palette.sage,
    borderColor: palette.sageDeep,
    shadowColor: palette.sage,
    shadowOpacity: 0.5,
  },
  scanFabGlow: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.sage,
    opacity: 0.25,
    transform: [{ scale: 1.3 }],
  },
});
