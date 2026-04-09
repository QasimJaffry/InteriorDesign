import { Link } from "expo-router";
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

export default function ForgotPasswordScreen() {
  const { resetPassword, busy } = useAuth();
  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    try {
      await resetPassword(email);
      Toast.show({
        type: "success",
        text1: "Email sent",
        text2: "Check your inbox for reset instructions.",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Request failed",
        text2: "Could not send reset email.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.hint}>
          Enter your account email and we will send a password reset link.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#667"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Pressable
          style={[styles.primary, busy && styles.disabled]}
          onPress={onSubmit}
          disabled={busy}
        >
          <Text style={styles.primaryText}>Send reset email</Text>
        </Pressable>
        <Link href="/login" asChild>
          <Pressable style={styles.row}>
            <Text style={styles.link}>Back to sign in</Text>
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
    gap: 12,
  },
  hint: {
    color: "#aab",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
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
    marginTop: 16,
  },
  row: {
    marginTop: 8,
  },
});
