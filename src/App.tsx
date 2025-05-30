import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ROUTES } from './constants/routes';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import useTranslation from './i18n';
import MainNavigation from './navigation/MainNavigation';
import LoginScreen from './screens/auth';
import CheckInScreen from './screens/checkin';
import AchievementsScreen from './screens/goals/achievements';
import CreateGoalScreen from './screens/goals/create';
import GoalGroupsScreen from './screens/goals/groups';
import LongTermGoalsScreen from './screens/goals/longterm';
import AccountInfoScreen from './screens/profile/AccountInfo';
import JournalScreen from './screens/profile/Journal';
import NewJournalEntryScreen from './screens/profile/NewJournalEntry';
import NotificationsSettingsScreen from './screens/profile/NotificationsSettings';
import SettingsScreen from './screens/profile/settings';
import StatsScreen from './screens/stats';
import useTheme from './styles/theme';

export type RootStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.MAIN]: undefined;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.ACCOUNT_INFO]: undefined;
  [ROUTES.NOTIFICATIONS_SETTINGS]: undefined;
  [ROUTES.CHECK_IN]: undefined;
  [ROUTES.STATS]: undefined;
  [ROUTES.LONG_TERM_GOALS]: undefined;
  [ROUTES.GOAL_GROUPS]: undefined;
  [ROUTES.ACHIEVEMENTS]: undefined;
  [ROUTES.CREATE_GOAL]: undefined;
  [ROUTES.JOURNAL]: undefined;
  [ROUTES.NEW_JOURNAL_ENTRY]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => {
  const theme = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.loadingText, { color: theme.colors.text }]}>
        Đang tải...
      </Text>
    </View>
  );
};

const AppContent = () => {
  const { isDarkMode } = useAppContext();
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            // Not authenticated - show login screen
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
          ) : (
            // Authenticated - show main app
            <>
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
              <Stack.Screen name={ROUTES.ACCOUNT_INFO} component={AccountInfoScreen} />
              <Stack.Screen name={ROUTES.NOTIFICATIONS_SETTINGS} component={NotificationsSettingsScreen} />
              <Stack.Screen name={ROUTES.CHECK_IN} component={CheckInScreen} />
              <Stack.Screen name={ROUTES.STATS} component={StatsScreen} />
              <Stack.Screen name={ROUTES.LONG_TERM_GOALS} component={LongTermGoalsScreen} />
              <Stack.Screen name={ROUTES.GOAL_GROUPS} component={GoalGroupsScreen} />
              <Stack.Screen name={ROUTES.ACHIEVEMENTS} component={AchievementsScreen} />
              <Stack.Screen name={ROUTES.CREATE_GOAL} component={CreateGoalScreen} />
              <Stack.Screen name={ROUTES.JOURNAL} component={JournalScreen} />
              <Stack.Screen name={ROUTES.NEW_JOURNAL_ENTRY} component={NewJournalEntryScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
}); 