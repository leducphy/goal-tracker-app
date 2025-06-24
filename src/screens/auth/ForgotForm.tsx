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

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, typeof ROUTES.FORGOT_PASSWORD>;

const ForgotForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetSent, setResetSent] = useState<boolean>(false);
  const [awaitingOtp, setAwaitingOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
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

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email đã đăng ký');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      
      console.log('✅ Gửi yêu cầu quên mật khẩu thành công');
      
      // Switch to OTP verification mode
      setAwaitingOtp(true);
      Alert.alert(
        'Yêu cầu thành công',
        'Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra và nhập mã để đặt lại mật khẩu.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Lỗi quên mật khẩu:', error);
      Alert.alert(
        'Yêu cầu thất bại',
        error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetWithOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP hợp lệ');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        otp,
        newPassword
      });
      
      console.log('✅ Đặt lại mật khẩu thành công:', response.data);
      
      setResetSent(true);
      Alert.alert(
        'Thành công',
        'Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập bằng mật khẩu mới.',
        [{ 
          text: 'Đăng nhập', 
          onPress: () => navigation.navigate(ROUTES.LOGIN)
        }]
      );
    } catch (error) {
      console.error('❌ Lỗi đặt lại mật khẩu:', error);
      Alert.alert(
        'Đặt lại mật khẩu thất bại',
        error instanceof Error ? error.message : 'Mã OTP không chính xác hoặc đã hết hạn.',
        [{ text: 'Thử lại' }]
      );
    } finally {
      setIsLoading(false);
    }
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            
            <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.logoText}>GT</Text>
            </View>
            <Text style={[styles.appTitle, { color: theme.colors.primary }]}>{t('forgotPassword')}</Text>
            <Text style={[styles.appSubtitle, { color: theme.colors.textSecondary }]}>
              {awaitingOtp ? 'Đặt lại mật khẩu' : t('enterEmailToReset')}
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            {!awaitingOtp ? (
              // Email request form
              <>
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
                
                <TouchableOpacity
                  style={[
                    styles.authButton, 
                    { 
                      backgroundColor: theme.colors.primary,
                      opacity: isLoading ? 0.7 : 1
                    }
                  ]}
                  onPress={handlePasswordReset}
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
                      {t('resetPassword')}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              // OTP verification and new password form
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

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Mật khẩu mới</Text>
                  <View style={[styles.inputWrapper, { 
                    borderColor: theme.colors.border, 
                    backgroundColor: theme.colors.card 
                  }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Nhập mật khẩu mới"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Xác nhận mật khẩu</Text>
                  <View style={[styles.inputWrapper, { 
                    borderColor: theme.colors.border, 
                    backgroundColor: theme.colors.card 
                  }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Nhập lại mật khẩu mới"
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
                  onPress={handleResetWithOtp}
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
                      Đặt lại mật khẩu
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handlePasswordReset}
                  disabled={isLoading}
                >
                  <Text style={[styles.resendButtonText, { color: theme.colors.primary }]}>
                    Gửi lại mã OTP
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          
          {resetSent && (
            <View style={styles.resetSentContainer}>
              <Ionicons name="checkmark-circle" size={50} color={theme.colors.primary} />
              <Text style={[styles.resetSentTitle, { color: theme.colors.primary }]}>
                {t('checkYourEmail')}
              </Text>
              <Text style={[styles.resetSentText, { color: theme.colors.textSecondary }]}>
                {t('resetInstructionsSent')}
              </Text>
            </View>
          )}
          
          <View style={styles.switchModeContainer}>
            <Text style={[styles.switchModeText, { color: theme.colors.textSecondary }]}>
              {t('rememberedPassword')}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <Text style={[styles.switchModeLink, { color: theme.colors.primary }]}>
                {t('backToLogin')}
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
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
    borderRadius: 20,
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
    position: 'relative',
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
  resetSentContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  resetSentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  resetSentText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
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

export default ForgotForm; 