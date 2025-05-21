import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatCurrency } from '../../../utils/formatters';

type IconName = keyof typeof Ionicons.glyphMap;

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  icon: IconName;
}

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIconContainer, { backgroundColor: transaction.type === 'income' ? '#E1F5FE' : '#FFF0F0' }]}>
        <Ionicons 
          name={transaction.icon} 
          size={20} 
          color={transaction.type === 'income' ? '#0070FF' : '#FF3B30'} 
        />
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionCategory}>{transaction.category} • {transaction.date}</Text>
      </View>
      
      <Text 
        style={[
          styles.transactionAmount,
          { color: transaction.type === 'income' ? '#4CD964' : '#FF3B30' }
        ]}
      >
        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 13,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default TransactionItem; 