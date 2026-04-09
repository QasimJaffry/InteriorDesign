import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { signIn, busy } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch {
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2: "Check your email and password.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>INTERIO</Text>
        <Text style={styles.sub}>Welcome back</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#667"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#667"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          style={[styles.primary, busy && styles.disabled]}
          onPress={onSubmit}
          disabled={busy}
        >
          <Text style={styles.primaryText}>Sign in</Text>
        </Pressable>
        <Link href="/forgot-password" asChild>
          <Pressable>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>
        </Link>
        <Link href="/signup" asChild>
          <Pressable style={styles.row}>
            <Text style={styles.muted}>No account? </Text>
            <Text style={styles.link}>Sign up</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f12",
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#eef2f6",
    letterSpacing: 2,
  },
  sub: {
    fontSize: 16,
    color: "#889",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#1a1a20",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#eef2f6",
    borderWidth: 1,
    borderColor: "#2e2e38",
  },
  primary: {
    backgroundColor: "#c45c5c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
  link: {
    color: "#8ab4ff",
    fontSize: 15,
    marginTop: 4,
  },
  muted: {
    color: "#889",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    marginTop: 16,
  },
});
