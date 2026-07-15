/**
 * INTERIO — warm plaster / linen surfaces + olive accent from the app icon.
 * Editorial interior studio: imagery leads, chrome stays quiet.
 */

export const palette = {
  // ── Backgrounds — warm plaster & linen ─────────────────────────────────────
  bg: "#faf8f4",
  bgMuted: "#f3efe8",
  elevated: "#ffffff",
  surface: "#f0ebe3",
  surface2: "#e8e2d8",
  border: "#ddd5c8",
  borderSubtle: "#ebe6dc",

  // ── Text — warm charcoal ────────────────────────────────────────────────────
  text: "#1c1916",
  textSecondary: "#5c564e",
  textMuted: "#9a9288",

  // ── Primary accent — olive from app icon ───────────────────────────────────
  sage: "#7d8b6a",
  sageDeep: "#4f5843",
  sageMuted: "rgba(125, 139, 106, 0.14)",
  sageBorder: "rgba(125, 139, 106, 0.35)",

  // ── Links ──────────────────────────────────────────────────────────────────
  link: "#7d8b6a",
  linkHover: "#4f5843",

  // ── Secondary accent — soft moss ───────────────────────────────────────────
  ice: "#a3ad90",

  // ── Danger ─────────────────────────────────────────────────────────────────
  danger: "#b83a32",
  dangerBg: "rgba(184, 58, 50, 0.08)",

  // ── Info / banners ─────────────────────────────────────────────────────────
  infoBg: "#f3efe8",
  infoBorder: "#ddd5c8",

  // ── Utilities ──────────────────────────────────────────────────────────────
  overlay: "rgba(28, 25, 22, 0.72)",
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
