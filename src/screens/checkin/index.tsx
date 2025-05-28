import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import { DailyGoal, DailyGoalsResponse, goalsService, GoalStatus } from '../../api';
import SectionHeader from '../../components/common/SectionHeader';
import GoalListItem from '../../components/goals/GoalListItem';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type CheckInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CheckInScreen: React.FC = () => {
  const navigation = useNavigation<CheckInScreenNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [t('goalsAll'), t('goals'), t('work')];
  
  // API state management
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goalsData, setGoalsData] = useState<DailyGoalsResponse | null>(null);
  
  // Fetch daily goals on component mount
  useEffect(() => {
    fetchDailyGoals();
  }, []);
  
  const fetchDailyGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalsService.getDailyGoals();
      setGoalsData(data);
      setGoals(data.goals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
      console.error('Error fetching daily goals:', err);
      // Show alert to user
      Alert.alert(
        'Lỗi',
        'Không thể tải danh sách mục tiêu hàng ngày. Vui lòng thử lại.',
        [
          { text: 'Thử lại', onPress: fetchDailyGoals },
          { text: 'Hủy', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleGoalStatus = async (id: string) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;
      
      // Toggle between completed and other statuses
      const newStatus: GoalStatus = goal.status === 'completed' 
        ? 'inProgress'
        : 'completed';
      
      // Optimistic update
      setGoals(prevGoals => 
        prevGoals.map(g => 
          g.id === id ? { ...g, status: newStatus } : g
        )
      );
      
      // Update on server
      await goalsService.updateGoalStatus(id, newStatus);
      
      // Update goals data for progress calculation
      if (goalsData) {
        const updatedGoals = goals.map(g => g.id === id ? { ...g, status: newStatus } : g);
        const completedGoals = updatedGoals.filter(g => g.status === 'completed');
        setGoalsData({
          ...goalsData,
          goals: updatedGoals,
          completedGoals: completedGoals.length,
          completionPercentage: Math.round((completedGoals.length / updatedGoals.length) * 100)
        });
      }
    } catch (err) {
      console.error('Error updating goal status:', err);
      // Revert optimistic update
      fetchDailyGoals();
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái mục tiêu. Vui lòng thử lại.');
    }
  };
  
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const completionPercentage = goalsData?.completionPercentage || 
    Math.round((completedGoals.length / Math.max(goals.length, 1)) * 100);
  
  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab, 
              activeTab === index && { 
                borderBottomWidth: 2, 
                borderBottomColor: theme.colors.primary 
              }
            ]}
            onPress={() => setActiveTab(index)}
          >
            <Text 
              style={[
                styles.tabText, 
                { 
                  color: activeTab === index 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary 
                }
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Đang tải...
          </Text>
        </View>
      );
    }

    if (error && goals.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error || '#ff4444' }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={fetchDailyGoals}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (goals.length === 0) {
      return (
        <View style={styles.emptyMessage}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            {t('noGoalsToday')}
          </Text>
        </View>
      );
    }

    return (
      <>
        <SectionHeader title={t('yourGoalsList')} />
        <View style={styles.goalsList}>
          {goals.map((goal) => (
            <GoalListItem
              key={goal.id}
              title={goal.title}
              category={goal.category}
              deadline={goal.deadline}
              status={goal.status as GoalStatus}
              onPress={() => {}}
              onComplete={() => handleToggleGoalStatus(goal.id)}
            />
          ))}
        </View>
      </>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('dailyCheckin')}</Text>
            <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
              {t('todayDate', { date: new Date().toLocaleDateString('vi-VN') })}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressTitle, { color: theme.colors.text }]}>{t('todayProgress')}</Text>
          <Text style={[styles.progressSubtitle, { color: theme.colors.textSecondary }]}>
            {t('completionStatus', { 
              completed: completedGoals.length, 
              total: goals.length, 
              percentage: completionPercentage 
            })}
          </Text>
        </View>
      
        {renderTabs()}
        
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    lineHeight: 18,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 20,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  emptyMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
  },
  goalsList: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
});

export default CheckInScreen; 