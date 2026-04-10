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
import { fontFamily, palette, radius, space } from "@/constants/theme";

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
        <Text style={styles.lead}>
          Create a profile to sync saved pieces and scans across devices.
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={palette.textMuted}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={palette.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password (6+ characters)"
          placeholderTextColor={palette.textMuted}
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
    backgroundColor: palette.bg,
  },
  inner: {
    flex: 1,
    padding: space.lg,
    paddingTop: space.md,
    gap: space.xs,
  },
  lead: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 22,
    color: palette.textSecondary,
    marginBottom: space.md,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    color: palette.textMuted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: space.sm,
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
    marginTop: space.lg,
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
    fontFamily: fontFamily.sansSemiBold,
    color: palette.link,
    fontSize: 15,
  },
  muted: {
    fontFamily: fontFamily.sans,
    color: palette.textMuted,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    marginTop: space.md,
  },
});
