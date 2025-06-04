import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES } from '../../constants/ROUTES';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { formatCurrency } from '../../utils/formatters';
import { FinancialGoalCard, SectionHeader, TransactionItem, type FinancialGoal, type Transaction } from './components';

const FinanceScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  // Mock data for financial goals
  const financialGoals: FinancialGoal[] = [
    {
      id: 1,
      title: 'Tiết kiệm mua xe',
      target: 200000000,
      current: 50000000,
      color: '#0070FF',
    },
    {
      id: 2,
      title: 'Du lịch châu Âu',
      target: 60000000,
      current: 35000000,
      color: '#FF9500',
    },
  ];

  // Mock data for recent transactions
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
  ];
  
  // Calculate total income, expense, and savings
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
    
  const totalExpense = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
    
  const savings = totalIncome - totalExpense;

  // Navigation handlers
  const handleNavigateToAddTransaction = () => {
    // @ts-ignore
    navigation.navigate(ROUTES.ADD_TRANSACTION);
  };

  const handleNavigateToLoanManagement = () => {
    // @ts-ignore
    navigation.navigate(ROUTES.LOAN_MANAGEMENT);
  };
  
  const handleViewAllTransactions = () => {
    // @ts-ignore
    navigation.navigate(ROUTES.TRANSACTION_LIST);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Card */}
        <View style={[styles.overviewCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.overviewTitle, { color: theme.colors.text }]}>{t('financeManagement')}</Text>
          <Text style={[styles.overviewSubtitle, { color: theme.colors.text + '80' }]}>{t('trackExpenseAndGoals')}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                {t('totalIncome')}
              </Text>
              <Text style={[styles.statValue, { color: '#4CD964' }]}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                {t('totalExpense')}
              </Text>
              <Text style={[styles.statValue, { color: '#FF3B30' }]}>
                {formatCurrency(totalExpense)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                {t('savings')}
              </Text>
              <Text style={[styles.statValue, { color: savings >= 0 ? '#4CD964' : '#FF3B30' }]}>
                {formatCurrency(savings)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
            onPress={handleNavigateToAddTransaction}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E1F5FE' }]}>
              <Ionicons name="add-circle" size={24} color="#0070FF" />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>{t('addTransaction')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
            onPress={handleNavigateToLoanManagement}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E0F8E6' }]}>
              <Ionicons name="cash" size={24} color="#4CD964" />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>{t('loanManagement')}</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Goals */}
        <SectionHeader 
          title={t('budget')} 
          linkText={t('seeAll')}
        />
        
        {financialGoals.map((goal) => (
          <FinancialGoalCard key={goal.id} goal={goal} />
        ))}

        {/* Recent Transactions */}
        <SectionHeader 
          title={t('recentTransactions')} 
          linkText={t('seeAll')}
          onLinkPress={handleViewAllTransactions}
        />
        
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
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
  overviewCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overviewSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FinanceScreen; 