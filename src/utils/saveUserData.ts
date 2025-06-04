import { userService } from './userService';
import { LoginResponse } from './tokenStorage';

/**
 * Save user data from API response to storage
 * This function can be called after successful login/registration
 */
export const saveUserDataFromAPI = async (apiResponse: LoginResponse): Promise<void> => {
  try {
    console.log('🔐 Saving user data from API response...');
    console.log('📋 API Response:', apiResponse);
    
    await userService.saveLoginData(apiResponse);
    
    console.log('✅ User data saved successfully!');
    console.log('👤 User:', apiResponse.user);
    console.log('🎫 Token expires at:', new Date(apiResponse.access_token_expire));
    console.log('🔄 Refresh token expires at:', new Date(apiResponse.refresh_token_expire));
  } catch (error) {
    console.error('❌ Failed to save user data:', error);
    throw error;
  }
};

/**
 * Quick function to save the specific API response provided by the user
 */
export const saveCurrentUserData = async (): Promise<void> => {
  const apiResponse: LoginResponse = {
    user: {
      image: "a",
      email: "leducphi1952002@gmail.com",
      role: "ADMIN",
      full_name: "string"
    },
    access_token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsZWR1Y3BoaTE5NTIwMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ5MDU2OTI5LCJleHAiOjE3NDkxNDMzMjl9.owmkz48TTgUZeTHKGZbbiSwelW2e49Z4MAjMQQUibC8",
    refresh_token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsZWR1Y3BoaTE5NTIwMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ5MDU2OTI5LCJleHAiOjE3NDk2NjE3Mjl9.sxSXyUMzy_f5HEmc2fPSUhbFFZPRpyTog8rEkECQ8uE",
    access_token_expire: 1749143329379,
    refresh_token_expire: 1749661729379
  };

  await saveUserDataFromAPI(apiResponse);
}; 