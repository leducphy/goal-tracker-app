import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { calculatePercentage, formatCurrency } from '../../../utils/formatters';

export interface FinancialGoal {
  id: number;
  title: string;
  target: number;
  current: number;
  color: string;
}

interface FinancialGoalCardProps {
  goal: FinancialGoal;
}

const FinancialGoalCard: React.FC<FinancialGoalCardProps> = ({ goal }) => {
  const percentage = calculatePercentage(goal.current, goal.target);
  
  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={styles.goalPercentage}>{percentage}%</Text>
      </View>
      
      <View style={styles.goalAmounts}>
        <Text style={styles.goalCurrentAmount}>{formatCurrency(goal.current)}</Text>
        <Text style={styles.goalTargetAmount}>{formatCurrency(goal.target)}</Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar,
            { width: `${percentage}%`, backgroundColor: goal.color }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  goalCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  goalPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0070FF',
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalCurrentAmount: {
    fontSize: 14,
    color: '#333',
  },
  goalTargetAmount: {
    fontSize: 14,
    color: '#999',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});

export default FinancialGoalCard; 