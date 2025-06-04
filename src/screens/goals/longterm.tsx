import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootStackParamList } from '../../App';
import { ROUTES } from '../../constants/ROUTES';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { goalsService, LongTermGoal, GoalStatusFilter } from '../../api/services/goalsService';
import { useToast } from '../../components/ToastProvider';
import { SwipeableGoalItem, Goal } from '../../components/goals';

type LongTermGoalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LongTermGoalsScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<LongTermGoalsScreenNavigationProp>();
  const { showSuccess, showError } = useToast();
  
  const [activeTab, setActiveTab] = useState<number>(0);
  const [goals, setGoals] = useState<LongTermGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const statusFilters: { 
    id: number; 
    name: string; 
    status: GoalStatusFilter;
    icon: string;
    color: string;
  }[] = [
    { id: 0, name: t('statusAll'), status: 'all', icon: 'grid-outline', color: '#6366F1' },
    { id: 1, name: t('statusInProgress'), status: 'inProgress', icon: 'play-outline', color: '#3B82F6' },
    { id: 2, name: t('statusCompleted'), status: 'completed', icon: 'checkmark-outline', color: '#10B981' },
    { id: 3, name: t('statusOverdue'), status: 'overdue', icon: 'alert-outline', color: '#EF4444' },
  ];
  
  const fetchGoals = useCallback(async (statusFilter?: GoalStatusFilter) => {
    try {
      console.log('🎯 Fetching long term goals with filter:', statusFilter);
      const response = await goalsService.getLongTermGoals(statusFilter);
      
      setGoals(response.goals);
      
      console.log('✅ Long term goals loaded:', response.goals.length, 'goals');
    } catch (error) {
      console.error('❌ Error fetching long term goals:', error);
      showError(t('loadLongTermGoalsError'));
    }
  }, [showError, t]);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    const currentFilter = statusFilters[activeTab];
    await fetchGoals(currentFilter.status);
    setLoading(false);
  }, [activeTab, fetchGoals]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const currentFilter = statusFilters[activeTab];
    await fetchGoals(currentFilter.status);
    setRefreshing(false);
  }, [activeTab, fetchGoals]);

  const handleTabChange = useCallback(async (tabIndex: number) => {
    setActiveTab(tabIndex);
    setLoading(true);
    const selectedFilter = statusFilters[tabIndex];
    await fetchGoals(selectedFilter.status);
    setLoading(false);
  }, [fetchGoals]);

  const handleGoalPress = useCallback((goal: Goal) => {
    const longTermGoal = goal as LongTermGoal;
    navigation.navigate(ROUTES.LONG_TERM_GOAL_DETAIL, { 
      goalId: longTermGoal.id,
      goalName: longTermGoal.title || longTermGoal.name 
    });
  }, [navigation]);

  const handleCreateGoal = useCallback(() => {
    navigation.navigate(ROUTES.CREATE_GOAL);
  }, [navigation]);

  const handleUpdateGoal = useCallback((goal: Goal) => {
    const longTermGoal = goal as LongTermGoal;
    navigation.navigate(ROUTES.LONG_TERM_GOAL_DETAIL, { 
      goalId: longTermGoal.id,
      goalName: longTermGoal.title || longTermGoal.name
    });
  }, [navigation]);

  const handleDeleteGoal = useCallback(async (goal: Goal) => {
    const longTermGoal = goal as LongTermGoal;
    Alert.alert(
      t('confirmDelete'),
      t('confirmDeleteGoalMessage', { goalName: longTermGoal.title || longTermGoal.name }),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await goalsService.deleteGoal(longTermGoal.id);
              showSuccess(t('deleteGoalSuccess'));
              loadGoals();
            } catch (error) {
              console.error('❌ Error deleting goal:', error);
              showError(t('deleteGoalError'));
            }
          },
        },
      ]
    );
  }, [showSuccess, showError, loadGoals, t]);

  useEffect(() => {
    loadGoals();
  }, []);
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: `${theme.colors.primary}08` }]}>
        <Ionicons name="flag-outline" size={48} color={theme.colors.primary} />
      </View>
      
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {activeTab === 0 ? t('noGoalsEmpty') : t('emptyListMessage')}
      </Text>
      
      <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
        {activeTab === 0 
          ? t('createFirstGoalMessage')
          : t('noGoalsInStatusMessage')
        }
      </Text>
      
      {activeTab === 0 && (
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateGoal}
          activeOpacity={0.9}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>{t('createNewGoal')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: `${theme.colors.text}08` }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              {t('longTermGoals')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {t('goalCount', { count: goals.length })}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCreateGoal}
          >
            <Ionicons name="add" size={22} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {statusFilters.map((tab, index) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  activeTab === index && [styles.activeTab, { backgroundColor: tab.color }]
                ]}
                onPress={() => handleTabChange(index)}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={16} 
                  color={activeTab === index ? 'white' : theme.colors.textSecondary} 
                />
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === index ? 'white' : theme.colors.textSecondary },
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              {t('loadingGoals')}
            </Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
              />
            }
          >
            {goals.length === 0 ? (
              renderEmptyState()
            ) : (
              <View style={styles.goalsList}>
                {goals.map((goal) => (
                  <SwipeableGoalItem
                    key={goal.id}
                    goal={goal}
                    onPress={handleGoalPress}
                    onUpdate={handleUpdateGoal}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabsContainer: {
    paddingVertical: 16,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  activeTab: {
    borderColor: 'transparent',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  goalsList: {
    gap: 14,
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    gap: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LongTermGoalsScreen; 