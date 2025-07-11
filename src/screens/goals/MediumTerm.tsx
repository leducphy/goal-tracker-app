import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Animated,
  Platform,
  ColorValue,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

import { RootStackParamList } from '../../App';
import { useToast } from '../../components/ToastProvider';
import { goalsService, LongTermGoal } from '../../api/services/goalsService';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { SwipeableGoalItem } from '../../components/goals';
import { ROUTES } from '../../constants/ROUTES';
import CircularProgress from '../../components/goals/CircularProgress';

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

  // Animation value for header
  const [scrollY] = useState(new Animated.Value(0));
  // Fixed size values instead of animated ones
  const progressSize = 70;

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
  
  // Create gradient colors based on status
  const gradientColors: ColorValue[] = [
    statusColor,
    `${statusColor}DD`,
    statusColor,
  ];
  
  // Transform animation for the header based on scroll
  const headerTranslateY = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [10, 0],
    extrapolate: 'clamp',
  });

  // Progress opacity animation based on scroll - fade in when scrolling down
  const progressOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View style={[
        styles.headerContainer,
        { 
          transform: [
            { translateY: headerTranslateY }
          ] 
        }
      ]}>
        <LinearGradient
          colors={[`${statusColor}`, `${statusColor}DD`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.headerGradient}
        >
          <View style={styles.headerPattern}>
            {/* Pattern với các đường kẻ chéo half-transparent */}
            {Array.from({length: 6}).map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.patternLine, 
                  {
                    left: `${i * 20}%`,
                    top: -100,
                    transform: [{ rotate: '45deg' }]
                  }
                ]} 
              />
            ))}
            {Array.from({length: 6}).map((_, i) => (
              <View 
                key={i + 6} 
                style={[
                  styles.patternLine, 
                  {
                    right: `${i * 20}%`,
                    top: 50,
                    transform: [{ rotate: '45deg' }]
                  }
                ]} 
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BlurView intensity={80} style={styles.blurButton} tint="light">
              <Ionicons name="chevron-back" size={24} color="white" />
            </BlurView>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showWarning(t('featureInDevelopment'))}
            >
              <BlurView intensity={80} style={styles.blurButton} tint="light">
                <Ionicons name="share-outline" size={20} color="white" />
              </BlurView>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showWarning(t('featureInDevelopment'))}
            >
              <BlurView intensity={80} style={styles.blurButton} tint="light">
                <Ionicons name="pencil-outline" size={20} color="white" />
              </BlurView>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
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
              <BlurView intensity={80} style={styles.blurButton} tint="light">
                <Ionicons name="ellipsis-horizontal" size={20} color="white" />
              </BlurView>
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerContentContainer}>
            <View style={styles.statusRow}>
              <BlurView intensity={90} style={styles.statusBadge} tint="light">
                <Ionicons name="time-outline" size={10} color="white" />
                <Text style={styles.statusBadgeText}>
                  {goal?.status ? getStatusText(goal.status, t) : ''}
                </Text>
              </BlurView>
              
            
            </View>
            
            <View style={styles.headerContent}>
              <View style={styles.titleSection}>
                <Text style={styles.goalTitle} numberOfLines={2}>
                  {goal?.title || ''}
                </Text>
                
                {goal?.description && (
                  <Text style={styles.goalDescription} numberOfLines={2}>
                    {goal.description}
                  </Text>
                )}
                
                {/* Thêm thẻ tags nếu có */}
                {goal?.category && (
                  <View style={styles.tagsContainer}>
                    <View style={styles.tagPill}>
                      <Text style={styles.tagText}>{goal.category}</Text>
                    </View>
                  </View>
                )}
              </View>
              
              <Animated.View style={[
                styles.progressContainer, 
                { 
                  width: progressSize, 
                  height: progressSize,
                  opacity: progressOpacity
                }
              ]}>
                <CircularProgress 
                  size={60}
                  strokeWidth={6}
                  progress={progress / 100}
                  color="white"
                  bgColor="rgba(255, 255, 255, 0.2)"
                >
                  <View style={styles.progressTextContainer}>
                    <Text style={styles.progressTextPercentage}>{progress}%</Text>
                  </View>
                </CircularProgress>
              </Animated.View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main content */}
      <Animated.ScrollView 
        style={styles.content}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={statusColor}
            colors={[statusColor, theme.colors.primary]}
          />
        }
      >
        {/* UNIFIED PROGRESS & STATS CARD */}
        <View style={[styles.unifiedCard, { borderColor: statusColor }]}>
          {/* Timeline Section */}
          <View style={styles.unifiedCardSection}>
            
            {/* Timeline Track */}
            <View style={styles.timelineTrack}>
              <View style={[styles.timelineProgress, { width: `${progress}%`, backgroundColor: statusColor }]} />
            
              {/* Markers */}
              <View style={styles.timelineStartMarker}>
                <Ionicons name="flag" size={12} color={statusColor} />
              </View>
              
              <View style={[styles.timelineCurrentMarker, { left: `${progress}%` }]}>
                <View style={[styles.timelineCurrentDot, { backgroundColor: statusColor }]} />
              </View>
              
              <View style={styles.timelineEndMarker}>
                <Ionicons name="trophy" size={12} color={statusColor} />
              </View>
            </View>
            
            {/* Timeline Labels */}
            <View style={styles.timelineLabels}>
              <View style={styles.timelineDateColumn}>
                <Text style={styles.timelineDateLabel}>
                  Start Date
                </Text>
                <Text style={styles.timelineDateValue}>
                  {goal?.startDate ? formatDate(goal.startDate) : "-"}
                </Text>
              </View>
              
              <View style={styles.timelineDateColumn}>
                <Text style={styles.timelineDateLabel}>
                  Time Remaining
                </Text>
                <Text style={[styles.timelineDateValue, { color: statusColor, fontWeight: '700' }]}>
                  {goal?.endDate ? formatDateRelative(goal.endDate, t) : "-"}
                </Text>
              </View>
              
              <View style={styles.timelineDateColumn}>
                <Text style={styles.timelineDateLabel}>
                  End Date
                </Text>
                <Text style={styles.timelineDateValue}>
                  {goal?.endDate ? formatDate(goal.endDate) : "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>

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
                style={[styles.actionSectionButton, { borderColor: theme.colors.border }]}
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
                      Updated
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
      </Animated.ScrollView>
      
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
  headerContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 10,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : 15,
    paddingBottom: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    zIndex: 1,
  },
  headerContentContainer: {
    padding: 16,
    paddingBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 60 : 70,
    position: 'relative',
    zIndex: 2,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 24,
    left: 16,
    zIndex: 20,
  },
  blurButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerActions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 24,
    right: 16,
    flexDirection: 'row',
    zIndex: 20,
    gap: 8,
  },
  actionButton: {
    // Style for action buttons at the top right
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  progressPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleSection: {
    flex: 1,
    paddingRight: 16,
  },
  goalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 5,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  goalDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
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
  actionSectionButton: {
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
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  patternLine: {
    position: 'absolute',
    width: 600,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  timelineTrack: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    position: 'relative',
    marginTop: 10,
    marginBottom: 25,
    marginHorizontal: 10,
  },
  timelineProgress: {
    height: '100%',
    borderRadius: 2,
  },
  timelineStartMarker: {
    position: 'absolute',
    top: -8,
    left: 0,
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineCurrentMarker: {
    position: 'absolute',
    top: -8,
    transform: [{translateX: -10}],
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  timelineCurrentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineEndMarker: {
    position: 'absolute',
    top: -8,
    right: 0,
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineDateColumn: {
    alignItems: 'center',
    maxWidth: '33%',
  },
  timelineDateLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  timelineDateValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  unifiedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  unifiedCardSection: {
    position: 'relative',
    zIndex: 1,
  },
});

export default MediumTerm;