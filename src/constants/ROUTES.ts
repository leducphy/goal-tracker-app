/**
 * Application routes constants
 */
export const ROUTES = {
  LOGIN: 'Login',
  MAIN: 'Main',
  
  // Tab routes
  OVERVIEW: 'Overview',
  GOALS: 'Goals',
  FINANCE: 'Finance',
  PROFILE: 'Profile',
  
  // Settings routes
  SETTINGS: 'Settings',
  ACCOUNT_INFO: 'AccountInfo',
  NOTIFICATIONS_SETTINGS: 'NotificationsSettings',
  
  // New screens
  CHECK_IN: 'CheckIn',
  STATS: 'Stats',

  // Goal screens
  LONG_TERM_GOALS: 'LongTermGoals',
  LONG_TERM_GOAL_DETAIL: 'LongTermGoalDetail',
  GOAL_GROUPS: 'GoalGroups',
  ACHIEVEMENTS: 'Achievements',
  CREATE_GOAL: 'CreateGoal',
  
  // Finance screens
  FINANCE_DASHBOARD: 'FinanceDashboard',
  ADD_TRANSACTION: 'AddTransaction',
  TRANSACTION_LIST: 'TransactionList',
  LOAN_MANAGEMENT: 'LoanManagement',
  ADD_LOAN: 'AddLoan',
  
  // Journal screens
  JOURNAL: 'Journal',
  NEW_JOURNAL_ENTRY: 'NewJournalEntry',
} as const;

export default ROUTES; 