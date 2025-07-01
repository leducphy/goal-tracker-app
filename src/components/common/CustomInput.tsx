import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CustomInputProps extends TextInputProps {
  label: string;
  placeholder: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  error?: string;
  theme: any;
}

const CustomInput = forwardRef<TextInput, CustomInputProps>(
  ({ 
    label, 
    placeholder, 
    icon = 'person-outline', 
    secureTextEntry = false,
    showPasswordToggle = false,
    error,
    theme,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleFocus = () => {
      setIsFocused(true);
      props.onFocus?.(null as any);
    };

    const handleBlur = () => {
      setIsFocused(false);
      props.onBlur?.(null as any);
    };

    return (
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        <View style={[
          styles.inputWrapper, 
          { 
            borderColor: error 
              ? '#FF6B6B' 
              : isFocused 
                ? theme.colors.primary 
                : theme.colors.border, 
            backgroundColor: theme.colors.card,
            borderWidth: isFocused ? 2 : 1,
          }
        ]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={isFocused ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <TextInput
            ref={ref}
            style={[styles.input, { color: theme.colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry={showPasswordToggle ? !showPassword : secureTextEntry}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize={props.autoCapitalize || 'none'}
            autoCorrect={false}
            {...props}
          />
          {showPasswordToggle && (
            <TouchableOpacity 
              onPress={togglePasswordVisibility}
              style={styles.passwordToggle}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
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
  passwordToggle: {
    padding: 5,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

CustomInput.displayName = 'CustomInput';

export default CustomInput; 