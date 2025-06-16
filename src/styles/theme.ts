import { useAppContext } from '../contexts/AppContext';

// Font weights
export const FONTS = {
  regular: {
    fontWeight: '400' as const,
  },
  medium: {
    fontWeight: '500' as const,
  },
  semiBold: {
    fontWeight: '600' as const,
  },
  bold: {
    fontWeight: '700' as const,
  },
};

// Sizes for consistent spacing and typography
export const SIZES = {
  // Font sizes
  xSmall: 10,
  small: 12,
  medium: 14,
  regular: 16,
  large: 18,
  xLarge: 20,
  xxLarge: 28,

  // Spacing
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },

  // Border radius
  radius: {
    s: 4, 
    m: 8,
    l: 12,
    xl: 16,
    round: 999,
  }
};

// Shadow styles
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const lightTheme = {
  colors: {
    background: '#F8F8F8',
    card: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    primary: '#0070FF',
    secondary: '#4CD964',
    border: '#EEEEEE',
    borderLight: '#F0F0F0',
    error: '#FF3B30',
    warning: '#FFCC00',
    success: '#4CD964',
    divider: '#E5E5E5',
    icon: '#8E8E93',
    purple: '#5856D6',
  },
  fonts: FONTS,
  sizes: SIZES,
  shadows: SHADOWS,
};

export const darkTheme = {
  colors: {
    background: '#121212',
    card: '#1E1E1E',
    text: '#F8F8F8',
    textSecondary: '#BBBBBB',
    textTertiary: '#888888',
    primary: '#0A84FF',
    secondary: '#30D158',
    border: '#2C2C2C',
    borderLight: '#2C2C2C',
    error: '#FF453A',
    warning: '#FFD60A',
    success: '#30D158',
    divider: '#2C2C2C',
    icon: '#AAAAAA',
    purple: '#5856D6',
  },
  fonts: FONTS,
  sizes: SIZES,
  shadows: SHADOWS,
};

export const useTheme = () => {
  const { isDarkMode } = useAppContext();
  return isDarkMode ? darkTheme : lightTheme;
};

export default useTheme; 