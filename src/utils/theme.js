const theme = {
  // Colors
  navy: "#030a10",
  navyLight: "#0a1628",
  navyMid: "#0f2040",
  teal: "#35d0b2",
  tealLight: "#e6faf7",
  tealDark: "#28a899",
  white: "#ffffff",
  gray: "#333333",
  grayLight: "#64748b",
  grayMuted: "#94a3b8",
  border: "#1a2f4a",
  borderLight: "#e2e8f0",
  cardBg: "#0a1628",
  pageBg: "#030a10",

  // Font sizes - use these everywhere, no random sizes
  fontSize: {
    xs: 11,     // hints, tags, badges, timestamps
    sm: 13,     // body text, labels, descriptions
    md: 15,     // card titles, button text
    lg: 18,     // hero description, important text
    xl: 24,     // section titles
    xxl: 32,    // page titles
    hero: "clamp(36px, 5vw, 64px)", // hero headings only
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line heights
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 100,
  },

  // Shadows
  shadow: {
    sm: "0 2px 8px rgba(0,0,0,0.04)",
    md: "0 4px 16px rgba(0,0,0,0.08)",
    lg: "0 8px 32px rgba(0,0,0,0.12)",
  },

  // Spacing
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64,
  },
};

export default theme;