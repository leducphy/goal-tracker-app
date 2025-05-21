import { useAppContext } from '../contexts/AppContext';

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
  },
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
  },
};

export const useTheme = () => {
  const { isDarkMode } = useAppContext();
  return isDarkMode ? darkTheme : lightTheme;
};

export default useTheme; 