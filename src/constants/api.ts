// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://192.168.2.59:8080/api/v1'  // Development: Android emulator
    : 'https://api.goaltracker.com/api/v1',  // Production
  TIMEOUT: __DEV__ ? 10000 : 15000,
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/authenticate',
    
    // Goals endpoints
    DAILY_GOALS: '/goals/daily',
  },
};

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'accept': '*/*',
}; 