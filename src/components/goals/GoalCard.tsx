import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '../../styles/theme';

// Utility functions inline to avoid import issues for now
const getStatusColor = (status: string): string => {
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

const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'inProgress':
      return 'Đang thực hiện';
    case 'overdue':
      return 'Quá hạn';
    default:
      return 'Sắp tới';
  }
};

const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `Quá hạn ${Math.abs(diffDays)} ngày`;
  } else if (diffDays === 0) {
    return 'Hôm nay';
  } else if (diffDays === 1) {
    return 'Ngày mai';
  } else if (diffDays <= 7) {
    return `${diffDays} ngày nữa`;
  } else {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }
};

export interface Goal {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  status: string;
  progress?: number;
  endDate?: string;
  deadline?: string;
  type?: string; // For compatibility with LongTermGoal
  startDate?: string;
  // Allow any additional properties for flexibility
  [key: string]: any;
}

interface GoalCardProps {
  goal: Goal;
  onPress: (goal: Goal) => void;
  showChevron?: boolean;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onPress, 
  showChevron = true 
}) => {
  const theme = useTheme();
  const statusColor = getStatusColor(goal.status);

  return (
    <TouchableOpacity
      style={[styles.goalCard, { backgroundColor: theme.colors.card }]}
      onPress={() => onPress(goal)}
      activeOpacity={0.95}
    >
      <View style={styles.cardContent}>
        {/* Header Section */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            <View style={styles.titleContainer}>
              <Text style={[styles.goalTitle, { color: theme.colors.text }]} numberOfLines={2}>
                {goal.title || goal.name}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor}12` }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {getStatusText(goal.status)}
                </Text>
              </View>
            </View>
          </View>
          {showChevron && (
            <View style={styles.headerRight}>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </View>
          )}
        </View>

        {/* Description */}
        {goal.description && (
          <View style={styles.descriptionSection}>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {goal.description}
            </Text>
          </View>
        )}

        {/* Progress Section */}
        {goal.progress !== undefined && (
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                Tiến độ: 
              </Text>
              <Text style={[styles.progressValue, { color: statusColor }]}>
                {goal.progress}%
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: `${statusColor}15` }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: statusColor,
                    width: `${goal.progress}%`
                  }
                ]} 
              />
            </View>
          </View>
        )}

        {/* Footer */}
        {(goal.deadline || goal.endDate) && (
          <View style={styles.cardFooter}>
            <View style={styles.dateInfo}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                {formatDateRelative(goal.deadline || goal.endDate!)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goalCard: {
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  statusIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  headerRight: {
    padding: 4,
  },
  descriptionSection: {
    marginBottom: 12,
    paddingLeft: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  progressSection: {
    marginBottom: 12,
    paddingLeft: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  cardFooter: {
    paddingLeft: 16,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default GoalCard; 