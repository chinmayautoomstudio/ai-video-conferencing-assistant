import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3b82f6',
    primaryContainer: '#dbeafe',
    secondary: '#6b7280',
    secondaryContainer: '#f3f4f6',
    surface: '#ffffff',
    surfaceVariant: '#f9fafb',
    background: '#f9fafb',
    error: '#ef4444',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#111827',
    onBackground: '#111827',
    onError: '#ffffff',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60a5fa',
    primaryContainer: '#1e40af',
    secondary: '#9ca3af',
    secondaryContainer: '#374151',
    surface: '#1f2937',
    surfaceVariant: '#374151',
    background: '#111827',
    error: '#f87171',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onSurface: '#f9fafb',
    onBackground: '#f9fafb',
    onError: '#000000',
  },
};

export const theme = lightTheme;
