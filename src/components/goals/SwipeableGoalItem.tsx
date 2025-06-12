import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import GoalCard, { Goal } from './GoalCard';
import useTheme from '../../styles/theme';

interface SwipeableGoalItemProps {
  goal: Goal;
  onPress: (goal: Goal) => void;
  onUpdate: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  showChevron?: boolean;
  leftActionText?: string;
  rightActionText?: string;
}

// Static variable to track the currently open swipeable
let currentlyOpenSwipeable: Swipeable | null = null;

const SwipeableGoalItem: React.FC<SwipeableGoalItemProps> = ({
  goal,
  onPress,
  onUpdate,
  onDelete,
  showChevron = true,
  leftActionText = 'Chỉnh sửa',
  rightActionText = 'Xóa',
}) => {
  const theme = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (currentlyOpenSwipeable === swipeableRef.current) {
        currentlyOpenSwipeable = null;
      }
    };
  }, []);

  const closeCurrentSwipeable = () => {
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeableRef.current) {
      currentlyOpenSwipeable.close();
    }
  };

  const handleSwipeableOpen = () => {
    closeCurrentSwipeable();
    currentlyOpenSwipeable = swipeableRef.current;
  };

  const renderLeftAction = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [-20, 0],
      extrapolate: 'clamp',
    });
    
    const opacity = dragX.interpolate({
      inputRange: [0, 40, 80],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.actionContainer, 
          styles.leftActionContainer, 
          { 
            transform: [{ translateX: trans }],
            opacity 
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, styles.editAction]}
          onPress={() => {
            swipeableRef.current?.close();
            onUpdate(goal);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.actionText}>{leftActionText}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderRightAction = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 20],
      extrapolate: 'clamp',
    });
    
    const opacity = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.actionContainer, 
          styles.rightActionContainer, 
          { 
            transform: [{ translateX: trans }],
            opacity 
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteAction]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete(goal);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.actionText}>{rightActionText}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.cardWrapper}>
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftAction}
        renderRightActions={renderRightAction}
        rightThreshold={40}
        leftThreshold={40}
        friction={2}
        overshootFriction={8}
        onSwipeableOpen={handleSwipeableOpen}
        onSwipeableWillOpen={closeCurrentSwipeable}
      >
        <GoalCard
          goal={goal}
          onPress={() => {
            closeCurrentSwipeable();
            swipeableRef.current?.close();
            onPress(goal);
          }}
          showChevron={showChevron}
        />
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionContainer: {
    width: 90,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftActionContainer: {
    paddingRight: 10,
    alignItems: 'flex-end',
  },
  rightActionContainer: {
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  actionButton: {
    width: 75,
    height: '80%',
    maxHeight: 90,
    minHeight: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    gap: 8,
  },
  editAction: {
    backgroundColor: '#4F7DF3',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  deleteAction: {
    backgroundColor: '#F87171',
    borderTopLeftRadius: 0, 
    borderBottomLeftRadius: 0,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SwipeableGoalItem; 