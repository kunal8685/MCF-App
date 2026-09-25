import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Grievance Orange Palette (from sanitary-monitoring-system-mobile)
    primary: '#F59019',
    primaryDark: '#D97706',
    primaryLight: '#FFF7ED',
    primary600: '#F47A29',
    primary100: '#FED7AA',
    primary50: '#FFFBF5',

    secondary: '#F4B740',
    accent: '#22A699',
    
    // Status colors
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    danger: '#EF4444',
    dangerLight: '#FEF2F2',
    error: '#EF4444',
    info: '#3B82F6',
    infoLight: '#EFF6FF',

    // Surfaces & background
    background: '#F7F7FB',
    surface: '#FFFFFF',
    surface2: '#F8FAFC',
    card: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',

    // Text & borders
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textLight: '#FFFFFF',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#E2E8F0',
  },
  dark: {
    primary: '#F59019',
    primaryDark: '#D97706',
    primaryLight: '#2A2016',
    primary600: '#F47A29',
    primary100: '#4D3017',
    primary50: '#1C1510',

    secondary: '#F4B740',
    accent: '#22A699',

    success: '#10B981',
    successLight: '#064E3B',
    warning: '#F59E0B',
    warningLight: '#78350F',
    danger: '#EF4444',
    dangerLight: '#7F1D1D',
    error: '#EF4444',
    info: '#3B82F6',
    infoLight: '#1E3A8A',

    background: '#0F172A',
    surface: '#1E293B',
    surface2: '#334155',
    card: '#1E293B',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',

    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textLight: '#FFFFFF',
    border: '#334155',
    borderLight: '#1E293B',
    divider: '#334155',
  },
} as const;

export type ThemeColors = typeof Colors.light;
export type ThemeColor = keyof typeof Colors.light;

export const Typography = {
  display: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  h1: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  small: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500' as const,
  },
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
  card: 16,
  sheet: 24,
  input: 12,
  button: 12,
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Shadow = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier New',
  },
  default: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'sans-serif-medium',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});
