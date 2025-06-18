import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../constants/API_CONSTANTS';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'goal_tracker_access_token',
  REFRESH_TOKEN: 'goal_tracker_refresh_token',
  TOKEN_EXPIRY: 'goal_tracker_token_expiry',
  REFRESH_TOKEN_EXPIRY: 'goal_tracker_refresh_token_expiry',
  USER_DATA: 'goal_tracker_user_data',
} as const;

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp
  refreshExpiresAt: number; // timestamp
}

export interface UserData {
  image?: string;
  email: string;
  role: string;
  full_name: string;
}

export interface LoginResponse {
  user: UserData;
  access_token: string;
  refresh_token: string;
  access_token_expire: number;
  refresh_token_expire: number;
}

class TokenStorage {
  async getAccessToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
      
      // Check if token exists
      if (!token) {
        return null;
      }
      
      // Check if token is expired or will expire soon (30 seconds buffer)
      const expiryTime = await this.getTokenExpiry();
      if (expiryTime && Date.now() + 30000 >= expiryTime) {
        console.log('🔑 Access token expired or expiring soon, attempting refresh...');
        
        // Try to refresh token
        const refreshed = await this.refreshTokenIfExpired();
        if (refreshed) {
          return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
        } else {
          await this.clearTokens();
          return null;
        }
      }
      
      return token;
    } catch (error) {
      console.error('❌ Error getting access token:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('❌ Error getting refresh token:', error);
      return null;
    }
  }

  async getTokenExpiry(): Promise<number | null> {
    try {
      const expiry = await SecureStore.getItemAsync(TOKEN_KEYS.TOKEN_EXPIRY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      console.error('❌ Error getting token expiry:', error);
      return null;
    }
  }

  async getRefreshTokenExpiry(): Promise<number | null> {
    try {
      const expiry = await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN_EXPIRY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      console.error('❌ Error getting refresh token expiry:', error);
      return null;
    }
  }

  async setTokensFromLogin(loginResponse: LoginResponse): Promise<void> {
    try {
      console.log('🔑 Storing login tokens securely');
      
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, loginResponse.access_token),
        SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, loginResponse.refresh_token),
        SecureStore.setItemAsync(TOKEN_KEYS.TOKEN_EXPIRY, loginResponse.access_token_expire.toString()),
        SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN_EXPIRY, loginResponse.refresh_token_expire.toString()),
        SecureStore.setItemAsync(TOKEN_KEYS.USER_DATA, JSON.stringify(loginResponse.user)),
      ]);
      
      console.log('✅ Login tokens and user data stored securely');
    } catch (error) {
      console.error('❌ Error storing login data:', error);
      throw error;
    }
  }

  async setTokens(tokenData: TokenData): Promise<void> {
    try {
      console.log('🔑 Storing tokens securely');
      
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, tokenData.accessToken),
        SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, tokenData.refreshToken),
        SecureStore.setItemAsync(TOKEN_KEYS.TOKEN_EXPIRY, tokenData.expiresAt.toString()),
        SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN_EXPIRY, tokenData.refreshExpiresAt.toString()),
      ]);
      
      console.log('✅ Tokens stored securely');
    } catch (error) {
      console.error('❌ Error storing tokens:', error);
      throw error;
    }
  }

  async setAccessToken(token: string, expiresIn?: number): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, token);
      
      if (expiresIn) {
        const expiryTime = Date.now() + (expiresIn * 1000); // Convert seconds to milliseconds
        await SecureStore.setItemAsync(TOKEN_KEYS.TOKEN_EXPIRY, expiryTime.toString());
      }
      
      console.log('✅ Access token updated');
    } catch (error) {
      console.error('❌ Error setting access token:', error);
      throw error;
    }
  }

  async setUserData(userData: UserData): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEYS.USER_DATA, JSON.stringify(userData));
      console.log('✅ User data stored');
    } catch (error) {
      console.error('❌ Error storing user data:', error);
      throw error;
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const userData = await SecureStore.getItemAsync(TOKEN_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      console.log('🗑️ Clearing stored tokens and user data');
      
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(TOKEN_KEYS.TOKEN_EXPIRY),
        SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN_EXPIRY),
        SecureStore.deleteItemAsync(TOKEN_KEYS.USER_DATA),
      ]);
      
      console.log('✅ All data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing tokens:', error);
      throw error;
    }
  }

  async hasValidToken(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
      if (!token) return false;
      
      const expiryTime = await this.getTokenExpiry();
      if (!expiryTime) return true; // If no expiry set, assume valid
      
      // Check if token expires in the next 5 minutes
      const fiveMinutes = 5 * 60 * 1000;
      const isValid = Date.now() < (expiryTime - fiveMinutes);
      
      if (!isValid) {
        console.log('🔄 Token expires soon, checking refresh...');
        return await this.refreshTokenIfExpired();
      }
      
      return isValid;
    } catch (error) {
      console.error('❌ Error checking token validity:', error);
      return false;
    }
  }

  async isTokenValid(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      if (!token) return false;
      
      const expiryTime = await this.getTokenExpiry();
      if (!expiryTime) return true; // If no expiry set, assume valid
      
      return Date.now() < expiryTime;
    } catch (error) {
      console.error('❌ Error checking token validity:', error);
      return false;
    }
  }

  async getTokenTimeRemaining(): Promise<number> {
    try {
      const expiryTime = await this.getTokenExpiry();
      if (!expiryTime) return Infinity;
      
      const timeRemaining = expiryTime - Date.now();
      return Math.max(0, timeRemaining);
    } catch (error) {
      console.error('❌ Error getting token time remaining:', error);
      return 0;
    }
  }

  async refreshTokenIfExpired(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        console.log('❌ No refresh token available');
        return false;
      }

      const refreshExpiry = await this.getRefreshTokenExpiry();
      if (refreshExpiry && Date.now() >= refreshExpiry) {
        console.log('❌ Refresh token expired');
        await this.clearTokens();
        return false;
      }

      console.log('🔄 Attempting to refresh access token...');
      
      // Call refresh endpoint using API constants
      const refreshUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`;
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log('🔄 Refresh token response:', response);
      console.log('🔄 Refresh token response status:', refreshUrl);
      if (response.ok) {
        const data = await response.json();
        
        console.log('✅ Token refresh response:', data);
        
        // Update access token
        await Promise.all([
          SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, data.access_token),
          SecureStore.setItemAsync(TOKEN_KEYS.TOKEN_EXPIRY, data.access_token_expire.toString()),
        ]);
        
        // Update refresh token if provided
        if (data.refresh_token) {
          await Promise.all([
            SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, data.refresh_token),
            SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN_EXPIRY, data.refresh_token_expire.toString()),
          ]);
        }
        
        // Update user data if provided
        if (data.user) {
          await this.setUserData(data.user);
        }
        
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        console.log('❌ Token refresh failed');
        await this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      await this.clearTokens();
      return false;
    }
  }

  async refreshTokenIfNeeded(): Promise<boolean> {
    try {
      const timeRemaining = await this.getTokenTimeRemaining();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      // If token expires in less than 5 minutes, try to refresh
      if (timeRemaining < fiveMinutes) {
        return await this.refreshTokenIfExpired();
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error checking if token refresh is needed:', error);
      return false;
    }
  }

  // Utility methods for debugging
  async getTokenInfo(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    hasUserData: boolean;
    expiresAt: number | null;
    refreshExpiresAt: number | null;
    isValid: boolean;
    timeRemaining: number;
  }> {
    try {
      const [accessToken, refreshToken, userData, expiryTime, refreshExpiryTime, isValid, timeRemaining] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN),
        this.getUserData(),
        this.getTokenExpiry(),
        this.getRefreshTokenExpiry(),
        this.isTokenValid(),
        this.getTokenTimeRemaining(),
      ]);

      return {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData,
        expiresAt: expiryTime,
        refreshExpiresAt: refreshExpiryTime,
        isValid,
        timeRemaining,
      };
    } catch (error) {
      console.error('❌ Error getting token info:', error);
      return {
        hasAccessToken: false,
        hasRefreshToken: false,
        hasUserData: false,
        expiresAt: null,
        refreshExpiresAt: null,
        isValid: false,
        timeRemaining: 0,
      };
    }
  }

  async logTokenStatus(): Promise<void> {
    const info = await this.getTokenInfo();
    
    console.log('🔑 Token Status:', {
      ...info,
      expiresAt: info.expiresAt ? new Date(info.expiresAt).toISOString() : null,
      refreshExpiresAt: info.refreshExpiresAt ? new Date(info.refreshExpiresAt).toISOString() : null,
      timeRemainingMinutes: Math.round(info.timeRemaining / (1000 * 60)),
    });
  }
}

export const tokenStorage = new TokenStorage(); 