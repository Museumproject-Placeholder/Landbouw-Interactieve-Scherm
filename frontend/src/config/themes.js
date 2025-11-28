/**
 * Theme Configuration System
 *
 * Only museum theme available (modern theme removed)
 */

// Always use museum theme
export const ACTIVE_THEME = "museum"

// Museum's official color palette - Exact colors from museum brand
const MUSEUM_COLORS = {
  // Primary colors
  linen: "#f3f2e9", // Cream/off-white - main background
  slate: "#657575", // Gray - main text, inactive elements
  mist: "#a7b8b4", // Muted blue-green - inactive elements, backgrounds
  sky: "#b5cbd1", // Light blue-gray - accents, backgrounds
  olive: "#929d7c", // Olive green - accents, backgrounds

  // Accent colors (warm tones)
  gold: "#c9a300", // Bright gold - main accent, interactive elements
  amber: "#b48a0f", // Bronze gold - hover states, gradients
  terracotta: "#ae5514", // Copper/burnt orange - main accent, interactive
  rust: "#89350a", // Rust orange - hover states, gradients

  // Dark colors
  maroon: "#440f0f", // Dark red/burgundy - headers, text on light background
}

// Museum theme - Using exact museum brand colors
const MUSEUM_THEME = {
  name: "museum",

  // Backgrounds - museum palette
  background: {
    primary: "from-[#440f0f]/30 via-[#89350a]/25 to-[#ae5514]/20", // Maroon → Rust → Terracotta (reduced opacity)
    overlay: "from-[#440f0f]/15 via-transparent to-[#657575]/10", // Maroon → Slate (reduced opacity)
    card: "bg-[#f3f2e9]", // Linen (cream)
    modal:
      "bg-gradient-to-br from-[#440f0f]/98 via-[#89350a]/95 to-[#ae5514]/98", // Deep maroon → rust → terracotta
    modalLight: "bg-[#f3f2e9]", // Linen for left panel
  },

  // Text colors
  text: {
    primary: "text-white", // For dark backgrounds
    secondary: "text-white/85", // Secondary text on dark
    accent: "text-[#c9a300]", // Gold accent
    gradient: "from-[#c9a300] via-[#b48a0f] to-[#ae5514]", // Gold → Amber → Terracotta
    dark: "text-[#440f0f]", // Maroon for headers on light background
    darkSecondary: "text-[#657575]", // Slate for secondary text on light
  },

  // Buttons & Interactive
  button: {
    primary:
      "from-[#c9a300] to-[#ae5514] hover:from-[#b48a0f] hover:to-[#89350a]", // Gold → Terracotta, hover: Amber → Rust
    secondary: "bg-[#657575]/90 hover:bg-[#440f0f]", // Slate → Maroon
  },

  // Timeline cards
  timeline: {
    cardBg: "bg-[#f3f2e9]/95", // Linen with slight transparency
    cardBorder: "border-[#a7b8b4]/60", // Mist border
    cardHover: "hover:border-[#c9a300] hover:shadow-[#c9a300]/20", // Gold border and shadow
    line: "from-[#c9a300] via-[#b48a0f] to-[#ae5514]", // Gold → Amber → Terracotta
  },

  // Virtual Guide
  guide: {
    avatarGradient: "from-[#c9a300] via-[#ae5514] to-[#89350a]", // Gold → Terracotta → Rust
    bubbleBg: "bg-[#f3f2e9]", // Linen
    bubbleBorder: "border-[#c9a300]", // Gold
    bubbleText: "text-[#440f0f]", // Maroon for readability
  },

  // Borders & Accents
  border: "border-[#a7b8b4]/50", // Mist border
  accent: "[#c9a300]", // Gold

  // Raw colors for special cases
  colors: {
    primary: MUSEUM_COLORS.gold, // #c9a300
    secondary: MUSEUM_COLORS.terracotta, // #ae5514
    tertiary: MUSEUM_COLORS.rust, // #89350a
    background: MUSEUM_COLORS.linen, // #f3f2e9
    text: MUSEUM_COLORS.maroon, // #440f0f
    muted: MUSEUM_COLORS.slate, // #657575
  },
}

/**
 * Get active theme - always returns museum theme
 */
export const getTheme = () => {
  return MUSEUM_THEME
}

/**
 * Get current theme name
 */
export const getCurrentThemeName = () => {
  return "museum"
}

// Export themes for direct access if needed
export const themes = {
  museum: MUSEUM_THEME,
}

// Export museum colors for reference
export { MUSEUM_COLORS }
