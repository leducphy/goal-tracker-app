import { httpClient, ApiResponse } from '../httpClient';
import { API_CONFIG } from '../../constants/API_CONSTANTS';
import { tokenStorage, LoginResponse, UserData } from '../../utils/tokenStorage';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  password: string;
}

export interface RefreshTokenResponse {
  user: UserData;
  access_token: string;
  refresh_token: string;
  access_token_expire: number;
  refresh_token_expire: number;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log('🔐 Attempting login for:', credentials.username);
      
      const loginUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`;
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify(credentials),
      });

      //log url
      console.log('🔐 Login URL:', loginUrl);

      console.log('🔐 Login response status:', response.status);

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      console.log('🔐 Login successful for user:', data.user.email);
      console.log('🔐 Login response data:', data);
      console.log('🔐 Login response data access_token:', data.access_token);
      console.log('🔐 Login response data refresh_token:', data.refresh_token);
      console.log('🔐 Login response data access_token_expire:', data.access_token_expire);
      console.log('🔐 Login response data refresh_token_expire:', data.refresh_token_expire);

      // Store tokens and user data securely
      await tokenStorage.setTokensFromLogin(data);

      return {
        data,
        message: 'Login successful',
        status: response.status,
        success: true,
      };

    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<any>> {
    try {
      console.log('📝 Attempting registration for:', userData.username);
      
      const registerUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`;
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify(userData),
      });

      console.log('📝 Register URL:', registerUrl);
      console.log('📝 Register response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Registration successful for user:', userData.username);

      return {
        data,
        message: 'Registration successful',
        status: response.status,
        success: true,
      };

    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    try {
      console.log('🔄 Attempting to refresh token...');
      
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`;
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log('🔄 Refresh URL:', refreshUrl);

      if (!response.ok) {
        console.log('❌ Token refresh failed, clearing tokens');
        await tokenStorage.clearTokens();
        throw new Error(`Token refresh failed with status: ${response.status}`);
      }

      const data: RefreshTokenResponse = await response.json();
      console.log('✅ Token refresh successful');
      console.log('✅ Refresh response data:', data);

      // Update stored tokens and user data
      await tokenStorage.setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.access_token_expire,
        refreshExpiresAt: data.refresh_token_expire,
      });

      // Update user data if available
      if (data.user) {
        await tokenStorage.setUserData(data.user);
      }

      return {
        data,
        message: 'Token refreshed successfully',
        status: response.status,
        success: true,
      };

    } catch (error) {
      console.error('❌ Token refresh error:', error);
      await tokenStorage.clearTokens();
      throw error;
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      console.log('🔐 Logging out...');
      
      // Try to call logout endpoint if we have a valid token
      const token = await tokenStorage.getAccessToken();
      if (token) {
        try {
          await httpClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
        } catch (error) {
          console.warn('⚠️ Logout endpoint failed, continuing with local cleanup');
        }
      }

      // Clear local storage
      await tokenStorage.clearTokens();
      
      console.log('✅ Logout successful');

      return {
        data: undefined,
        message: 'Logout successful',
        status: 200,
        success: true,
      };

    } catch (error) {
      console.error('❌ Logout error:', error);
      // Always clear tokens even if logout fails
      await tokenStorage.clearTokens();
      throw error;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserData>> {
    try {
      const userData = await tokenStorage.getUserData();
      
      if (!userData) {
        throw new Error('No user data found');
      }

      return {
        data: userData,
        message: 'User data retrieved',
        status: 200,
        success: true,
      };

    } catch (error) {
      console.error('❌ Error getting current user:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const hasValidToken = await tokenStorage.hasValidToken();
      const userData = await tokenStorage.getUserData();
      
      return hasValidToken && !!userData;
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      return false;
    }
  }

  async checkAuthStatus(): Promise<{
    isAuthenticated: boolean;
    user: UserData | null;
    tokenInfo: any;
  }> {
    try {
      const [isAuth, userData, tokenInfo] = await Promise.all([
        this.isAuthenticated(),
        tokenStorage.getUserData(),
        tokenStorage.getTokenInfo(),
      ]);

      return {
        isAuthenticated: isAuth,
        user: userData,
        tokenInfo,
      };
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      return {
        isAuthenticated: false,
        user: null,
        tokenInfo: null,
      };
    }
  }

  async updateProfile(profileData: Partial<UserData>): Promise<ApiResponse<UserData>> {
    try {
      console.log('👤 Updating user profile...');
      
      const response = await httpClient.put<UserData>(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, profileData);
      
      // Update local user data
      const currentUser = await tokenStorage.getUserData();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...profileData };
        await tokenStorage.setUserData(updatedUser);
      }

      console.log('✅ Profile updated successfully');
      return response;

    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  }

  // Utility method to get fresh access token (handles refresh automatically)
  async getValidAccessToken(): Promise<string | null> {
    return await tokenStorage.getAccessToken();
  }

  // Debug method
  async logAuthStatus(): Promise<void> {
    const status = await this.checkAuthStatus();
    console.log('🔐 Auth Status:', {
      isAuthenticated: status.isAuthenticated,
      userEmail: status.user?.email,
      tokenInfo: status.tokenInfo,
    });
  }
}

export const authService = new AuthService(); 