import * as SecureStore from 'expo-secure-store';

export interface UserData {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
  created_at?: string;
}

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_DATA: 'user_data',
} as const;

class TokenStorage {
  // Access Token methods
  async setAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Error storing access token:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // User Data methods
  async setUserData(userData: UserData): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const userData = await SecureStore.getItemAsync(KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Utility methods
  async hasValidToken(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      return !!token;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(KEYS.USER_DATA),
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export const tokenStorage = new TokenStorage(); 