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
import { fontFamily, palette, radius, space } from "@/constants/theme";

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
          placeholderTextColor={palette.textMuted}
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
    backgroundColor: palette.bg,
  },
  inner: {
    flex: 1,
    padding: space.lg,
    gap: space.sm,
  },
  hint: {
    fontFamily: fontFamily.sans,
    color: palette.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: space.sm,
  },
  input: {
    fontFamily: fontFamily.sans,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    padding: space.md,
    fontSize: 16,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
  },
  primary: {
    backgroundColor: palette.sage,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: space.sm,
  },
  primaryText: {
    fontFamily: fontFamily.sansSemiBold,
    color: palette.bg,
    fontSize: 17,
  },
  disabled: {
    opacity: 0.55,
  },
  link: {
    fontFamily: fontFamily.sansMedium,
    color: palette.link,
    fontSize: 15,
    marginTop: space.md,
  },
  row: {
    marginTop: space.xs,
  },
});
