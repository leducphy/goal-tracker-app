import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import useTheme from '../../styles/theme';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onAction,
}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {actionText && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionText: {
    fontSize: 14,
  },
});

export default SectionHeader; 