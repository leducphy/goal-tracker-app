import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Platform, Text, Animated, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CurvedTabBar from 'react-native-curved-tab-bar';

import { ROUTES } from '../constants/ROUTES';
import { useAppContext } from '../contexts/AppContext';
import useTranslation from '../i18n';

import LongTermScreen from '../screens/goals/LongTerm';
import OverviewScreen from '../screens/overview/Index';
import ProfileScreen from '../screens/profile/Index';
import SocialScreen from '../screens/social/Index';
import useTheme from '../styles/theme';
import FinanceNavigation from './FinanceNavigation';

// Tạo một context toàn cục để theo dõi trạng thái scroll
export const ScrollContext = React.createContext({
  scrollY: new Animated.Value(0),
  setScrolling: (isScrolling: boolean) => {},
});

// Kích thước của bottom bar
const BOTTOM_BAR_HEIGHT = 70;

interface TabItem {
  key: string;
  label: string;
  icon: any;
  badgeCount?: number;
}

const MainNavigation = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const theme = useTheme();
  const { isDarkMode } = useAppContext();
  
  const [activeTab, setActiveTab] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Animation cho bottom bar
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Tính toán vị trí của bottom bar dựa trên scrollY
  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, BOTTOM_BAR_HEIGHT + insets.bottom],
    extrapolate: 'clamp',
  });
  
  // Animation for smooth tab transitions
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.7, // Tăng giá trị opacity tối thiểu để giảm hiệu ứng nháy
      duration: 100, // Giảm thời gian để animation mượt hơn
      useNativeDriver: true,
    }).start();
  };
  
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150, // Giảm thời gian để animation nhanh hơn
      useNativeDriver: true,
    }).start();
  };
  
  // Function để xử lý sự kiện scroll
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );
  
  // Define tabs using PNG icons
  const tabs: TabItem[] = [
    {
      key: ROUTES.OVERVIEW,
      label: t('overview'),
      icon: require('../assets/images/icon-bottom-tab/home.png'),
    },
    {
      key: ROUTES.LONG_TERM,
      label: t('goals'),
      icon: require('../assets/images/icon-bottom-tab/target.png'),
    },
    {
      key: ROUTES.FINANCE,
      label: t('finance'),
      icon: require('../assets/images/icon-bottom-tab/repeat.png'),
    },
    {
      key: ROUTES.SOCIAL,
      label: t('social'),
      icon: require('../assets/images/icon-bottom-tab/users.png'),
    },
    {
      key: ROUTES.PROFILE,
      label: t('profile'),
      icon: require('../assets/images/icon-bottom-tab/settings.png'),
    },
  ];

  const handleTabPress = (index: number, tab: TabItem) => {
    // Hiển thị lại bottom bar khi chuyển tab
    Animated.spring(scrollY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    
    if (activeTab !== index) {
      fadeOut();
      setTimeout(() => {
        setActiveTab(index);
        fadeIn();
      }, 50); // Giảm thời gian chờ để chuyển tab nhanh hơn
    }
    
    // Navigate to the appropriate screen based on tab key
    switch (tab.key) {
      case ROUTES.OVERVIEW:
        // Handle Home tab navigation
        break;
      case ROUTES.LONG_TERM:
        // Handle Goals tab navigation
        break;
      case ROUTES.FINANCE:
        // Handle Finance tab navigation
        break;
      case ROUTES.SOCIAL:
        // Handle Social tab navigation
        break;
      case ROUTES.PROFILE:
        // Handle Profile tab navigation
        break;
    }
  };

  // Modern and brighter gradient colors
  const gradientColors = isDarkMode 
    ? ['#4F46E5', '#7C3AED'] // Vibrant indigo to violet for dark mode
    : ['#0EA5E9', '#6366F1']; // Bright sky blue to indigo for light mode

  return (
    <ScrollContext.Provider value={{ scrollY, setScrolling: setIsScrolling }}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Animated.View style={[
          { flex: 1, opacity: fadeAnim },
          { backgroundColor: theme.colors.background } // Thêm background color để tránh nháy trắng
        ]}>
          {activeTab === 0 && <OverviewScreen />}
          {activeTab === 1 && <LongTermScreen />}
          {activeTab === 2 && <FinanceNavigation />}
          {activeTab === 3 && <SocialScreen />}
          {activeTab === 4 && <ProfileScreen />}
        </Animated.View>
        
        {/* Bottom Bar với animation */}
        <Animated.View 
          style={[
            styles.bottomBarContainer,
            { transform: [{ translateY }] }
          ]}
        >
          {/* @ts-ignore */}
          <CurvedTabBar
            tabs={tabs}
            activeIndex={activeTab}
            onTabPress={handleTabPress}
            gradientColors={gradientColors}
            heightPercentage={10}
            floatingButtonSize={7}
            shadowConfig={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 12,
            }}
          />
        </Animated.View>
      </View>
    </ScrollContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 13,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  }
});

export default MainNavigation; 