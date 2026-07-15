import Feather from "@expo/vector-icons/Feather";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { FavouritesSync } from "@/components/FavouritesSync";
import { useAuthSession } from "@/contexts/AuthContext";
import { fontFamily, palette, radius } from "@/constants/theme";

function ScanFAB({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.scanFab, focused && styles.scanFabActive]}>
      {/* Always light icon — FAB fill is charcoal/sage, never cream */}
      <Feather name="camera" size={22} color={palette.white} />
    </View>
  );
}

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
      {focused ? (
        <View style={styles.activeIndicator} />
      ) : (
        <View style={styles.activeSpacer} />
      )}
      <Feather name={name} size={20} color={color} />
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
          headerShown: false,
          tabBarActiveTintColor: palette.sageDeep,
          tabBarInactiveTintColor: palette.textMuted,
          tabBarStyle: {
            backgroundColor: palette.elevated,
            borderTopColor: palette.borderSubtle,
            borderTopWidth: StyleSheet.hairlineWidth,
            height: 72,
            paddingBottom: 12,
            paddingTop: 6,
            shadowColor: "#1c1916",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 6,
          },
          tabBarLabelStyle: {
            fontFamily: fontFamily.sansMedium,
            fontSize: 10,
            letterSpacing: 0.3,
            marginTop: 2,
          },
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
            // Let the live camera own the vertical budget
            tabBarStyle: { display: "none" },
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

  tabIconWrap: {
    alignItems: "center",
    gap: 3,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.sage,
  },
  activeSpacer: {
    width: 4,
    height: 4,
  },

  scanFab: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: palette.text,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
    shadowColor: "#1c1916",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  scanFabActive: {
    backgroundColor: palette.sageDeep,
  },
});
