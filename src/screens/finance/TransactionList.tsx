import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '../../constants/ROUTES';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { TransactionItem, type Transaction } from './components';

type TransactionFilter = 'all' | 'income' | 'expense';

const TransactionList: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for transactions
  const transactions: Transaction[] = [
    {
      id: 1,
      title: 'Tiết kiệm hàng tháng',
      amount: 5000000,
      date: '15/05/2023',
      type: 'income',
      category: 'Tiết kiệm',
      icon: 'save',
    },
    {
      id: 2,
      title: 'Mua sách TypeScript',
      amount: 350000,
      date: '12/05/2023',
      type: 'expense',
      category: 'Học tập',
      icon: 'book',
    },
    {
      id: 3,
      title: 'Lương tháng 5',
      amount: 15000000,
      date: '05/05/2023',
      type: 'income',
      category: 'Lương',
      icon: 'cash',
    },
    {
      id: 4,
      title: 'Tiền nhà tháng 5',
      amount: 4500000,
      date: '03/05/2023',
      type: 'expense',
      category: 'Nhà cửa',
      icon: 'home',
    },
    {
      id: 5,
      title: 'Đi ăn nhà hàng',
      amount: 750000,
      date: '02/05/2023',
      type: 'expense',
      category: 'Ăn uống',
      icon: 'restaurant',
    },
    {
      id: 6,
      title: 'Cà phê với đồng nghiệp',
      amount: 120000,
      date: '01/05/2023',
      type: 'expense',
      category: 'Cà phê',
      icon: 'cafe',
    },
    {
      id: 7,
      title: 'Thưởng dự án',
      amount: 3000000,
      date: '30/04/2023',
      type: 'income',
      category: 'Thưởng',
      icon: 'gift',
    },
    {
      id: 8,
      title: 'Mua quần áo',
      amount: 1200000,
      date: '28/04/2023',
      type: 'expense',
      category: 'Mua sắm',
      icon: 'basket',
    },
  ];
  
  // Filter transactions based on selected tab and search query
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filter !== 'all' && transaction.type !== filter) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.title.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  filteredTransactions.forEach(transaction => {
    if (!groupedTransactions[transaction.date]) {
      groupedTransactions[transaction.date] = [];
    }
    groupedTransactions[transaction.date].push(transaction);
  });
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('/').map(Number);
    const [dayB, monthB, yearB] = b.split('/').map(Number);
    
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    
    return dateB.getTime() - dateA.getTime();
  });
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handleAddTransaction = () => {
    // @ts-ignore
    navigation.navigate(ROUTES.ADD_TRANSACTION);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('recentTransactions')}</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddTransaction}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.colors.background }]}>
          <Ionicons name="search" size={20} color={theme.colors.text + '80'} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder={t('searchGroups')}
            placeholderTextColor={theme.colors.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text + '80'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={[styles.filterContainer, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity 
          style={[
            styles.filterTab, 
            filter === 'all' && [styles.activeFilterTab, { borderColor: theme.colors.primary }]
          ]}
          onPress={() => setFilter('all')}
        >
          <Text 
            style={[
              styles.filterTabText, 
              filter === 'all' && [styles.activeFilterTabText, { color: theme.colors.primary }]
            ]}
          >
            {t('all')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterTab, 
            filter === 'income' && [styles.activeFilterTab, { borderColor: theme.colors.primary }]
          ]}
          onPress={() => setFilter('income')}
        >
          <Text 
            style={[
              styles.filterTabText, 
              filter === 'income' && [styles.activeFilterTabText, { color: theme.colors.primary }]
            ]}
          >
            {t('incomeType')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterTab, 
            filter === 'expense' && [styles.activeFilterTab, { borderColor: theme.colors.primary }]
          ]}
          onPress={() => setFilter('expense')}
        >
          <Text 
            style={[
              styles.filterTabText, 
              filter === 'expense' && [styles.activeFilterTabText, { color: theme.colors.primary }]
            ]}
          >
            {t('expenseType')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {filteredTransactions.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="receipt-outline" size={48} color={theme.colors.text + '40'} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              {t('noGoals')}
            </Text>
          </View>
        ) : (
          sortedDates.map(date => (
            <View key={date} style={styles.dateSection}>
              <Text style={[styles.dateHeader, { color: theme.colors.text + '80' }]}>
                {date}
              </Text>
              
              {groupedTransactions[date].map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterTab: {
    borderColor: '#0070FF',
    backgroundColor: 'rgba(0, 112, 255, 0.05)',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#0070FF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
});

export default TransactionList; 