import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
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
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleLogin = () => {
    // In a real app, you would verify credentials here
    // For now, we just navigate to the Main screen
    navigation.navigate(ROUTES.MAIN);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.colors.card }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style={theme.colors.background === '#121212' ? 'light' : 'dark'} />
        <View style={styles.logoContainer}>
          <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.logoText}>GT</Text>
          </View>
          <Text style={[styles.appTitle, { color: theme.colors.primary }]}>{t('appName')}</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('email')}</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.colors.border, 
                backgroundColor: theme.colors.background,
                color: theme.colors.text
              }]}
              placeholder={t('enterEmail')}
              placeholderTextColor={theme.colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('password')}</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.colors.border, 
                backgroundColor: theme.colors.background,
                color: theme.colors.text
              }]}
              placeholder={t('enterPassword')}
              placeholderTextColor={theme.colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>{t('login')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0070FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0070FF',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#0070FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 