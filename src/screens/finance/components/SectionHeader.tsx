import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  onLinkPress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  linkText, 
  onLinkPress 
}) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {linkText && (
        <TouchableOpacity onPress={onLinkPress}>
          <Text style={styles.sectionLink}>{linkText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionLink: {
    fontSize: 14,
    color: '#0070FF',
  },
});

export default SectionHeader; 