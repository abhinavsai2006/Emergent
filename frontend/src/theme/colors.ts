/**
 * Premium Color System
 * Designed for Apple-level visual polish
 * Supports both light and dark modes
 */

export const colors = {
  // Primary brand colors - Warm orange for food/appetite appeal
  primary: {
    50: '#FFF8F0',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main primary
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  
  // Neutral grays - Carefully calibrated for readability
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  
  // Semantic colors
  success: {
    light: '#DCFCE7',
    main: '#22C55E',
    dark: '#16A34A',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#DC2626',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#2563EB',
  },
};

// Light theme semantic tokens
export const lightTheme = {
  background: {
    primary: colors.neutral[0],
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100],
    elevated: colors.neutral[0],
  },
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[400],
    inverse: colors.neutral[0],
  },
  border: {
    light: colors.neutral[200],
    default: colors.neutral[300],
    strong: colors.neutral[400],
  },
  surface: {
    card: colors.neutral[0],
    modal: colors.neutral[0],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  accent: colors.primary[500],
  accentLight: colors.primary[50],
};

// Dark theme semantic tokens
export const darkTheme = {
  background: {
    primary: colors.neutral[950],
    secondary: colors.neutral[900],
    tertiary: colors.neutral[800],
    elevated: colors.neutral[800],
  },
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[400],
    tertiary: colors.neutral[500],
    inverse: colors.neutral[900],
  },
  border: {
    light: colors.neutral[800],
    default: colors.neutral[700],
    strong: colors.neutral[600],
  },
  surface: {
    card: colors.neutral[900],
    modal: colors.neutral[800],
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  accent: colors.primary[500],
  accentLight: colors.primary[900],
};

export type Theme = typeof lightTheme;
