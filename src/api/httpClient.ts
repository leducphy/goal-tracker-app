import { API_CONFIG, API_HEADERS, API_STATUS_CODES, API_ERROR_MESSAGES } from '../constants/API_CONSTANTS';
import { tokenStorage } from '../utils/tokenStorage';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export class HttpError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    console.log('🌐 HTTP Client initialized with base URL:', this.baseURL);
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await tokenStorage.getAccessToken();
    const headers: Record<string, string> = { ...API_HEADERS };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const errorMessage = this.getErrorMessage(response.status, data);
      throw new HttpError(errorMessage, response.status, data);
    }

    return {
      data,
      message: data?.message || 'Success',
      status: response.status,
      success: true,
    };
  }

  private getErrorMessage(status: number, data: any): string {
    // Try to get error message from response data first
    if (data?.message) {
      return data.message;
    }

    // Fallback to status code based messages
    switch (status) {
      case API_STATUS_CODES.BAD_REQUEST:
        return data?.error || 'Yêu cầu không hợp lệ';
      case API_STATUS_CODES.UNAUTHORIZED:
        return API_ERROR_MESSAGES.UNAUTHORIZED;
      case API_STATUS_CODES.FORBIDDEN:
        return API_ERROR_MESSAGES.FORBIDDEN;
      case API_STATUS_CODES.NOT_FOUND:
        return API_ERROR_MESSAGES.NOT_FOUND;
      case API_STATUS_CODES.VALIDATION_ERROR:
        return API_ERROR_MESSAGES.VALIDATION_ERROR;
      case API_STATUS_CODES.TOO_MANY_REQUESTS:
        return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
      case API_STATUS_CODES.INTERNAL_SERVER_ERROR:
        return API_ERROR_MESSAGES.SERVER_ERROR;
      case API_STATUS_CODES.SERVICE_UNAVAILABLE:
        return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
      default:
        return API_ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    console.log('🌐 HTTP Request:', {
      method: options.method || 'GET',
      url,
      headers: { ...headers, Authorization: headers.Authorization ? '[TOKEN]' : undefined },
      body: options.body ? JSON.parse(options.body as string) : undefined,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await this.handleResponse<T>(response);
      
      console.log('✅ HTTP Response:', {
        status: result.status,
        success: result.success,
        message: result.message,
      });

      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpError) {
        console.error('❌ HTTP Error:', {
          status: error.status,
          message: error.message,
          details: error.details,
        });
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('⏰ Request Timeout:', url);
          throw new HttpError(API_ERROR_MESSAGES.TIMEOUT_ERROR, 408);
        }
        
        console.error('🚫 Network Error:', error.message);
        throw new HttpError(API_ERROR_MESSAGES.NETWORK_ERROR, 0);
      }

      console.error('🔥 Unknown Error:', error);
      throw new HttpError(API_ERROR_MESSAGES.UNKNOWN_ERROR, 500);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.makeRequest<T>(url, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload file with form data
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await tokenStorage.getAccessToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData, let the browser set it

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout * 2); // Longer timeout for uploads

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof HttpError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new HttpError(API_ERROR_MESSAGES.TIMEOUT_ERROR, 408);
      }
      
      throw new HttpError(API_ERROR_MESSAGES.NETWORK_ERROR, 0);
    }
  }
}

export const httpClient = new HttpClient(); 