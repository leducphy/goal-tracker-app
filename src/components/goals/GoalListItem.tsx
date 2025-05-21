import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import useTheme from '../../styles/theme';

export type GoalStatus = 'completed' | 'inProgress' | 'upcoming' | 'overdue';

interface GoalListItemProps {
  title: string;
  category?: string;
  deadline?: string;
  status: GoalStatus;
  onPress?: () => void;
  onComplete?: () => void;
}

const GoalListItem: React.FC<GoalListItemProps> = ({
  title,
  category,
  deadline,
  status,
  onPress,
  onComplete,
}) => {
  const theme = useTheme();
  
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'inProgress':
        return theme.colors.primary;
      case 'upcoming':
        return theme.colors.warning;
      case 'overdue':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'inProgress':
        return 'hourglass';
      case 'upcoming':
        return 'calendar';
      case 'overdue':
        return 'alert-circle';
      default:
        return 'ellipse';
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          {(category || deadline) && (
            <View style={styles.detailsContainer}>
              {category && (
                <Text style={[styles.category, { color: theme.colors.textSecondary }]}>
                  {category}
                </Text>
              )}
              {category && deadline && (
                <Text style={[styles.dot, { color: theme.colors.textTertiary }]}>•</Text>
              )}
              {deadline && (
                <Text style={[styles.deadline, { color: theme.colors.textSecondary }]}>
                  Hạn: {deadline}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.statusButton, { backgroundColor: `${getStatusColor()}20` }]}
        onPress={onComplete}
        disabled={status === 'completed' || !onComplete}
      >
        <Ionicons name={getStatusIcon()} size={20} color={getStatusColor()} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 13,
  },
  dot: {
    fontSize: 13,
    marginHorizontal: 4,
  },
  deadline: {
    fontSize: 13,
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default GoalListItem; 