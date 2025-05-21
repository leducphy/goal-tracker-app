import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import useTheme from '../../styles/theme';

interface GoalProgressCardProps {
  title: string;
  completed: number;
  total: number;
  percentage: number;
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  title,
  completed,
  total,
  percentage,
}) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.percentage, { color: theme.colors.primary }]}>{percentage}%</Text>
      </View>
      
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Hoàn thành {completed}/{total} mục tiêu
      </Text>
      
      <View style={[styles.progressContainer, { backgroundColor: theme.colors.borderLight }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${percentage}%`,
              backgroundColor: theme.colors.primary 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

export default GoalProgressCard; 