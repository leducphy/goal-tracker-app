import { GoogleAuthResult } from "../types/auth";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import firebase from "@react-native-firebase/app";
import { authService } from "../api/services/authService";

/**
 * Google Authentication Service
 * Handles Google Sign-In integration with Firebase Authentication
 */
class GoogleAuthService {
  private isConfigured = false;
  private clientId: string | null = null;

  constructor() {
    this.configure();
  }

  /**
   * Retrieves Google Client ID from Firebase configuration
   */
  private getClientIdFromConfig(): string | null {
    try {
      const app = firebase.app();
      const options = app.options;

      const firebaseClientId =
        options.ios?.clientId || options.android?.clientId || options.clientId;

      if (firebaseClientId) {
        console.log("✅ Google Client ID found in Firebase config");
        return firebaseClientId;
      }

      console.error("❌ No valid Google Client ID found in Firebase config");
      return null;
    } catch (error) {
      console.error("❌ Error getting Client ID from Firebase config:", error);
      return null;
    }
  }

  /**
   * Configures Google Sign-In with Firebase client ID
   */
  private configure() {
    try {
      this.clientId = this.getClientIdFromConfig();

      if (!this.clientId) {
        console.error(
          "❌ Google Sign-In configuration failed: No Client ID available"
        );
        console.log(
          "💡 Please ensure GoogleService-Info.plist (iOS) or google-services.json (Android) contains CLIENT_ID"
        );
        return;
      }

      GoogleSignin.configure({
        webClientId: this.clientId,
        offlineAccess: true,
        hostedDomain: "",
        forceCodeForRefreshToken: true,
      });

      this.isConfigured = true;
      console.log("✅ Google Sign-In configured successfully");
    } catch (error) {
      console.error("❌ Google Sign-In configuration error:", error);
      this.isConfigured = false;
    }
  }

  /**
   * Performs Google Sign-In flow
   * @returns Promise<GoogleAuthResult> - Result of the authentication attempt
   */
  async signInWithGoogle(): Promise<GoogleAuthResult> {
    try {
      console.log("🔐 Starting Google Sign-In...");

      if (!this.isConfigured || !this.clientId) {
        throw new Error(
          "Google Sign-In is not properly configured. Please check your Client ID configuration."
        );
      }

      // Check Google Play Services availability (Android only)
      try {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      } catch (error: any) {
        if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
          throw new Error("Google Play Services not available on this device");
        } else if (error.code === "PLAY_SERVICES_OUTDATED") {
          throw new Error("Google Play Services needs to be updated");
        }
        // Continue for other non-critical Play Services warnings
      }

      // Initiate Google Sign-In
      const signInResult = await GoogleSignin.signIn();

      // Check if user cancelled the sign-in process
      if (!signInResult || !signInResult.data || !signInResult.data.idToken) {
        console.log("📱 User cancelled Google Sign-In");
        return { type: "cancel" };
      }

      const idToken = signInResult.data.idToken;

      // Create Firebase credential and authenticate
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      let userCredential;

      try {
        userCredential = await auth().signInWithCredential(googleCredential);
      } catch (firebaseError: any) {
        console.error("❌ Firebase Authentication Error:", firebaseError);

        // Handle specific Firebase errors
        if (firebaseError.code === "auth/network-request-failed") {
          throw new Error(
            "Network connection failed. Please check your internet connection."
          );
        } else if (firebaseError.code === "auth/too-many-requests") {
          throw new Error("Too many failed attempts. Please try again later.");
        } else if (firebaseError.code === "auth/user-disabled") {
          throw new Error(
            "This account has been disabled. Please contact support."
          );
        }

        throw new Error(
          `Firebase authentication failed: ${firebaseError.message}`
        );
      }

      console.log(
        `✅ Firebase Authentication successful: ${userCredential.user.email}`
      );

      // Get Firebase ID token for backend authentication
      const firebaseIdToken = await userCredential.user.getIdToken();

      // Authenticate with backend
      try {
        const apiResponse = await authService.googleLogin(firebaseIdToken);
        console.log("✅ Backend authentication successful");

        // Return user info from backend response
        const userInfo = {
          id: userCredential.user.uid,
          email: apiResponse.data.user.email,
          name: apiResponse.data.user.full_name,
          picture: apiResponse.data.user.image,
        };

        return {
          type: "success",
          idToken: firebaseIdToken,
          user: userInfo,
        };
      } catch (apiError: any) {
        console.error("❌ Backend authentication failed:", apiError);

        // Fallback to Firebase user info if backend authentication fails
        console.log("⚠️ Using Firebase user info as fallback");

        const userInfo = {
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
          name: userCredential.user.displayName || "",
          picture: userCredential.user.photoURL || undefined,
        };

        return {
          type: "success",
          idToken: firebaseIdToken,
          user: userInfo,
        };
      }
    } catch (error: any) {
      console.error("❌ Google Sign-In Error:", error);

      // Handle specific Google Sign-In error codes
      if (error.code === "SIGN_IN_CANCELLED" || error.code === "12501") {
        console.log("📱 User cancelled Google Sign-In");
        return { type: "cancel" };
      } else if (error.code === "SIGN_IN_REQUIRED" || error.code === "4") {
        throw new Error("Google Sign-In is required but user is not signed in");
      } else if (error.code === "NETWORK_ERROR" || error.code === "7") {
        throw new Error("Network error occurred during Google Sign-In");
      } else if (error.code === "DEVELOPER_ERROR" || error.code === "10") {
        throw new Error("Google Sign-In configuration error");
      }

      throw error;
    }
  }

  /**
   * Signs out from Google and Firebase
   */
  async signOut(): Promise<void> {
    try {
      console.log("🔓 Starting Google Sign-Out...");

      // Check if user is currently signed in to Google
      const currentUser = await this.getCurrentUser();

      if (currentUser) {
        await Promise.all([
          GoogleSignin.revokeAccess(),
          GoogleSignin.signOut(),
        ]);
        console.log("✅ Google Sign-Out completed");
      }

      // Always sign out from Firebase
      await auth().signOut();
      console.log("✅ Firebase Sign-Out completed");
    } catch (error: any) {
      console.error("❌ Google Sign-Out Error:", error);

      // Ensure Firebase sign-out even if Google sign-out fails
      try {
        await auth().signOut();
        console.log("✅ Firebase Sign-Out completed (fallback)");
      } catch (firebaseError) {
        console.error("❌ Firebase Sign-Out also failed:", firebaseError);
      }

      console.warn("⚠️ Sign-out completed with warnings");
    }
  }

  /**
   * Gets current Google user if signed in
   */
  async getCurrentUser() {
    try {
      return await GoogleSignin.getCurrentUser();
    } catch (error) {
      return null;
    }
  }

  /**
   * Gets Firebase configuration info for debugging
   */
  getFirebaseConfig() {
    try {
      const app = firebase.app();
      const options = app.options;

      return {
        projectId: options.projectId,
        appId: options.appId,
        apiKey: options.apiKey
          ? `${options.apiKey.substring(0, 10)}...`
          : "N/A",
        clientId: this.clientId
          ? `${this.clientId.substring(0, 20)}...`
          : "N/A",
        isConfigured: this.isConfigured,
      };
    } catch (error) {
      console.error("❌ Error getting Firebase config:", error);
      return null;
    }
  }

  /**
   * Checks if Google Sign-In is properly configured
   */
  isGoogleSignInConfigured(): boolean {
    return this.isConfigured && !!this.clientId;
  }
}

export const googleAuthService = new GoogleAuthService();
