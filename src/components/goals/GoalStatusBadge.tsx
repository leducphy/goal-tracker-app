import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Utility functions inline to avoid import issues
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

const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'checkmark-circle';
    case 'inProgress':
      return 'play-circle';
    case 'overdue':
      return 'warning';
    default:
      return 'time';
  }
};

interface GoalStatusBadgeProps {
  status: string;
  variant?: 'default' | 'compact' | 'hero';
  showIcon?: boolean;
}

const GoalStatusBadge: React.FC<GoalStatusBadgeProps> = ({
  status,
  variant = 'default',
  showIcon = false,
}) => {
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);
  const statusIcon = getStatusIcon(status);

  const getContainerStyle = () => {
    switch (variant) {
      case 'compact':
        return [styles.compactBadge, { backgroundColor: `${statusColor}12` }];
      case 'hero':
        return [styles.heroBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }];
      default:
        return [styles.defaultBadge, { backgroundColor: `${statusColor}12` }];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'compact':
        return [styles.compactText, { color: statusColor }];
      case 'hero':
        return [styles.heroText, { color: 'white' }];
      default:
        return [styles.defaultText, { color: statusColor }];
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return 10;
      case 'hero':
        return 16;
      default:
        return 12;
    }
  };

  return (
    <View style={getContainerStyle()}>
      {showIcon && (
        <Ionicons 
          name={statusIcon as any} 
          size={getIconSize()} 
          color={variant === 'hero' ? 'white' : statusColor} 
        />
      )}
      <Text style={getTextStyle()}>
        {statusText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  compactText: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  heroText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default GoalStatusBadge; 