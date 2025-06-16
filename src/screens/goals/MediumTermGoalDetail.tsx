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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import { useToast } from '../../components/ToastProvider';
import { goalsService, MediumTermGoal } from '../../api/services/goalsService';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
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

type MediumTermGoalDetailRouteProp = RouteProp<RootStackParamList, 'MediumTermGoalDetail'>;
type MediumTermGoalDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DailyTask {
  id: number;
  title: string;
  description?: string;
  target_date: string;
  is_completed: boolean;
  completed_date?: string;
}

interface GoalNote {
  id: number;
  date: string;
  content: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  }
}

const MediumTermGoalDetail: React.FC = () => {
  const route = useRoute<MediumTermGoalDetailRouteProp>();
  const navigation = useNavigation<MediumTermGoalDetailNavigationProp>();
  const { goalId } = route.params;
  
  const theme = useTheme();
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useToast();

  const [goal, setGoal] = useState<MediumTermGoal | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [notes, setNotes] = useState<GoalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGoalData();
  }, [goalId]);

  const loadGoalData = async () => {
    try {
      setLoading(true);
      
      // Load goal details, tasks, and notes in parallel
      const [goalResponse, tasksResponse, notesResponse] = await Promise.all([
        goalsService.getMediumGoalById(goalId),
        goalsService.getDailyGoals(), // Replace with actual API call when available
        Promise.resolve([]), // Replace with actual API call when available
      ]);

      setGoal(goalResponse);
      
      // Filter daily tasks only for this medium goal (mock implementation)
      setDailyTasks(tasksResponse.goals
        .slice(0, 5)
        .map(task => ({
          id: task.id,
          title: task.name || task.title || '',
          description: task.description,
          target_date: task.endDate || new Date().toISOString(),
          is_completed: task.status === 'completed',
          completed_date: task.status === 'completed' ? new Date().toISOString() : undefined
        }))
      );
      
      // Set notes (mock data for now)
      setNotes([
        {
          id: 1,
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          content: 'Added first subtask for this goal',
          user: {
            id: 1,
            name: 'You',
            avatar: 'https://i.pravatar.cc/150?img=12'
          }
        },
        {
          id: 2,
          date: new Date(Date.now() - 86400000).toISOString(),
          content: 'Making steady progress on the study plan',
          user: {
            id: 1,
            name: 'You',
            avatar: 'https://i.pravatar.cc/150?img=12'
          }
        }
      ]);
      
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

  const handleUpdateTask = (taskId: number) => {
    showWarning(t('featureInDevelopment'));
  };

  const handleDeleteTask = (taskId: number) => {
    Alert.alert(
      t('deleteTaskTitle'),
      t('deleteTaskMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            setDailyTasks(prev => prev.filter(task => task.id !== taskId));
            showSuccess(t('deleteTaskSuccess'));
          },
        },
      ]
    );
  };

  const handleAddTask = () => {
    showWarning(t('featureInDevelopment'));
  };

  const handleAddNote = () => {
    showWarning(t('featureInDevelopment'));
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
              {goal?.title || goal?.name || ''}
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
        {/* Daily Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('dailyTasks')}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                {t('dailyTasksDescription')}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleAddTask}
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            >
              <Ionicons name="add-outline" size={22} color="white" />
              <Text style={styles.addButtonText}>{t('addTask')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tasksList}>
            {dailyTasks.length > 0 ? (
              dailyTasks.map((task, index) => (
                <View 
                  key={task.id} 
                  style={[
                    styles.taskItem,
                    { backgroundColor: theme.colors.card }
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.taskCheckbox,
                      task.is_completed && { backgroundColor: statusColor }
                    ]}
                    onPress={() => {
                      const updatedTasks = [...dailyTasks];
                      updatedTasks[index] = {
                        ...task,
                        is_completed: !task.is_completed
                      };
                      setDailyTasks(updatedTasks);
                    }}
                  >
                    {task.is_completed && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.taskContent}>
                    <Text
                      style={[
                        styles.taskTitle,
                        { color: theme.colors.text },
                        task.is_completed && styles.taskCompleted
                      ]}
                    >
                      {task.title}
                    </Text>
                    
                    {task.description && (
                      <Text
                        style={[
                          styles.taskDescription,
                          { color: theme.colors.textSecondary },
                          task.is_completed && styles.taskCompleted
                        ]}
                        numberOfLines={2}
                      >
                        {task.description}
                      </Text>
                    )}
                    
                    <Text style={[styles.taskDate, { color: theme.colors.textTertiary }]}>
                      {formatDateRelative(task.target_date, t)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.taskMoreButton}
                    onPress={() => {
                      Alert.alert(
                        task.title,
                        t('taskOptions'),
                        [
                          { text: t('cancel'), style: 'cancel' },
                          { text: t('edit'), onPress: () => handleUpdateTask(task.id) },
                          { text: t('delete'), style: 'destructive', onPress: () => handleDeleteTask(task.id) }
                        ]
                      );
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={[styles.emptyContainer, { backgroundColor: `${theme.colors.card}80` }]}>
                <Ionicons name="calendar-outline" size={40} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  {t('noTasksYet')}
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textTertiary }]}>
                  {t('addTasksToProgress')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('notes')}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                {t('notesDescription')}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleAddNote}
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            >
              <Ionicons name="add-outline" size={22} color="white" />
              <Text style={styles.addButtonText}>{t('addNote')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.notesList}>
            {notes.length > 0 ? (
              notes.map(note => (
                <View 
                  key={note.id} 
                  style={[
                    styles.noteItem,
                    { backgroundColor: theme.colors.card }
                  ]}
                >
                  <View style={styles.noteHeader}>
                    {note.user?.avatar && (
                      <Image 
                        source={{ uri: note.user.avatar }} 
                        style={styles.noteAvatar} 
                      />
                    )}
                    <View style={styles.noteMetadata}>
                      <Text style={[styles.noteAuthor, { color: theme.colors.text }]}>
                        {note.user?.name || 'Unknown'}
                      </Text>
                      <Text style={[styles.noteDate, { color: theme.colors.textSecondary }]}>
                        {formatDate(note.date)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.noteContent, { color: theme.colors.text }]}>
                    {note.content}
                  </Text>
                </View>
              ))
            ) : (
              <View style={[styles.emptyContainer, { backgroundColor: `${theme.colors.card}80` }]}>
                <Ionicons name="document-text-outline" size={40} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  {t('noNotesYet')}
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textTertiary }]}>
                  {t('addNotesToTrack')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddTask}
      >
        <Ionicons name="add" size={24} color="white" />
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  tasksList: {
    gap: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#A0A0A0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  taskDescription: {
    fontSize: 13,
    marginBottom: 5,
    lineHeight: 18,
  },
  taskDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  taskMoreButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
  notesList: {
    gap: 10,
  },
  noteItem: {
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  noteMetadata: {
    flex: 1,
  },
  noteAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  noteDate: {
    fontSize: 11,
    marginTop: 2,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
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

export default MediumTermGoalDetail; 