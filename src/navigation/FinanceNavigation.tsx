import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ROUTES } from '../constants/routes';
import FinanceScreen from '../screens/finance';
import AddLoan from '../screens/finance/AddLoan';
import AddTransaction from '../screens/finance/AddTransaction';
import LoanManagement from '../screens/finance/LoanManagement';
import TransactionList from '../screens/finance/TransactionList';
import useTheme from '../styles/theme';

const Stack = createStackNavigator();

const FinanceNavigation = () => {
  const theme = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name={ROUTES.FINANCE_DASHBOARD} component={FinanceScreen} />
      <Stack.Screen name={ROUTES.ADD_TRANSACTION} component={AddTransaction} />
      <Stack.Screen name={ROUTES.TRANSACTION_LIST} component={TransactionList} />
      <Stack.Screen name={ROUTES.LOAN_MANAGEMENT} component={LoanManagement} />
      <Stack.Screen name={ROUTES.ADD_LOAN} component={AddLoan} />
    </Stack.Navigator>
  );
};

export default FinanceNavigation; 