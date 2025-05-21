// Theme colors and styles constants

export const COLORS = {
  primary: '#0070FF',
  secondary: '#FF9500',
  success: '#4CD964',
  danger: '#FF3B30',
  warning: '#FFCC00',
  purple: '#5856D6',
  
  background: '#F8F8F8',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#EEEEEE',
  divider: '#F0F0F0',
};

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

// Default theme object
export default {
  colors: COLORS,
  fonts: FONTS,
  sizes: SIZES,
  shadows: SHADOWS,
}; 