import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  ColorValue,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';

import { RootStackParamList } from '../../App';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';
import { CustomInput } from '../../components/common';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('String');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Refs for input fields
  const fullNameRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, register } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const { language, setLanguage } = useAppContext();

  // Get gradient colors based on theme
  const getGradientColors = (): readonly [ColorValue, ColorValue, ColorValue, ColorValue] => {
    if (theme.colors.background === '#121212') {
      return ['#121212', '#1A1A2E', '#16213E', '#0F3460'];
    } else {
      return ['#F5F7FA', '#E4E8F0', '#D2E0FB', '#C0D8FF'];
    }
  };

  const handleAuth = async () => {
    if (isLogin) {
      if (!username || !password) {
        Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập và mật khẩu');
        return;
      }

      setIsLoading(true);
      try {
        await login({ username, password });
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert(
          'Đăng nhập thất bại',
          error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Registration validation
      if (!fullName || !username || !password) {
        Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }

      setIsLoading(true);
      try {
        await register({ fullName, username, password });
        Alert.alert(
          'Đăng ký thành công',
          'Tài khoản của bạn đã được tạo thành công! Vui lòng đăng nhập.',
          [{ text: 'OK', onPress: () => setIsLogin(true) }]
        );
        // Clear form after successful registration
        setFullName('');
        setUsername('');
        setPassword('');
      } catch (error) {
        console.error('Registration error:', error);
        Alert.alert(
          'Đăng ký thất bại',
          error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      t('passwordRecovery'),
      t('passwordResetInstructions'),
      [{ text: 'OK' }]
    );
  };

  const handleSocialLogin = (platform: string) => {
    Alert.alert(
      `${t('loginWithSocial')} ${platform}`,
      t('featureInDevelopment'),
      [{ text: 'OK' }]
    );
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear form when switching modes
    setFullName('');
    setUsername('');
    setPassword('');
  };

  const VI_FLAG = '🇻🇳';
  const EN_FLAG = '🇬🇧';

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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <StatusBar style={theme.colors.background === '#121212' ? 'light' : 'dark'} />
          
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
                    borderColor: theme.colors.border
                  }
                ]}
              >
                <TouchableOpacity 
                  style={[
                    styles.languageOption,
                    language === 'vi' && [styles.activeLanguage, { backgroundColor: theme.colors.primary + '20' }]
                  ]} 
                  onPress={() => setLanguage('vi')}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Text style={styles.flagEmoji}>{VI_FLAG}</Text>
                  <Text 
                    style={[
                      styles.languageText, 
                      language === 'vi' ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.textSecondary }
                    ]}
                  >
                    VI
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.languageOption,
                    language === 'en' && [styles.activeLanguage, { backgroundColor: theme.colors.primary + '20' }]
                  ]} 
                  onPress={() => setLanguage('en')}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Text style={styles.flagEmoji}>{EN_FLAG}</Text>
                  <Text 
                    style={[
                      styles.languageText, 
                      language === 'en' ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.textSecondary }
                    ]}
                  >
                    EN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.logoText}>GT</Text>
              </View>
              <Text style={[styles.appTitle, { color: theme.colors.primary }]}>{t('appName')}</Text>
              <Text style={[styles.appSubtitle, { color: theme.colors.textSecondary }]}>
                {isLogin ? t('loginMessage') : t('registerMessage')}
              </Text>
            </View>
            
            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Full Name Input (Register Mode) */}
              {!isLogin && (
                <CustomInput
                  ref={fullNameRef}
                  label={t('fullName')}
                  placeholder={t('enterFullName')}
                  icon="person-outline"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  editable={!isLoading}
                  theme={theme}
                  returnKeyType="next"
                  onSubmitEditing={() => usernameRef.current?.focus()}
                />
              )}

              {/* Username Input */}
              <CustomInput
                ref={usernameRef}
                label={t('username')}
                placeholder={t('enterUsername')}
                icon="person-outline"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isLoading}
                theme={theme}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              
              {/* Password Input */}
              <CustomInput
                ref={passwordRef}
                label={t('password')}
                placeholder={t('enterPassword')}
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                theme={theme}
                showPasswordToggle={true}
                returnKeyType="done"
                onSubmitEditing={handleAuth}
              />
              
              {/* Auth Button */}
              <TouchableOpacity
                style={[
                  styles.authButton, 
                  { 
                    backgroundColor: theme.colors.primary,
                    opacity: isLoading ? 0.7 : 1
                  }
                ]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={[styles.authButtonText, { marginLeft: 10 }]}>
                      {isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? t('login') : t('register')}
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
                  <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                    {t('forgotPassword')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Social Login Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                {t('orContinueWith')}
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>
            
            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }]}
                onPress={() => handleSocialLogin('Google')}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={20} color="#DB4437" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }]}
                onPress={() => handleSocialLogin('Facebook')}
                disabled={isLoading}
              >
                <Ionicons name="logo-facebook" size={20} color="#4267B2" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }]}
                onPress={() => handleSocialLogin('Apple')}
                disabled={isLoading}
              >
                <Ionicons name="logo-apple" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            {/* Mode Switch */}
            <View style={styles.switchModeContainer}>
              <Text style={[styles.switchModeText, { color: theme.colors.textSecondary }]}>
                {isLogin ? t('noAccount') : t('haveAccount')}
              </Text>
              <TouchableOpacity 
                onPress={toggleAuthMode}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.5 : 1 }}
              >
                <Text style={[styles.switchModeLink, { color: theme.colors.primary }]}>
                  {isLogin ? t('signUp') : t('signIn')}
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
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  languageSwitch: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  authButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 14,
    marginRight: 4,
  },
  switchModeLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen; 