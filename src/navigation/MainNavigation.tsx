import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '../constants/ROUTES';
import useTranslation from '../i18n';
import GoalsScreen from '../screens/goals/Index';
import OverviewScreen from '../screens/overview';
import ProfileScreen from '../screens/profile/Index';
import useTheme from '../styles/theme';
import FinanceNavigation from './FinanceNavigation';

type IconName = keyof typeof Ionicons.glyphMap;

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName = 'home';

          if (route.name === ROUTES.OVERVIEW) {
            iconName = 'compass';
          } else if (route.name === ROUTES.GOALS) {
            iconName = 'trophy';
          } else if (route.name === ROUTES.FINANCE) {
            iconName = 'cash';
          } else if (route.name === ROUTES.PROFILE) {
            iconName = 'person';
          }

          return (
            <View style={[styles.iconContainer, focused ? styles.iconActive : null]}>
              <Ionicons 
                name={iconName} 
                size={focused ? 30 : 24} 
                color={color} 
              />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
          let label = '';
          if (route.name === ROUTES.OVERVIEW) {
            label = t('overview');
          } else if (route.name === ROUTES.GOALS) {
            label = t('goals');
          } else if (route.name === ROUTES.FINANCE) {
            label = t('finance');
          } else if (route.name === ROUTES.PROFILE) {
            label = t('profile');
          }
          
          return (
            <Text style={[styles.tabBarLabel, { color }]}>
              {label}
            </Text>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.icon,
        tabBarStyle: {
          height: 55 + insets.bottom,
          position: 'absolute',
          bottom: 0,
          paddingTop: 10,
          paddingBottom: insets.bottom,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 10,
          backgroundColor: theme.colors.card,
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name={ROUTES.OVERVIEW} 
        component={OverviewScreen} 
      />
      <Tab.Screen 
        name={ROUTES.GOALS} 
        component={GoalsScreen} 
      />
      <Tab.Screen 
        name={ROUTES.FINANCE} 
        component={FinanceNavigation} 
      />
      <Tab.Screen 
        name={ROUTES.PROFILE} 
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    padding: 0,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  iconActive: {
    backgroundColor: 'rgba(0, 112, 255, 0.1)',
    width: 50,
    height: 50,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  }
});

export default MainNavigation; 