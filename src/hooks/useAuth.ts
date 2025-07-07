import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginRequest, RegisterRequest } from '../api/services/authService';
import { googleAuthService } from '../services/googleAuth';
import { LoginFormData, RegisterFormData } from '../types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await authService.login(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await authService.register(data);
      return response.data;
    },
    onError: (error) => {
      console.error('Register mutation error:', error);
    },
  });
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const result = await googleAuthService.signInWithGoogle();
      
      if (result.type === 'success' && result.user) {
        console.log('✅ Google login successful:', result.user);
        return result;
      } else if (result.type === 'cancel') {
        // Service already logs the cancel with session ID, no need to duplicate
        return result;
      } else {
        throw new Error('Google login failed - no user data received');
      }
    },
    onSuccess: (result) => {
      if (result.type === 'success') {
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    },
    onError: (error) => {
      console.error('Google login mutation error:', error);
    },
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Logout from both Google and your backend
      await googleAuthService.signOut();
      const response = await authService.logout();
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout mutation error:', error);
    },
  });
}; 