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
  SOCIAL: 'Social',
  PROFILE: 'Profile',
  
  // Settings routes
  SETTINGS: 'Settings',
  ACCOUNT_INFO: 'AccountInfo',
  NOTIFICATIONS_SETTINGS: 'NotificationsSettings',
  
  // New screens
  CHECK_IN: 'CheckIn',
  STATS: 'Stats',

  // Goal screens
  LONG_TERM: 'LongTerm',
  MEDIUM_TERM: 'MediumTerm',
  MEDIUM_TERM_GOAL_DETAIL: 'MediumTermGoalDetail',
  GOAL_GROUPS: 'GoalGroups',
  ACHIEVEMENTS: 'Achievements',
  CREATE_GOAL: 'CreateGoal',
  MEDIUM_GOAL_FORM: 'MediumGoalForm',
  
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