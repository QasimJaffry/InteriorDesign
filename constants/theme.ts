/**
 * INTERIO — clean white + rich violet, editorial light UI.
 * Single source of truth for colors, type roles, radius, and spacing.
 */

export const palette = {
  // ── Backgrounds — pure white ────────────────────────────────────────────────
  bg: "#ffffff",
  bgMuted: "#f7f8fc",
  elevated: "#f2f3f9",
  surface: "#eef0f8",
  surface2: "#e4e7f2",
  border: "#d8dced",
  borderSubtle: "#e8eaf5",

  // ── Text — deep charcoal-navy ───────────────────────────────────────────────
  text: "#0e1020",
  textSecondary: "#4a5270",
  textMuted: "#8890b0",

  // ── Primary accent — rich indigo-violet ─────────────────────────────────────
  sage: "#5c51e0",
  sageDeep: "#4339bc",
  sageMuted: "rgba(92, 81, 224, 0.10)",
  sageBorder: "rgba(92, 81, 224, 0.24)",

  // ── Links ───────────────────────────────────────────────────────────────────
  link: "#5c51e0",
  linkHover: "#4339bc",

  // ── Secondary accent — teal ─────────────────────────────────────────────────
  ice: "#2ab5aa",

  // ── Danger ──────────────────────────────────────────────────────────────────
  danger: "#d43838",
  dangerBg: "rgba(212, 56, 56, 0.08)",

  // ── Info / banners ──────────────────────────────────────────────────────────
  infoBg: "#f0f2fa",
  infoBorder: "#d8dced",

  // ── Utilities ───────────────────────────────────────────────────────────────
  overlay: "rgba(14, 16, 32, 0.85)",
  black: "#000000",
  white: "#ffffff",
} as const;

/** Loaded via expo-google-fonts — keys must match useFonts map. */
export const fontFamily = {
  displayMedium: "CormorantGaramond_500Medium",
  displaySemibold: "CormorantGaramond_600SemiBold",
  displayBold: "CormorantGaramond_700Bold",
  sans: "PlusJakartaSans_400Regular",
  sansMedium: "PlusJakartaSans_500Medium",
  sansSemiBold: "PlusJakartaSans_600SemiBold",
  sansBold: "PlusJakartaSans_700Bold",
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const theme = {
  color: palette,
  font: fontFamily,
  radius,
  space,
} as const;

export type Theme = typeof theme;
