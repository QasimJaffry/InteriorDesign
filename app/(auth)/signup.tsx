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

export default function SignupScreen() {
  const { signUp, busy } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await signUp(name, email, password);
      Toast.show({
        type: "success",
        text1: "Account created",
        text2: "We sent a verification email. You can sign in now.",
      });
      router.replace("/login");
    } catch {
      Toast.show({
        type: "error",
        text1: "Sign up failed",
        text2: "Try a different email or stronger password.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#667"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#667"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password (6+ characters)"
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
          <Text style={styles.primaryText}>Create account</Text>
        </Pressable>
        <Link href="/login" asChild>
          <Pressable style={styles.row}>
            <Text style={styles.muted}>Already have an account? </Text>
            <Text style={styles.link}>Sign in</Text>
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
    paddingTop: 16,
    gap: 8,
  },
  label: {
    color: "#aab",
    fontSize: 13,
    marginTop: 8,
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
    marginTop: 16,
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
