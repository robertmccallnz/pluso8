// lib/constants/styles.ts
export const COLORS = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
  },
};

export const SHADOWS = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
};

export const TRANSITIONS = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  medium: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
};

export const SPACING = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
};

export const LAYOUT = {
  container: {
    maxWidth: "80rem", // 1280px
    padding: {
      sm: SPACING[4],
      lg: SPACING[8],
    },
  },
  navbar: {
    height: "4rem", // 64px
  },
  sidebar: {
    width: "16rem", // 256px
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const COMPONENTS = {
  button: {
    base: "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    sizes: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
    variants: {
      primary: `bg-${COLORS.primary[600]} text-white hover:bg-${COLORS.primary[700]} focus:ring-${COLORS.primary[500]}`,
      secondary: `bg-white text-${COLORS.gray[700]} border border-${COLORS.gray[300]} hover:bg-${COLORS.gray[50]} focus:ring-${COLORS.primary[500]}`,
      ghost: `text-${COLORS.gray[600]} hover:bg-${COLORS.gray[100]} focus:ring-${COLORS.primary[500]}`,
    },
  },
  input: {
    base: `block w-full rounded-lg border border-${COLORS.gray[300]} focus:border-${COLORS.primary[500]} focus:ring-${COLORS.primary[500]} sm:text-sm`,
    sizes: {
      sm: "px-3 py-1.5",
      md: "px-4 py-2",
      lg: "px-6 py-3",
    },
  },
  card: {
    base: `bg-white rounded-lg shadow-${SHADOWS.sm} overflow-hidden`,
    hover: `hover:shadow-${SHADOWS.md} transition-shadow duration-${TRANSITIONS.medium}`,
  },
  navbar: {
    base: "bg-white border-b border-gray-200",
    link: {
      base: "inline-flex items-center px-4 py-2 text-sm font-medium transition-colors",
      active: `text-${COLORS.primary[600]} hover:text-${COLORS.primary[700]}`,
      inactive: `text-${COLORS.gray[600]} hover:text-${COLORS.gray[700]} hover:bg-${COLORS.gray[50]}`,
    },
  },
};