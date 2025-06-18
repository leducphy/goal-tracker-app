//@ts-ignore
import { API_BASE_URL } from '@env';
/**
 * API Configuration Constants
 */

export const API_CONFIG = {
  BASE_URL: API_BASE_URL, // Updated to match actual API
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/authenticate',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    
    // Goal endpoints
    GOALS: '/goals',
    DAILY_GOALS: '/goals/daily',
    LONG_TERM: '/goals/long-term',
    MEDIUM_TERM: '/goals/medium-term',
    SHORT_TERM_GOALS: '/goals/short-term',
    GOAL_DETAIL: '/goals/:id',
    CREATE_GOAL: '/goals',
    UPDATE_GOAL: '/goals/:id',
    DELETE_GOAL: '/goals/:id',
    
    // User endpoints
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    
    // Achievement endpoints
    ACHIEVEMENTS: '/achievements',
    USER_ACHIEVEMENTS: '/achievements/user',
    
    // Group endpoints
    GOAL_GROUPS: '/groups',
    JOIN_GROUP: '/groups/:id/join',
    LEAVE_GROUP: '/groups/:id/leave',
    
    // Finance endpoints
    TRANSACTIONS: '/finance/transactions',
    SAVINGS_GOALS: '/finance/savings',
    BUDGETS: '/finance/budgets',
    
    // Stats endpoints
    PROGRESS_STATS: '/stats/progress',
    GOAL_ANALYTICS: '/stats/goals',
    
    // Journal endpoints
    JOURNAL_ENTRIES: '/journal',
    CREATE_ENTRY: '/journal',
    
    // Check-in endpoints
    DAILY_CHECKIN: '/checkin/daily',
    CHECKIN_HISTORY: '/checkin/history',
  },
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

export const API_STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
  TIMEOUT_ERROR: 'Yêu cầu bị hết thời gian chờ. Vui lòng thử lại.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
} as const;

// Helper function to build endpoint URLs
export const buildEndpoint = (endpoint: string, params: Record<string, string | number> = {}) => {
  let url = endpoint;
  
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  
  return url;
};

// Helper function to build query string
export const buildQueryString = (params: Record<string, any> = {}) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}; 