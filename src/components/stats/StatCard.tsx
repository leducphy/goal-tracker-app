import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import useTheme from '../../styles/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  onPress,
}) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textTertiary }]}>{subtitle}</Text>
      )}
    </TouchableOpacity>
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
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
});

export default StatCard; 