/**
 * INTERIO — slate + sage, editorial / spatial product UI.
 * Single source of truth for colors, type roles, radius, and spacing.
 */

export const palette = {
  bg: "#0a0c0f",
  bgMuted: "#0e1218",
  elevated: "#121820",
  surface: "#181f28",
  surface2: "#1e2732",
  border: "#2a3442",
  borderSubtle: "#222a35",
  text: "#eef2f7",
  textSecondary: "#9aa5b5",
  textMuted: "#6b7686",
  sage: "#7d9b84",
  sageDeep: "#5c7362",
  sageMuted: "rgba(125, 155, 132, 0.12)",
  sageBorder: "rgba(125, 155, 132, 0.35)",
  link: "#a3c4b8",
  linkHover: "#c5ddd4",
  ice: "#b8d4e8",
  danger: "#d48484",
  dangerBg: "rgba(212, 132, 132, 0.12)",
  infoBg: "#141c24",
  infoBorder: "#2f3c4a",
  overlay: "rgba(8, 10, 13, 0.92)",
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
