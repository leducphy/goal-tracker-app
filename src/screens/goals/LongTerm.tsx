import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootStackParamList } from '../../App';
import { ROUTES } from '../../constants/ROUTES';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { goalsService, LongTermGoal, GoalStatusFilter } from '../../api/services/goalsService';
import { useToast } from '../../components/ToastProvider';
import { SwipeableGoalItem, Goal } from '../../components/goals';
import { ScrollContext } from '../../navigation/MainNavigation';

type LongTermGoalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LongTermGoalsScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<LongTermGoalsScreenNavigationProp>();
  const { showSuccess, showError } = useToast();
  
  const { scrollY, setScrolling } = useContext(ScrollContext);
  
  const [activeTab, setActiveTab] = useState<number>(0);
  const [goals, setGoals] = useState<LongTermGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Sử dụng useRef để theo dõi trạng thái mounted của component
  const isMounted = useRef(true);
  
  // Sử dụng useRef để lưu trữ statusFilters để tránh tạo lại mỗi lần render
  const statusFilters = useRef([
    { id: 0, name: t('statusAll'), status: 'all' as GoalStatusFilter, icon: 'grid-outline', color: '#6366F1' },
    { id: 1, name: t('statusInProgress'), status: 'inProgress' as GoalStatusFilter, icon: 'play-outline', color: '#3B82F6' },
    { id: 2, name: t('statusCompleted'), status: 'completed' as GoalStatusFilter, icon: 'checkmark-outline', color: '#10B981' },
    { id: 3, name: t('statusOverdue'), status: 'overdue' as GoalStatusFilter, icon: 'alert-outline', color: '#EF4444' },
  ]).current;
  
  // Tối ưu fetchGoals để không phụ thuộc vào t và showError
  const fetchGoals = useCallback(async (statusFilter?: GoalStatusFilter) => {
    try {
      console.log('🎯 Fetching long term goals with filter:', statusFilter);
      const response = await goalsService.getLongTermGoals(statusFilter);
      
      // Kiểm tra component còn mounted không trước khi cập nhật state
      if (isMounted.current) {
        setGoals(response.goals);
        console.log('✅ Long term goals loaded:', response.goals.length, 'goals');
      }
    } catch (error) {
      // Kiểm tra component còn mounted không trước khi hiển thị lỗi
      if (isMounted.current) {
        console.error('❌ Error fetching long term goals:', error);
        showError(t('loadLongTermGoalsError'));
      }
    }
  }, []); // Không phụ thuộc vào t và showError

  // Tối ưu loadGoals để chỉ phụ thuộc vào activeTab và fetchGoals
  const loadGoals = useCallback(async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    const currentFilter = statusFilters[activeTab];
    await fetchGoals(currentFilter.status);
    
    if (isMounted.current) {
      setLoading(false);
    }
  }, [activeTab, fetchGoals]);

  // Tối ưu handleRefresh để chỉ phụ thuộc vào activeTab và fetchGoals
  const handleRefresh = useCallback(async () => {
    if (!isMounted.current) return;
    
    setRefreshing(true);
    const currentFilter = statusFilters[activeTab];
    await fetchGoals(currentFilter.status);
    
    if (isMounted.current) {
      setRefreshing(false);
    }
  }, [activeTab, fetchGoals]);

  // Tối ưu handleTabChange để chỉ phụ thuộc vào fetchGoals
  const handleTabChange = useCallback(async (tabIndex: number) => {
    if (!isMounted.current) return;
    
    setActiveTab(tabIndex);
    setLoading(true);
    const selectedFilter = statusFilters[tabIndex];
    await fetchGoals(selectedFilter.status);
    
    if (isMounted.current) {
      setLoading(false);
    }
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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Có thể thêm logic khác ở đây nếu cần
      }
    }
  );

  const handleShowBottomBar = () => {
    Animated.spring(scrollY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // Sử dụng useEffect để gọi API chỉ một lần khi component mount
  useEffect(() => {
    loadGoals();
    
    // Cleanup function để đánh dấu component đã unmount
    return () => {
      isMounted.current = false;
    };
  }, [loadGoals]);
  
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
      
      <TouchableOpacity 
        style={[styles.createButtonInline, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreateGoal}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.createButtonText}>{t('createNewGoal')}</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {t('longTermGoals')}
          </Text>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: `${theme.colors.primary}15` }]}
            onPress={handleCreateGoal}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={theme.colors.primary} />
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
                onPress={() => {
                  handleTabChange(index);
                  handleShowBottomBar();
                }}
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
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              {t('loadingGoals')}
            </Text>
          </View>
        ) : (
          goals.length > 0 ? (
            <Animated.ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary]}
                  tintColor={theme.colors.primary}
                />
              }
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onScrollBeginDrag={() => setScrolling(true)}
              onScrollEndDrag={() => setScrolling(false)}
              onMomentumScrollBegin={() => setScrolling(true)}
              onMomentumScrollEnd={() => setScrolling(false)}
            >
              {goals.map((goal) => (
                <SwipeableGoalItem
                  key={goal.id}
                  goal={{
                    id: goal.id,
                    title: goal.title || goal.name || '',
                    description: goal.description || '',
                    status: goal.status,
                    category: typeof goal.category === 'string' ? goal.category : 'Mục tiêu',
                    progress: goal.progress || 0,
                    dueDate: goal.endDate,
                    createdAt: goal.startDate,
                  }}
                  onPress={handleGoalPress}
                  onUpdate={handleUpdateGoal}
                  onDelete={handleDeleteGoal}
                  showChevron
                />
              ))}
              
              <View style={{ height: 100 }} />
            </Animated.ScrollView>
          ) : (
            renderEmptyState()
          )
        )}
        
        <View style={{ height: 100 }} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  createButtonInline: {
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
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 100,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LongTermGoalsScreen; 