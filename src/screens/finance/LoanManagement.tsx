import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '../../constants/ROUTES';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { formatCurrency } from '../../utils/formatters';
import { SectionHeader } from './components';

type Loan = {
  id: number;
  name: string;
  amount: number;
  type: 'borrow' | 'lend';
  person: string;
  date: string;
  dueDate: string;
  interestRate: number;
  isCompleted: boolean;
  category: string;
};

type LoanTab = 'all' | 'borrow' | 'lend';
type StatusTab = 'all' | 'incomplete' | 'completed';

const LoanManagement: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [loanTab, setLoanTab] = useState<LoanTab>('all');
  const [statusTab, setStatusTab] = useState<StatusTab>('all');
  
  // Mock loans data
  const loans: Loan[] = [
    {
      id: 1,
      name: 'Vay mua xe',
      amount: 50000000,
      type: 'borrow',
      person: 'Ngân hàng VCB',
      date: '12/01/2023',
      dueDate: '12/01/2025',
      interestRate: 7.5,
      isCompleted: false,
      category: 'personal'
    },
    {
      id: 2,
      name: 'Cho anh Minh vay',
      amount: 5000000,
      type: 'lend',
      person: 'Minh Nguyễn',
      date: '23/02/2023',
      dueDate: '23/05/2023',
      interestRate: 0,
      isCompleted: true,
      category: 'personal'
    },
    {
      id: 3,
      name: 'Vay tiền học phí',
      amount: 15000000,
      type: 'borrow',
      person: 'Ba mẹ',
      date: '05/03/2023',
      dueDate: '05/03/2024',
      interestRate: 0,
      isCompleted: false,
      category: 'education'
    },
    {
      id: 4,
      name: 'Cho em Linh vay',
      amount: 2000000,
      type: 'lend',
      person: 'Linh Trần',
      date: '17/04/2023',
      dueDate: '17/07/2023',
      interestRate: 0,
      isCompleted: false,
      category: 'personal'
    },
  ];
  
  // Filter loans based on selected tabs
  const filteredLoans = loans.filter(loan => {
    if (loanTab !== 'all' && loan.type !== loanTab) return false;
    if (statusTab !== 'all' && 
        (statusTab === 'completed' ? !loan.isCompleted : loan.isCompleted)) return false;
    return true;
  });
  
  // Calculate totals
  const totalBorrow = loans
    .filter(loan => loan.type === 'borrow' && !loan.isCompleted)
    .reduce((sum, loan) => sum + loan.amount, 0);
    
  const totalLend = loans
    .filter(loan => loan.type === 'lend' && !loan.isCompleted)
    .reduce((sum, loan) => sum + loan.amount, 0);
    
  const balance = totalLend - totalBorrow;
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handleAddLoan = () => {
    // @ts-ignore
    navigation.navigate(ROUTES.ADD_LOAN);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('loanManagement')}</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddLoan}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>{t('trackLoans')}</Text>
        
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text + '80' }]}>{t('totalBorrow')}</Text>
              <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>{formatCurrency(totalBorrow)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text + '80' }]}>{t('totalLend')}</Text>
              <Text style={[styles.summaryValue, { color: '#4CD964' }]}>{formatCurrency(totalLend)}</Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <View style={styles.balanceContainer}>
            <Text style={[styles.balanceLabel, { color: theme.colors.text + '80' }]}>{t('balance')}</Text>
            <Text 
              style={[
                styles.balanceValue, 
                { color: balance >= 0 ? '#4CD964' : '#FF3B30' }
              ]}
            >
              {formatCurrency(Math.abs(balance))}
            </Text>
            {balance !== 0 && (
              <Text style={[styles.balanceNote, { color: theme.colors.text }]}>
                {balance > 0 ? t('youReceiveMore') : 'Bạn còn nợ nhiều hơn'}
              </Text>
            )}
          </View>
        </View>
        
        {/* Loan List Section */}
        <SectionHeader 
          title={t('loanList')} 
        />
        
        <Text style={[styles.subtitle, { color: theme.colors.text, marginBottom: 16 }]}>
          {t('manageYourLoans')}
        </Text>
        
        {/* Loan Type Filter */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              loanTab === 'all' && [styles.activeTab, { borderColor: theme.colors.primary }]
            ]}
            onPress={() => setLoanTab('all')}
          >
            <Text 
              style={[
                styles.tabText, 
                loanTab === 'all' && [styles.activeTabText, { color: theme.colors.primary }]
              ]}
            >
              {t('allLoans')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              loanTab === 'borrow' && [styles.activeTab, { borderColor: theme.colors.primary }]
            ]}
            onPress={() => setLoanTab('borrow')}
          >
            <Text 
              style={[
                styles.tabText, 
                loanTab === 'borrow' && [styles.activeTabText, { color: theme.colors.primary }]
              ]}
            >
              {t('borrowing')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              loanTab === 'lend' && [styles.activeTab, { borderColor: theme.colors.primary }]
            ]}
            onPress={() => setLoanTab('lend')}
          >
            <Text 
              style={[
                styles.tabText, 
                loanTab === 'lend' && [styles.activeTabText, { color: theme.colors.primary }]
              ]}
            >
              {t('lending')}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Status Filter */}
        <View style={[styles.tabContainer, { marginBottom: 20 }]}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              statusTab === 'all' && [styles.activeTab, { borderColor: theme.colors.primary }]
            ]}
            onPress={() => setStatusTab('all')}
          >
            <Text 
              style={[
                styles.tabText, 
                statusTab === 'all' && [styles.activeTabText, { color: theme.colors.primary }]
              ]}
            >
              {t('allLoans')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              statusTab === 'incomplete' && [styles.activeTab, { borderColor: theme.colors.primary }]
            ]}
            onPress={() => setStatusTab('incomplete')}
          >
            <Text 
              style={[
                styles.tabText, 
                statusTab === 'incomplete' && [styles.activeTabText, { color: theme.colors.primary }]
              ]}
            >
              {t('incompleteLoan')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              statusTab === 'completed' && [styles.activeTab, { borderColor: theme.colors.primary }]
            ]}
            onPress={() => setStatusTab('completed')}
          >
            <Text 
              style={[
                styles.tabText, 
                statusTab === 'completed' && [styles.activeTabText, { color: theme.colors.primary }]
              ]}
            >
              {t('completedLoan')}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Loan List */}
        {filteredLoans.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="cash-outline" size={48} color={theme.colors.text + '40'} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>{t('noLoans')}</Text>
          </View>
        ) : (
          filteredLoans.map(loan => (
            <View 
              key={loan.id} 
              style={[styles.loanItem, { backgroundColor: theme.colors.card }]}
            >
              <View style={styles.loanHeader}>
                <View style={styles.loanTitleContainer}>
                  <View style={[
                    styles.loanTypeTag, 
                    { backgroundColor: loan.type === 'lend' ? '#E1F5FE' : '#FFF0F0' }
                  ]}>
                    <Text style={{ 
                      color: loan.type === 'lend' ? '#0070FF' : '#FF3B30',
                      fontSize: 12,
                      fontWeight: '500',
                    }}>
                      {loan.type === 'lend' ? t('lending') : t('borrowing')}
                    </Text>
                  </View>
                  <Text style={[styles.loanName, { color: theme.colors.text }]}>{loan.name}</Text>
                </View>
                {loan.isCompleted && (
                  <View style={[styles.completedTag, { backgroundColor: '#E0F8E6' }]}>
                    <Text style={{ color: '#4CD964', fontSize: 12 }}>{t('completedStatus')}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.loanDetails}>
                <View style={styles.loanDetailItem}>
                  <Text style={[styles.loanDetailLabel, { color: theme.colors.text + '80' }]}>
                    {t('amount')}
                  </Text>
                  <Text style={[styles.loanDetailValue, { color: theme.colors.text }]}>
                    {formatCurrency(loan.amount)}
                  </Text>
                </View>
                
                <View style={styles.loanDetailItem}>
                  <Text style={[styles.loanDetailLabel, { color: theme.colors.text + '80' }]}>
                    {t('relatedPerson')}
                  </Text>
                  <Text style={[styles.loanDetailValue, { color: theme.colors.text }]}>
                    {loan.person}
                  </Text>
                </View>
              </View>
              
              <View style={styles.loanDates}>
                <Text style={{ color: theme.colors.text + '60', fontSize: 13 }}>
                  {t('creationDate')}: {loan.date}
                </Text>
                <Text style={{ color: theme.colors.text + '60', fontSize: 13 }}>
                  {t('dueDateLoan')}: {loan.dueDate}
                </Text>
              </View>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceNote: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeTab: {
    borderColor: '#0070FF',
    backgroundColor: 'rgba(0, 112, 255, 0.05)',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#0070FF',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  loanItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loanTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  loanName: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  loanDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  loanDetailItem: {
    flex: 1,
  },
  loanDetailLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  loanDetailValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  loanDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LoanManagement; 