import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  visible, 
  onHide, 
  duration = 3000 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#4CAF50',
          icon: 'checkmark-circle' as const,
          color: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: '#F44336',
          icon: 'close-circle' as const,
          color: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: '#FF9800',
          icon: 'warning' as const,
          color: '#FFFFFF',
        };
      case 'info':
        return {
          backgroundColor: '#2196F3',
          icon: 'information-circle' as const,
          color: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: '#333333',
          icon: 'information-circle' as const,
          color: '#FFFFFF',
        };
    }
  };

  if (!visible) return null;

  const config = getToastConfig(type);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons 
          name={config.icon} 
          size={20} 
          color={config.color} 
          style={styles.icon}
        />
        <Text style={[styles.message, { color: config.color }]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
});

export default Toast; 