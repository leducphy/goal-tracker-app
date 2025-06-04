import { tokenStorage, LoginResponse, UserData } from './tokenStorage';

/**
 * User service for handling user data operations
 */
class UserService {
  /**
   * Save complete login response to storage
   */
  async saveLoginData(loginResponse: LoginResponse): Promise<void> {
    try {
      console.log('💾 Saving user login data to storage');
      await tokenStorage.setTokensFromLogin(loginResponse);
      console.log('✅ User login data saved successfully');
    } catch (error) {
      console.error('❌ Error saving user login data:', error);
      throw new Error('Failed to save user data');
    }
  }

  /**
   * Get current user data from storage
   */
  async getCurrentUser(): Promise<UserData | null> {
    try {
      return await tokenStorage.getUserData();
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  /**
   * Update user data in storage
   */
  async updateUserData(userData: Partial<UserData>): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        await tokenStorage.setUserData(updatedUser);
        console.log('✅ User data updated successfully');
      }
    } catch (error) {
      console.error('❌ Error updating user data:', error);
      throw new Error('Failed to update user data');
    }
  }

  /**
   * Clear all user data and tokens
   */
  async clearUserData(): Promise<void> {
    try {
      await tokenStorage.clearTokens();
      console.log('✅ User data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing user data:', error);
      throw new Error('Failed to clear user data');
    }
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const hasToken = await tokenStorage.hasValidToken();
      const userData = await this.getCurrentUser();
      return hasToken && userData !== null;
    } catch (error) {
      console.error('❌ Error checking login status:', error);
      return false;
    }
  }

  /**
   * Get user stats (placeholder - you can integrate with your actual stats API)
   */
  async getUserStats(): Promise<{
    completedGoals: number;
    totalGoals: number;
    currentStreak: number;
    joinedDate: string;
  }> {
    try {
      const user = await this.getCurrentUser();
      // For now, return mock data - you can replace with actual API calls
      return {
        completedGoals: 0,
        totalGoals: 0,
        currentStreak: 0,
        joinedDate: user ? new Date().toISOString() : new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error getting user stats:', error);
      return {
        completedGoals: 0,
        totalGoals: 0,
        currentStreak: 0,
        joinedDate: new Date().toISOString(),
      };
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService; 