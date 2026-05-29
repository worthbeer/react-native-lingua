export const colors = {
  // Primary
  linguaPurple: "#6C4EF5",
  linguaDeepPurple: "#5B38F6",
  linguaBlue: "#4D88FF",
  linguaGreen: "#21C16B",

  // Semantic
  success: "#21C16B",
  warning: "#FFCB00",
  streak: "#FF8A00",
  error: "#FF4D4F",
  info: "#4D88FF",

  // Neutrals
  textPrimary: "#001132",
  textSecondary: "#6B7280",
  textPlaceholder: "#9CA3AF",
  border: "#E5E7EB",
  surface: "#F6F7FB",
  background: "#FFFFFF",
} as const;

export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

// Raw pixel values — use in StyleSheet where NativeWind classes cannot be applied
export const fontSize = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 13,
  caption: 11,
} as const;

export const lineHeight = {
  h1: 38, // 32 * 1.2
  h2: 31, // 24 * 1.3
  h3: 26, // 20 * 1.3
  h4: 22, // 16 * 1.4
  bodyLarge: 26, // 16 * 1.6
  bodyMedium: 22, // 14 * 1.6
  bodySmall: 21, // 13 * 1.6
  caption: 15, // 11 * 1.4
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;
