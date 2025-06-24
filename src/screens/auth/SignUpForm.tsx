import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
  View
} from 'react-native';

import { RootStackParamList } from '../../App';
import { authService } from '../../api/services/authService';
import { API_CONFIG } from '../../constants/API_CONSTANTS';
import { ROUTES } from '../../constants/ROUTES';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, typeof ROUTES.SIGNUP>;

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [awaitingOtp, setAwaitingOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { login } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const { language, setLanguage } = useAppContext();

  // Get gradient colors based on theme
  const getGradientColors = (): readonly [ColorValue, ColorValue, ColorValue, ColorValue] => {
    if (theme.colors.background === '#121212') {
      // Dark theme
      return ['#121212', '#1A1A2E', '#16213E', '#0F3460'];
    } else {
      // Light theme
      return ['#F5F7FA', '#E4E8F0', '#D2E0FB', '#C0D8FF'];
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        fullName,
        email,
        password
      });
      
      console.log('✅ Đăng ký thành công, đang chờ xác thực OTP:', response.data);
      
      // Switch to OTP verification mode
      setAwaitingOtp(true);
      Alert.alert(
        'Đăng ký thành công',
        'Vui lòng kiểm tra email và nhập mã OTP để xác thực tài khoản',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Lỗi đăng ký:', error);
      Alert.alert(
        'Đăng ký thất bại',
        error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({
        email,
        otp
      });
      
      console.log('✅ Xác thực OTP thành công:', response.data);
      
      Alert.alert(
        'Xác thực thành công',
        'Tài khoản của bạn đã được kích hoạt thành công. Bạn có thể đăng nhập ngay bây giờ.',
        [{ 
          text: 'Đăng nhập', 
          onPress: () => navigation.navigate(ROUTES.LOGIN)
        }]
      );
    } catch (error) {
      console.error('❌ Lỗi xác thực OTP:', error);
      Alert.alert(
        'Xác thực thất bại',
        error instanceof Error ? error.message : 'Mã OTP không chính xác hoặc đã hết hạn.',
        [{ text: 'Thử lại' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    Alert.alert(
      `${t('loginWithSocial')} ${platform}`,
      t('featureInDevelopment'),
      [{ text: 'OK' }]
    );
  };

  // Flag emoji constants
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
        >
          <StatusBar style={theme.colors.background === '#121212' ? 'light' : 'dark'} />
          
          {/* Language switch with flags */}
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
          
          <View style={styles.logoContainer}>
            <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.logoText}>GT</Text>
            </View>
            <Text style={[styles.appTitle, { color: theme.colors.primary }]}>{t('appName')}</Text>
            <Text style={[styles.appSubtitle, { color: theme.colors.textSecondary }]}>
              {awaitingOtp ? 'Xác thực tài khoản' : t('registerMessage')}
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            {!awaitingOtp ? (
              // Registration form
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>{t('fullName')}</Text>
                  <View style={[styles.inputWrapper, { 
                    borderColor: theme.colors.border, 
                    backgroundColor: theme.colors.card 
                  }]}>
                    <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Nhập họ và tên"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>{t('email')}</Text>
                  <View style={[styles.inputWrapper, { 
                    borderColor: theme.colors.border, 
                    backgroundColor: theme.colors.card 
                  }]}>
                    <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder={t('enterEmail')}
                      placeholderTextColor={theme.colors.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>{t('password')}</Text>
                  <View style={[styles.inputWrapper, { 
                    borderColor: theme.colors.border, 
                    backgroundColor: theme.colors.card 
                  }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder={t('enterPassword')}
                      placeholderTextColor={theme.colors.textSecondary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>{t('confirmPassword')}</Text>
                  <View style={[styles.inputWrapper, { 
                    borderColor: theme.colors.border, 
                    backgroundColor: theme.colors.card 
                  }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Nhập lại mật khẩu"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.authButton, 
                    { 
                      backgroundColor: theme.colors.primary,
                      opacity: isLoading ? 0.7 : 1
                    }
                  ]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={[styles.authButtonText, { marginLeft: 10 }]}>
                        Đang xử lý...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.authButtonText}>
                      {t('register')}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              // OTP verification form
              <>
                <View style={styles.otpInfoContainer}>
                  <Ionicons name="mail" size={40} color={theme.colors.primary} />
                  <Text style={[styles.otpInfoText, { color: theme.colors.text }]}>
                    Chúng tôi đã gửi mã xác thực đến
                  </Text>
                  <Text style={[styles.otpEmailText, { color: theme.colors.primary }]}>
                    {email}
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Mã OTP</Text>
                  <View style={[styles.inputWrapper, { 
                    borderColor: theme.colors.border, 
                    backgroundColor: theme.colors.card 
                  }]}>
                    <Ionicons name="key-outline" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Nhập mã OTP"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="numeric"
                      maxLength={6}
                      editable={!isLoading}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.authButton, 
                    { 
                      backgroundColor: theme.colors.primary,
                      opacity: isLoading ? 0.7 : 1
                    }
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={[styles.authButtonText, { marginLeft: 10 }]}>
                        Đang xử lý...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.authButtonText}>
                      Xác thực
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  <Text style={[styles.resendButtonText, { color: theme.colors.primary }]}>
                    Gửi lại mã OTP
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          
          {!awaitingOtp && (
            <>
              <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                  {t('orContinueWith')}
                </Text>
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              </View>
              
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
            </>
          )}
          
          <View style={styles.switchModeContainer}>
            <Text style={[styles.switchModeText, { color: theme.colors.textSecondary }]}>
              {t('haveAccount')}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <Text style={[styles.switchModeLink, { color: theme.colors.primary }]}>
                {t('signIn')}
              </Text>
            </TouchableOpacity>
          </View>
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
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
    marginTop: 'auto',
  },
  switchModeText: {
    fontSize: 14,
    marginRight: 4,
  },
  switchModeLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  otpInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  otpInfoText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  otpEmailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  resendButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  }
});

export default SignUpForm; 