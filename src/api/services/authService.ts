import { API_CONFIG, API_HEADERS } from '../../constants/api';
import { tokenStorage, UserData } from '../../utils/tokenStorage';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserData;
  access_token: string;
  refresh_token: string;
  access_token_expire: number;
  refresh_token_expire: number;
}

class AuthService {
  private baseURL = API_CONFIG.BASE_URL;

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(credentials),
      });

      console.log('🔐 Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Login failed: ${response.status} - ${errorData}`);
      }

      const data: LoginResponse = await response.json();
      console.log('🔐 Login successful for user:', data.user.email);

      // Store token and user data securely
      await tokenStorage.setAccessToken(data.access_token);
      await tokenStorage.setUserData(data.user);

      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out...');
      await tokenStorage.clearAll();
      console.log('🚪 Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return await tokenStorage.hasValidToken();
  }

  async getCurrentUser(): Promise<UserData | null> {
    return await tokenStorage.getUserData();
  }

  async getAuthHeader(): Promise<{ Authorization: string } | {}> {
    const token = await tokenStorage.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService(); 