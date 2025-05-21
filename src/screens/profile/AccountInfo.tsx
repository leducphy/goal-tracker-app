import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

const AccountInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Mock user info
  const [name, setName] = useState('Minh');
  const [email, setEmail] = useState('minh@example.com');
  const [phone, setPhone] = useState('0912345678');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSave = () => {
    // Save account info logic here
    console.log({
      name,
      email,
      phone,
      currentPassword,
      newPassword,
      confirmPassword
    });
    
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('accountInfo')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>{t('updateAccountInfo')}</Text>
        
        {/* Name */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('fullName')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder={t('fullName')}
            placeholderTextColor={theme.colors.text + '80'}
          />
        </View>
        
        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('email')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder={t('enterEmail')}
            placeholderTextColor={theme.colors.text + '80'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        {/* Phone */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('phoneNumber')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={phone}
            onChangeText={setPhone}
            placeholder={t('phoneNumber')}
            placeholderTextColor={theme.colors.text + '80'}
            keyboardType="phone-pad"
          />
        </View>
        
        {/* Separator */}
        <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
        
        {/* Current Password */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('currentPassword')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.text + '80'}
            secureTextEntry
          />
        </View>
        
        {/* New Password */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('newPassword')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.text + '80'}
            secureTextEntry
          />
        </View>
        
        {/* Confirm Password */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('confirmPassword')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.text + '80'}
            secureTextEntry
          />
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  separator: {
    height: 1,
    marginVertical: 24,
  },
  saveButton: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default AccountInfoScreen; 