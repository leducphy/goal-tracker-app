import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootStackParamList } from '../../App';
import { useToast } from '../../components/ToastProvider';
import { goalsService, LongTermGoal } from '../../api/services/goalsService';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { SwipeableGoalItem } from '../../components/goals';
import { ROUTES } from '../../constants/ROUTES';

// Utility functions inline
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#10B981';
    case 'inProgress':
      return '#3B82F6';
    case 'overdue':
      return '#EF4444';
    default:
      return '#F59E0B';
  }
};

const getStatusText = (status: string, t: any) => {
  switch (status) {
    case 'completed':
      return t('statusCompleted');
    case 'inProgress':
      return t('statusInProgress');
    case 'overdue':
      return t('statusOverdue');
    default:
      return t('statusUpcoming');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatDateRelative = (dateString: string, t: any) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return t('overdueDays', { days: Math.abs(diffDays) });
  } else if (diffDays === 0) {
    return t('today');
  } else if (diffDays === 1) {
    return t('tomorrow');
  } else if (diffDays <= 7) {
    return t('daysLeft', { days: diffDays });
  } else {
    return formatDate(dateString);
  }
};

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

type LongTermGoalDetailRouteProp = RouteProp<RootStackParamList, 'LongTermGoalDetail'>;
type LongTermGoalDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GoalMilestone {
  id: number;
  title: string;
  description?: string;
  target_date: string;
  is_completed: boolean;
  completed_date?: string;
}

interface GoalProgress {
  id: number;
  date: string;
  progress_value: number;
  notes?: string;
}

const LongTermGoalDetail: React.FC = () => {
  const route = useRoute<LongTermGoalDetailRouteProp>();
  const navigation = useNavigation<LongTermGoalDetailNavigationProp>();
  const { goalId, goalName } = route.params;
  
  const theme = useTheme();
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useToast();

  const [goal, setGoal] = useState<LongTermGoal | null>(null);
  const [milestones, setMilestones] = useState<GoalMilestone[]>([]);
  const [progressHistory, setProgressHistory] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    loadGoalData();
  }, [goalId]);

  const loadGoalData = async () => {
    try {
      setLoading(true);
      
      // Load goal details, milestones, and progress in parallel
      const [goalResponse, milestonesResponse, progressResponse] = await Promise.all([
        goalsService.getGoalById(goalId),
        goalsService.getGoalMilestones(goalId),
        goalsService.getGoalProgress(goalId),
      ]);

      setGoal(goalResponse);
      setMilestones(milestonesResponse);
      setProgressHistory(progressResponse);
      
    } catch (error) {
      console.error('Error loading goal data:', error);
      showError(t('loadGoalError'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGoalData();
    setRefreshing(false);
  };

  const handleUpdateMilestone = (milestoneId: number) => {
    showWarning(t('featureInDevelopment'));
  };

  const handleDeleteMilestone = (milestoneId: number) => {
    Alert.alert(
      t('deleteMilestoneTitle'),
      t('deleteMilestoneMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            // Update local state
            setMilestones(prev => prev.filter(m => m.id !== milestoneId));
            showSuccess(t('deleteMilestoneSuccess'));
          },
        },
      ]
    );
  };

  const handleNavigateToDailyGoals = (mediumGoalId: number, mediumGoalName: string) => {
    // Navigate to daily goals for this medium term goal
    showSuccess(`${t('navigateToDailyGoals')}: ${mediumGoalName}`);
    // navigation.navigate('DailyGoals', { mediumGoalId, mediumGoalName });
  };

  const handleDeleteGoal = () => {
    Alert.alert(
      t('deleteGoalTitle'),
      t('deleteGoalMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await goalsService.deleteGoal(goalId);
              showSuccess(t('deleteGoalSuccess'));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting goal:', error);
              showError(t('deleteGoalError'));
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            {t('loadingGoal')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!goal) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            {t('goalNotFound')}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={loadGoalData}
          >
            <Text style={styles.retryButtonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(goal.status);

  // Animation interpolations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const heroContentOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.6],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE * 0.3, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Animated Header */}
        <Animated.View style={[{ height: headerHeight, overflow: 'hidden' }]}>
          <LinearGradient
            colors={[statusColor, `${statusColor}CC`]}
            style={styles.header}
          >
            <View style={styles.headerRow}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => {
                  Alert.alert(
                    t('options'),
                    t('chooseAction'),
                    [
                      { text: t('cancel'), style: 'cancel' },
                      { text: t('editGoal'), onPress: () => showWarning(t('featureInDevelopment')) },
                      { text: t('deleteGoal'), style: 'destructive', onPress: handleDeleteGoal },
                    ]
                  );
                }}
              >
                <Ionicons name="ellipsis-horizontal" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Compact Header (visible when scrolled) */}
            <Animated.View style={[styles.compactHeader, { opacity: compactHeaderOpacity }]}>
              <View style={styles.compactInfo}>
                <Text style={styles.compactTitle} numberOfLines={1}>
                  {goal.title}
                </Text>
                <Text style={styles.compactSubtitle} numberOfLines={1}>
                  {goal.startDate ? formatDate(goal.startDate) : t('notSet')} 
                  {goal.endDate && ` → ${formatDateRelative(goal.endDate, t)}`}
                </Text>
              </View>
              <View style={styles.compactProgressContainer}>
                <Text style={styles.compactProgressText}>{goal.progress || 0}%</Text>
                <Text style={styles.compactProgressLabel}>{t('progressLabel')}</Text>
              </View>
            </Animated.View>

            {/* Full Hero Content (hidden when scrolled) */}
            <Animated.View 
              style={[
                styles.heroContent, 
                { opacity: heroContentOpacity }
              ]}
            >
              <View style={styles.heroStatusBadge}>
                <Ionicons name="flag-outline" size={16} color="white" />
                <Text style={styles.heroStatusText}>{getStatusText(goal.status, t)}</Text>
              </View>
              
              <Text style={styles.heroTitle} numberOfLines={3}>
                {goal.title}
              </Text>
              
              {goal.description && (
                <Text style={styles.heroDescription} numberOfLines={2}>
                  {goal.description}
                </Text>
              )}

              {/* Progress Display */}
              <View style={styles.progressContainer}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressPercentage}>{goal.progress || 0}%</Text>
                  <Text style={styles.heroProgressLabel}>{t('completed')}</Text>
                </View>
                
                <View style={styles.goalDates}>
                  <View style={styles.dateItem}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.heroDateText}>
                      {goal.startDate ? formatDate(goal.startDate) : t('notSet')}
                    </Text>
                  </View>
                  {goal.endDate && (
                    <View style={styles.dateItem}>
                      <Ionicons name="flag-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
                      <Text style={styles.heroDateText}>
                        {formatDateRelative(goal.endDate, t)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        <Animated.ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={statusColor}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          {/* Medium Term Goals */}
          {goal.mediumTermGoals && goal.mediumTermGoals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {t('mediumTermGoalsSection')}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.countText}>
                    {goal.mediumTermGoals.filter(m => m.status === 'completed').length}/{goal.mediumTermGoals.length}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                {t('clickToViewDailyTasks')}
              </Text>
              
              <View style={styles.goalsList}>
                {goal.mediumTermGoals.map((mediumGoal, index) => (
                  <SwipeableGoalItem
                    key={mediumGoal.id} 
                    goal={mediumGoal}
                    onPress={(goal) => handleNavigateToDailyGoals(goal.id, goal.title || goal.name || '')}
                    onUpdate={(goal) => handleUpdateMilestone(goal.id)}
                    onDelete={(goal) => handleDeleteMilestone(goal.id)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Progress History */}
          {progressHistory.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('progressHistorySection')}
              </Text>
              
              {progressHistory.slice(0, 5).map((progress, index) => (
                <View key={progress.id} style={styles.progressHistoryItem}>
                  <View style={[styles.progressDot, { backgroundColor: statusColor }]} />
                  <View style={styles.progressHistoryContent}>
                    <View style={styles.progressHistoryHeader}>
                      <Text style={[styles.progressHistoryValue, { color: statusColor }]}>
                        {progress.progress_value}%
                      </Text>
                      <Text style={[styles.progressHistoryDate, { color: theme.colors.textSecondary }]}>
                        {formatDate(progress.date)}
                      </Text>
                    </View>
                    
                    {progress.notes && (
                      <Text style={[styles.progressHistoryNotes, { color: theme.colors.textSecondary }]}>
                        {progress.notes}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </Animated.ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  compactInfo: {
    flex: 1,
    marginRight: 16,
  },
  compactTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  compactSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  compactProgressContainer: {
    alignItems: 'flex-end',
  },
  compactProgressText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  compactProgressLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  heroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  heroStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  heroStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
    paddingHorizontal: 20,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  progressContainer: {
    alignItems: 'center',
    gap: 16,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  heroProgressLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  goalDates: {
    flexDirection: 'row',
    gap: 24,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroDateText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  goalsList: {
    gap: 14,
  },
  progressHistoryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  progressHistoryContent: {
    flex: 1,
  },
  progressHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressHistoryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressHistoryDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressHistoryNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default LongTermGoalDetail; 