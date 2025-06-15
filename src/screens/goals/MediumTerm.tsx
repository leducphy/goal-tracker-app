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
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import { useToast } from '../../components/ToastProvider';
import { goalsService, LongTermGoal } from '../../api/services/goalsService';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { SwipeableGoalItem } from '../../components/goals';
import { ROUTES } from '../../constants/ROUTES';
import CircularProgress from '../../components/common/CircularProgress';

// Utility functions
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

type MediumTermRouteProp = RouteProp<RootStackParamList, 'MediumTerm'>;
type MediumTermNavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

const MediumTerm: React.FC = () => {
  const route = useRoute<MediumTermRouteProp>();
  const navigation = useNavigation<MediumTermNavigationProp>();
  const { goalId } = route.params;
  
  const theme = useTheme();
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useToast();

  const [goal, setGoal] = useState<LongTermGoal | null>(null);
  const [milestones, setMilestones] = useState<GoalMilestone[]>([]);
  const [progressHistory, setProgressHistory] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
            setMilestones(prev => prev.filter(m => m.id !== milestoneId));
            showSuccess(t('deleteMilestoneSuccess'));
          },
        },
      ]
    );
  };

  const handleNavigateToDailyGoals = (mediumGoalId: number, mediumGoalName: string) => {
    navigation.navigate(ROUTES.MEDIUM_TERM_GOAL_DETAIL, {
      goalId: mediumGoalId,
      goalName: mediumGoalName
    });
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

  const handleAddMediumGoal = () => {
    navigation.navigate(ROUTES.MEDIUM_GOAL_FORM, { 
      longTermGoalId: goalId,
      longTermGoalName: goal?.title || '',
      mode: 'create'
    });
  };

  // Loading state
  if (loading && !refreshing) {
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

  // Error state
  if (!goal && !refreshing) {
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

  const statusColor = goal?.status ? getStatusColor(goal.status) : theme.colors.primary;
  const progress = goal?.progress || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: statusColor }]}>
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
        
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <View style={styles.statusBadge}>
              <Ionicons name="time-outline" size={12} color="white" />
              <Text style={styles.statusBadgeText}>
                {goal?.status ? getStatusText(goal.status, t) : ''}
              </Text>
            </View>
            
            <Text style={styles.goalTitle} numberOfLines={2}>
              {goal?.title || ''}
            </Text>
            
            {goal?.description && (
              <Text style={styles.goalDescription} numberOfLines={2}>
                {goal.description}
              </Text>
            )}
            
            <View style={styles.dateContainer}>
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.dateText}>
                  {goal?.startDate ? formatDate(goal.startDate) : t('notSet')}
                </Text>
              </View>
              
              {goal?.endDate && (
                <View style={styles.dateItem}>
                  <Ionicons name="flag-outline" size={16} color="rgba(255, 255, 255, 0.9)" />
                  <Text style={styles.dateText}>
                    {formatDateRelative(goal.endDate, t)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <CircularProgress 
              size={76}
              strokeWidth={7}
              progress={progress / 100}
              color="white"
              bgColor={`${statusColor}50`}
            >
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressTextPercentage}>{progress}%</Text>
                <Text style={styles.progressTextLabel}>{t('completed')}</Text>
              </View>
            </CircularProgress>
          </View>
        </View>
      </View>

      {/* Main content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={statusColor}
            colors={[statusColor, theme.colors.primary]}
          />
        }
      >
        {/* Medium Term Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('mediumTermGoalsSection')}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                {t('clickToViewDailyTasks')}
              </Text>
            </View>
          </View>
          
          <View style={styles.goalsList}>
            {goal && goal.mediumTermGoals && goal.mediumTermGoals.length > 0 ? (
              goal.mediumTermGoals.map((mediumGoal) => (
                <SwipeableGoalItem
                  key={mediumGoal.id} 
                  goal={mediumGoal}
                  onPress={(goal) => handleNavigateToDailyGoals(goal.id, goal.title || goal.name || '')}
                  onUpdate={() => showWarning(t('featureInDevelopment'))}
                  onDelete={(goal) => handleDeleteMilestone(goal.id)}
                />
              ))
            ) : (
              <View style={[styles.emptyContainer, { backgroundColor: `${theme.colors.card}80` }]}>
                <Ionicons name="list-outline" size={40} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  {t('noMediumGoalsYet')}
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textTertiary }]}>
                  {t('tapToAddMediumGoal')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress History Section */}
        {progressHistory.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {t('progressHistorySection')}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                  {t('progressUpdates')}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: theme.colors.border }]}
                onPress={() => showWarning(t('featureInDevelopment'))}
              >
                <Ionicons name="add-circle-outline" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressHistoryContainer}>
              {progressHistory.slice(0, 5).map((progress, index) => (
                <View key={progress.id} style={[
                  styles.progressHistoryItem,
                  { backgroundColor: theme.colors.card }
                ]}>
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
              ))}
            </View>
            
            {progressHistory.length > 5 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => showWarning(t('featureInDevelopment'))}
              >
                <Text style={[styles.viewMoreText, { color: theme.colors.primary }]}>
                  {t('viewAll')}
                </Text>
                <Ionicons name="chevron-down" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddMediumGoal}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    marginTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  moreButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  titleSection: {
    flex: 1,
    paddingRight: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  goalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    lineHeight: 28,
  },
  goalDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 14,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 10,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },
  progressTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextPercentage: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
  progressTextLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalsList: {
    gap: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  progressHistoryContainer: {
    gap: 10,
  },
  progressHistoryItem: {
    padding: 14,
    borderRadius: 12,
  },
  progressHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressHistoryValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  progressHistoryDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressHistoryNotes: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 5,
    marginTop: 6,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  retryButton: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MediumTerm;