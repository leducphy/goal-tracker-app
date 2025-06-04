import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import GoalCard, { Goal } from './GoalCard';

interface SwipeableGoalItemProps {
  goal: Goal;
  onPress: (goal: Goal) => void;
  onUpdate: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  showChevron?: boolean;
  leftActionText?: string;
  rightActionText?: string;
}

const SwipeableGoalItem: React.FC<SwipeableGoalItemProps> = ({
  goal,
  onPress,
  onUpdate,
  onDelete,
  showChevron = true,
  leftActionText = 'Chỉnh sửa',
  rightActionText = 'Xóa',
}) => {
  const renderLeftAction = () => (
    <View style={styles.leftActionContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editAction]}
        onPress={() => onUpdate(goal)}
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={18} color="white" />
        <Text style={styles.actionText}>{leftActionText}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRightAction = () => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteAction]}
        onPress={() => onDelete(goal)}
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={18} color="white" />
        <Text style={styles.actionText}>{rightActionText}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftAction}
      renderRightActions={renderRightAction}
      rightThreshold={25}
      leftThreshold={25}
    >
      <GoalCard
        goal={goal}
        onPress={onPress}
        showChevron={showChevron}
      />
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftActionContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  rightActionContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  actionButton: {
    width: 72,
    height: 'auto',
    minHeight: 50,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    gap: 4,
  },
  editAction: {
    backgroundColor: '#3B82F6',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SwipeableGoalItem; 