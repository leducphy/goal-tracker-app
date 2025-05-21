import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ROUTES } from './constants/routes';
import { AppProvider, useAppContext } from './contexts/AppContext';
import useTranslation from './i18n';
import MainNavigation from './navigation/MainNavigation';
import LoginScreen from './screens/auth';
import CheckInScreen from './screens/checkin';
import AchievementsScreen from './screens/goals/achievements';
import CreateGoalScreen from './screens/goals/create';
import GoalGroupsScreen from './screens/goals/groups';
import LongTermGoalsScreen from './screens/goals/longterm';
import SettingsScreen from './screens/profile/settings';
import StatsScreen from './screens/stats';

export type RootStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.MAIN]: undefined;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.CHECK_IN]: undefined;
  [ROUTES.STATS]: undefined;
  [ROUTES.LONG_TERM_GOALS]: undefined;
  [ROUTES.GOAL_GROUPS]: undefined;
  [ROUTES.ACHIEVEMENTS]: undefined;
  [ROUTES.CREATE_GOAL]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { isDarkMode } = useAppContext();
  const { t } = useTranslation();
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <Stack.Navigator 
          initialRouteName={ROUTES.LOGIN}
          screenOptions={{ 
            headerShown: false,
          }}
        >
          <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
          <Stack.Screen name={ROUTES.MAIN} component={MainNavigation} />
          <Stack.Screen 
            name={ROUTES.SETTINGS} 
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: t('settings'),
              headerBackTitle: t('back'),
            }}  
          />
          <Stack.Screen name={ROUTES.CHECK_IN} component={CheckInScreen} />
          <Stack.Screen name={ROUTES.STATS} component={StatsScreen} />
          <Stack.Screen name={ROUTES.LONG_TERM_GOALS} component={LongTermGoalsScreen} />
          <Stack.Screen name={ROUTES.GOAL_GROUPS} component={GoalGroupsScreen} />
          <Stack.Screen name={ROUTES.ACHIEVEMENTS} component={AchievementsScreen} />
          <Stack.Screen name={ROUTES.CREATE_GOAL} component={CreateGoalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 