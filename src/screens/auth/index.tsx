import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
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
import { ROUTES } from '../../constants/routes';
import { useAppContext } from '../../contexts/AppContext';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigation = useNavigation<LoginScreenNavigationProp>();
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

  const handleAuth = () => {
    // In a real app, you would verify credentials here
    if (isLogin) {
      navigation.navigate(ROUTES.MAIN);
      // Could show a success message
      // Alert.alert(t('loginSuccess'));
    } else {
      // Handle registration
      Alert.alert(
        t('registerSuccess'),
        t('accountCreatedSuccess'),
        [{ text: 'OK', onPress: () => setIsLogin(true) }]
      );
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
              {isLogin ? t('loginMessage') : t('registerMessage')}
            </Text>
          </View>
          
          <View style={styles.formContainer}>
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
                />
              </View>
            </View>
            
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>{t('confirmPassword')}</Text>
                <View style={[styles.inputWrapper, { 
                  borderColor: theme.colors.border, 
                  backgroundColor: theme.colors.card 
                }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder={t('confirmPassword')}
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry
                  />
                </View>
              </View>
            )}
            
            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                  {t('forgotPassword')}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.authButton, { backgroundColor: theme.colors.primary }]} 
              onPress={handleAuth}
            >
              <Text style={styles.authButtonText}>{isLogin ? t('login') : t('register')}</Text>
            </TouchableOpacity>
            
            <View style={styles.switchModeContainer}>
              <Text style={[styles.switchModeText, { color: theme.colors.textSecondary }]}>
                {isLogin ? t('noAccount') : t('hasAccount')}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={[styles.switchModeButton, { color: theme.colors.primary }]}>
                  {isLogin ? t('register') : t('login')}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                {t('orLoginWith')}
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>
            
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#4285F4' }]}
                onPress={() => handleSocialLogin('Google')}
              >
                <Ionicons name="logo-google" size={20} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#3b5998' }]}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <Ionicons name="logo-facebook" size={20} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#000000' }]}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Ionicons name="logo-apple" size={20} color="white" />
              </TouchableOpacity>
            </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    justifyContent: 'center',
  },
  languageToggleContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 24,
    zIndex: 10,
  },
  languageSwitch: {
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  activeLanguage: {
    borderRadius: 20,
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  languageText: {
    fontSize: 14,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 16,
  },
  appSubtitle: {
    fontSize: 15,
    marginTop: 6,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 4,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 22,
    marginTop: -8,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  authButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  switchModeText: {
    fontSize: 15,
  },
  switchModeButton: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default LoginScreen; 