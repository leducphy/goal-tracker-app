import { GoogleAuthResult } from "../types/auth";
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app';

class GoogleAuthService {
  private isConfigured = false;
  private clientId: string | null = null;

  constructor() {
    this.configure();
  }

  private getClientIdFromConfig(): string | null {
    try {
      // Method 1: Get from Firebase app options (GoogleService-Info.plist / google-services.json)
      const app = firebase.app();
      const options = app.options;
      
      const firebaseClientId = options.ios?.clientId || options.android?.clientId || options.clientId;
      
      if (firebaseClientId) {
        console.log('✅ Found CLIENT_ID in Firebase config');
        return firebaseClientId;
      }

      // Method 2: Get from environment variables
      const envClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_WEB_CLIENT_ID;
      
      if (envClientId && envClientId !== 'your_google_client_id_here') {
        console.log('✅ Found CLIENT_ID in environment variables');
        return envClientId;
      }

      console.error('❌ No valid Google CLIENT_ID found in Firebase config or environment variables');
      return null;
      
    } catch (error) {
      console.error('❌ Error getting CLIENT_ID from config:', error);
      return null;
    }
  }

  private configure() {
    try {
      // Get CLIENT_ID from configuration sources
      this.clientId = this.getClientIdFromConfig();
      
      if (!this.clientId) {
        console.error('❌ Google Sign-In configuration failed: No CLIENT_ID available');
        console.log('💡 Please ensure:');
        console.log('   1. GoogleService-Info.plist contains CLIENT_ID');
        console.log('   2. Or set EXPO_PUBLIC_GOOGLE_CLIENT_ID in .env file');
        return;
      }

      console.log('🔐 Configuring Google Sign-In with CLIENT_ID from config');
      console.log('🔐 CLIENT_ID source: Firebase config file');

      GoogleSignin.configure({
        webClientId: this.clientId,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });

      this.isConfigured = true;
      console.log('✅ Google Sign-In configured successfully');
    } catch (error) {
      console.error('❌ Google Sign-In configuration error:', error);
      this.isConfigured = false;
    }
  }

  async signInWithGoogle(): Promise<GoogleAuthResult> {
    const startTime = Date.now();
    const sessionId = Math.random().toString(36).substring(7);
    
    try {
      console.log(`🔐 [${sessionId}] Starting Google Sign-In...`);
      
      if (!this.isConfigured || !this.clientId) {
        throw new Error('Google Sign-In is not properly configured. Please check your CLIENT_ID configuration.');
      }
      
      // Check if device supports Google Play Services (Android only)
      try {
        await GoogleSignin.hasPlayServices({ 
          showPlayServicesUpdateDialog: true
        });
      } catch (error: any) {
        if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
          throw new Error('Google Play Services not available on this device');
        } else if (error.code === 'PLAY_SERVICES_OUTDATED') {
          throw new Error('Google Play Services needs to be updated');
        }
        console.warn(`⚠️ [${sessionId}] Play Services check warning:`, error);
      }
      
      console.log(`🔐 [${sessionId}] Calling GoogleSignin.signIn()...`);
      
      // Get the user's ID token
      const signInResult = await GoogleSignin.signIn();
      console.log(`🔐 [${sessionId}] Google Sign-In Result received in ${Date.now() - startTime}ms`);

      // Check if user cancelled during the flow
      if (!signInResult || !signInResult.data) {
        console.log(`📱 [${sessionId}] User cancelled Google Sign-In (null result)`);
        return { type: 'cancel' };
      }

      // Get the ID token from the result
      const idToken = signInResult.data?.idToken;
      
      if (!idToken) {
        console.log(`📱 [${sessionId}] User cancelled Google Sign-In (no idToken)`);
        return { type: 'cancel' };
      }

      console.log(`🔐 [${sessionId}] Creating Firebase credential...`);

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential to Firebase
      let userCredential;
      try {
        userCredential = await auth().signInWithCredential(googleCredential);
      } catch (firebaseError: any) {
        console.error(`❌ [${sessionId}] Firebase Auth Error:`, firebaseError);
        if (firebaseError.code === 'auth/network-request-failed') {
          throw new Error('Network connection failed. Please check your internet connection.');
        } else if (firebaseError.code === 'auth/too-many-requests') {
          throw new Error('Too many failed attempts. Please try again later.');
        } else if (firebaseError.code === 'auth/user-disabled') {
          throw new Error('This account has been disabled. Please contact support.');
        }
        throw new Error(`Firebase authentication failed: ${firebaseError.message}`);
      }
      
      console.log(`✅ [${sessionId}] Firebase Auth successful: ${userCredential.user.email} in ${Date.now() - startTime}ms`);

      // Parse user information
      const userInfo = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userCredential.user.displayName || '',
        picture: userCredential.user.photoURL || undefined,
      };

      return {
        type: 'success',
        idToken,
        user: userInfo,
      };

    } catch (error: any) {
      console.error(`❌ [${sessionId}] Google Sign-In Error after ${Date.now() - startTime}ms:`, error);
      
      // Handle specific Google Sign-In error codes
      if (error.code === 'SIGN_IN_CANCELLED' || error.code === '12501') {
        console.log(`📱 [${sessionId}] User cancelled Google Sign-In (error code: ${error.code})`);
        return { type: 'cancel' };
      } else if (error.code === 'SIGN_IN_REQUIRED' || error.code === '4') {
        throw new Error('Google Sign-In is required but user is not signed in');
      } else if (error.code === 'NETWORK_ERROR' || error.code === '7') {
        throw new Error('Network error occurred during Google Sign-In');
      } else if (error.code === 'DEVELOPER_ERROR' || error.code === '10') {
        throw new Error('Google Sign-In configuration error');
      }
      
      // Re-throw the error if it's not a cancellation
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      console.log('🔓 Starting Google Sign-Out...');
      
      // Check if user is currently signed in
      const currentUser = await this.getCurrentUser();
      
      if (currentUser) {
        // Revoke access and sign out from Google
        await Promise.all([
          GoogleSignin.revokeAccess(),
          GoogleSignin.signOut()
        ]);
        console.log('✅ Google Sign-Out completed');
      } else {
        console.log('ℹ️ No Google user to sign out');
      }
      
      // Always sign out from Firebase
      await auth().signOut();
      console.log('✅ Firebase Sign-Out completed');
      
    } catch (error: any) {
      console.error('❌ Google Sign-Out Error:', error);
      
      // Try to sign out from Firebase even if Google sign-out fails
      try {
        await auth().signOut();
        console.log('✅ Firebase Sign-Out completed (fallback)');
      } catch (firebaseError) {
        console.error('❌ Firebase Sign-Out also failed:', firebaseError);
      }
      
      // Don't throw error for sign-out issues - log and continue
      console.warn('⚠️ Sign-out completed with warnings');
    }
  }

  async getCurrentUser() {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser;
    } catch (error) {
      console.log('No current Google user');
      return null;
    }
  }

  // Method to get Firebase configuration info (for debugging)
  getFirebaseConfig() {
    try {
      const app = firebase.app();
      const options = app.options;
      return {
        projectId: options.projectId,
        appId: options.appId,
        apiKey: options.apiKey ? `${options.apiKey.substring(0, 10)}...` : 'N/A', // Masked for security
        clientId: this.clientId ? `${this.clientId.substring(0, 20)}...` : 'N/A', // Masked for security
        isConfigured: this.isConfigured,
      };
    } catch (error) {
      console.error('❌ Error getting Firebase config:', error);
      return null;
    }
  }

  // Method to check if Google Sign-In is properly configured
  isGoogleSignInConfigured(): boolean {
    return this.isConfigured && !!this.clientId;
  }
}

export const googleAuthService = new GoogleAuthService();
