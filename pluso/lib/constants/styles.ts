// lib/constants/styles.ts
export const COLORS = {
  brand: {
    blue: '#1E88E5',
    cyan: '#00ACC1',
    orange: '#FF6B00'
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    tertiary: '#717171'
  },
  background: {
    primary: '#F5F5F5',
    secondary: '#E5E5E5'
  }
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    base: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  }
} as const;

export const COMPONENT_CLASSES = {
  logo: {
    prefix: 'font-mono text-pluso-blue font-normal',
    suffix: 'font-mono text-pluso-cyan font-bold'
  },
  buttons: {
    primary: 'bg-pluso-blue hover:bg-pluso-blue-hover text-white rounded-lg',
    secondary: 'bg-pluso-cyan hover:bg-pluso-cyan-hover text-white rounded-lg'
  },
  cards: {
    base: 'bg-white rounded-lg shadow-sm'
  }
} as const;

export const LEGACY_COLORS = {
  blue: '#1E88E5',
  cyan: '#00ACC1',
  charcoal: '#2A2A2A',
  charcoalLight: '#4A4A4A',
  charcoalLighter: '#6A6A6A',
  offwhite: '#F5F5F5'
} as const;