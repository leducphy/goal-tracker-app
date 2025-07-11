import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";

import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ColorValue,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLogin, useRegister, useGoogleLogin } from "../../hooks/useAuth";
import useTranslation from "../../i18n";
import useTheme from "../../styles/theme";
import { CustomInput } from "../../components/common";
import {
  LoginFormData,
  RegisterFormData,
  loginSchema,
  registerSchema,
} from "../../types/auth";
import { googleAuthService } from "../../services/googleAuth";
import { formatAuthError, logError } from "../../utils/errorUtils";

const LoginScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [googleSignInAttempts, setGoogleSignInAttempts] = useState<number>(0);
  const [lastGoogleSignInTime, setLastGoogleSignInTime] = useState<number>(0);

  const { t } = useTranslation();
  const theme = useTheme();
  const { language, setLanguage } = useAppContext();
  const { refreshUser } = useAuth();

  // React Query mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();

  // React Hook Form setup
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: __DEV__ ? "admin" : "",
      password: __DEV__ ? "String" : "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
    },
  });

  const currentForm = isLogin ? loginForm : registerForm;
  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    googleLoginMutation.isPending;

  // Get gradient colors based on theme
  const getGradientColors = (): readonly [
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
  ] => {
    if (theme.colors.background === "#121212") {
      return ["#121212", "#1A1A2E", "#16213E", "#0F3460"];
    } else {
      return ["#F5F7FA", "#E4E8F0", "#D2E0FB", "#C0D8FF"];
    }
  };

  const handleAuth = (data: LoginFormData | RegisterFormData) => {
    if (isLogin) {
      loginMutation.mutate(data as LoginFormData, {
        onSuccess: async () => {
          await refreshUser();
          console.log("✅ Login successful, AuthContext refreshed");
        },
        onError: (error) => {
          logError("LOGIN", error, {
            username: (data as LoginFormData).username,
          });
          const errorDetails = formatAuthError(error);
          Alert.alert(errorDetails.title, errorDetails.message, [
            { text: "OK" },
          ]);
        },
      });
    } else {
      registerMutation.mutate(data as RegisterFormData, {
        onSuccess: () => {
          Alert.alert(
            "Đăng ký thành công",
            "Tài khoản của bạn đã được tạo thành công! Vui lòng đăng nhập.",
            [{ text: "OK", onPress: () => setIsLogin(true) }]
          );
          registerForm.reset();
        },
        onError: (error) => {
          logError("REGISTER", error, {
            username: (data as RegisterFormData).username,
          });
          const errorDetails = formatAuthError(error);
          Alert.alert(errorDetails.title, errorDetails.message, [
            { text: "OK" },
          ]);
        },
      });
    }
  };

  const handleGoogleLogin = () => {
    const currentTime = Date.now();
    const timeSinceLastAttempt = currentTime - lastGoogleSignInTime;
    const DEBOUNCE_TIME = 2000; // 2 seconds

    // Prevent double tap - check if already loading
    if (googleLoginMutation.isPending) {
      console.log(
        "🔄 Google login already in progress, ignoring duplicate call"
      );
      return;
    }

    // Debounce protection - prevent rapid successive calls
    if (timeSinceLastAttempt < DEBOUNCE_TIME) {
      console.log(
        `⏱️ Google Sign-In debounced (${timeSinceLastAttempt}ms since last attempt, minimum ${DEBOUNCE_TIME}ms required)`
      );
      return;
    }

    // Check if Google Sign-In is properly configured
    if (!googleAuthService.isGoogleSignInConfigured()) {
      Alert.alert(
        "Cấu hình Google Sign-In",
        "Google Sign-In chưa được cấu hình đúng. Vui lòng kiểm tra file GoogleService-Info.plist hoặc biến môi trường.",
        [{ text: "OK" }]
      );
      return;
    }

    console.log("🔐 Initiating Google Sign-In...");

    // Update last attempt time
    setLastGoogleSignInTime(currentTime);

    // Track attempt
    const attemptNumber = googleSignInAttempts + 1;
    setGoogleSignInAttempts(attemptNumber);
    console.log(`🔢 Google Sign-In attempt #${attemptNumber}`);

    googleLoginMutation.mutate(undefined, {
      onSuccess: async (result) => {
        console.log("🔐 Google Sign-In mutation completed:", result.type);

        if (result.type === "success") {
          // Refresh AuthContext to update authentication state
          await refreshUser();
          console.log("✅ Google login successful, AuthContext refreshed");
          // Reset attempts on success
          setGoogleSignInAttempts(0);
        } else if (result.type === "cancel") {
          // Service already provides detailed cancel logging with session ID
          // Just log if this happens multiple times quickly
          if (attemptNumber > 1) {
            console.warn(
              `⚠️ Multiple Google Sign-In cancellations detected (${attemptNumber} times)`
            );
          }
        }
      },
      onError: (error) => {
        console.log(
          `❌ Google Sign-In mutation error occurred (attempt #${attemptNumber})`
        );
        logError("GOOGLE_LOGIN", error, { attempt: attemptNumber });
        const errorDetails = formatAuthError(error);
        Alert.alert(errorDetails.title, errorDetails.message, [{ text: "OK" }]);
      },
    });
  };

  const handleForgotPassword = () => {
    Alert.alert(t("passwordRecovery"), t("passwordResetInstructions"), [
      { text: "OK" },
    ]);
  };

  const handleSocialLogin = (platform: string) => {
    if (platform === "Google") {
      handleGoogleLogin();
    } else {
      Alert.alert(
        `${t("loginWithSocial")} ${platform}`,
        t("featureInDevelopment"),
        [{ text: "OK" }]
      );
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset forms when switching modes
    loginForm.reset();
    registerForm.reset();
  };

  const VI_FLAG = "🇻🇳";
  const EN_FLAG = "🇬🇧";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          style={styles.innerContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <StatusBar
            style={theme.colors.background === "#121212" ? "light" : "dark"}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Language Toggle */}
            <View style={styles.languageToggleContainer}>
              <View
                style={[
                  styles.languageSwitch,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "vi" && [
                      styles.activeLanguage,
                      { backgroundColor: theme.colors.primary + "20" },
                    ],
                  ]}
                  onPress={() => setLanguage("vi")}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Text style={styles.flagEmoji}>{VI_FLAG}</Text>
                  <Text
                    style={[
                      styles.languageText,
                      language === "vi"
                        ? { color: theme.colors.primary, fontWeight: "bold" }
                        : { color: theme.colors.textSecondary },
                    ]}
                  >
                    VI
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "en" && [
                      styles.activeLanguage,
                      { backgroundColor: theme.colors.primary + "20" },
                    ],
                  ]}
                  onPress={() => setLanguage("en")}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Text style={styles.flagEmoji}>{EN_FLAG}</Text>
                  <Text
                    style={[
                      styles.languageText,
                      language === "en"
                        ? { color: theme.colors.primary, fontWeight: "bold" }
                        : { color: theme.colors.textSecondary },
                    ]}
                  >
                    EN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View
                style={[
                  styles.logoPlaceholder,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.logoText}>GT</Text>
              </View>
              <Text style={[styles.appTitle, { color: theme.colors.primary }]}>
                {t("appName")}
              </Text>
              <Text
                style={[
                  styles.appSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {isLogin ? t("loginMessage") : t("registerMessage")}
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Full Name Input (Register Mode) */}
              {!isLogin && (
                <Controller
                  control={registerForm.control}
                  name="fullName"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <CustomInput
                      label={t("fullName")}
                      placeholder={t("enterFullName")}
                      icon="person-outline"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      editable={!isLoading}
                      theme={theme}
                      returnKeyType="next"
                      error={error?.message}
                    />
                  )}
                />
              )}

              {/* Username Input */}
              {isLogin ? (
                <Controller
                  control={loginForm.control}
                  name="username"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <CustomInput
                      label={t("username")}
                      placeholder={t("enterUsername")}
                      icon="person-outline"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      editable={!isLoading}
                      theme={theme}
                      returnKeyType="next"
                      error={error?.message}
                    />
                  )}
                />
              ) : (
                <Controller
                  control={registerForm.control}
                  name="username"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <CustomInput
                      label={t("username")}
                      placeholder={t("enterUsername")}
                      icon="person-outline"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      editable={!isLoading}
                      theme={theme}
                      returnKeyType="next"
                      error={error?.message}
                    />
                  )}
                />
              )}

              {/* Password Input */}
              {isLogin ? (
                <Controller
                  control={loginForm.control}
                  name="password"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <CustomInput
                      label={t("password")}
                      placeholder={t("enterPassword")}
                      icon="lock-closed-outline"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      theme={theme}
                      showPasswordToggle={true}
                      returnKeyType="done"
                      error={error?.message}
                      onSubmitEditing={loginForm.handleSubmit(handleAuth)}
                    />
                  )}
                />
              ) : (
                <Controller
                  control={registerForm.control}
                  name="password"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <CustomInput
                      label={t("password")}
                      placeholder={t("enterPassword")}
                      icon="lock-closed-outline"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      theme={theme}
                      showPasswordToggle={true}
                      returnKeyType="done"
                      error={error?.message}
                      onSubmitEditing={registerForm.handleSubmit(handleAuth)}
                    />
                  )}
                />
              )}

              {/* Auth Button */}
              <TouchableOpacity
                style={[
                  styles.authButton,
                  {
                    backgroundColor: theme.colors.primary,
                    opacity: isLoading ? 0.7 : 1,
                  },
                ]}
                onPress={currentForm.handleSubmit(handleAuth)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={[styles.authButtonText, { marginLeft: 10 }]}>
                      {isLogin ? "Đang đăng nhập..." : "Đang đăng ký..."}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? t("login") : t("register")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Forgot Password */}
              {isLogin && (
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  <Text
                    style={[
                      styles.forgotPasswordText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {t("forgotPassword")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Social Login Divider */}
            <View style={styles.dividerContainer}>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t("orContinueWith")}
              </Text>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    opacity: isLoading ? 0.6 : 1,
                  },
                ]}
                onPress={() => handleSocialLogin("Google")}
                disabled={isLoading}
              >
                {googleLoginMutation.isPending ? (
                  <ActivityIndicator size="small" color="#DB4437" />
                ) : (
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    opacity: isLoading ? 0.6 : 1,
                  },
                ]}
                onPress={() => handleSocialLogin("Facebook")}
                disabled={isLoading}
              >
                <Ionicons name="logo-facebook" size={20} color="#4267B2" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    opacity: isLoading ? 0.6 : 1,
                  },
                ]}
                onPress={() => handleSocialLogin("Apple")}
                disabled={isLoading}
              >
                <Ionicons
                  name="logo-apple"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>

            {/* Mode Switch */}
            <View style={styles.switchModeContainer}>
              <Text
                style={[
                  styles.switchModeText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {isLogin ? t("noAccount") : t("haveAccount")}
              </Text>
              <TouchableOpacity
                onPress={toggleAuthMode}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.5 : 1 }}
              >
                <Text
                  style={[
                    styles.switchModeLink,
                    { color: theme.colors.primary },
                  ]}
                >
                  {isLogin ? t("signUp") : t("signIn")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  languageToggleContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  languageSwitch: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeLanguage: {
    borderRadius: 18,
    margin: 2,
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  languageText: {
    fontSize: 12,
    fontWeight: "500",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 30,
  },
  authButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  authButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  switchModeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchModeText: {
    fontSize: 14,
    marginRight: 4,
  },
  switchModeLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;
