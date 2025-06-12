import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  color: string;
  bgColor?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  progress,
  color,
  bgColor = 'rgba(0,0,0,0.1)',
  children,
  style
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const halfSize = size / 2;
  
  useEffect(() => {
    // Animation when progress changes
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
    
    // Update the stroke dash offset when animation value changes
    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const strokeDashoffset = circumference - (circumference * v.value);
        circleRef.current.setNativeProps({
          strokeDashoffset
        });
      }
    });
    
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [progress]);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${halfSize}, ${halfSize}`}>
          {/* Background Circle */}
          <Circle
            cx={halfSize}
            cy={halfSize}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <Circle
            ref={circleRef}
            cx={halfSize}
            cy={halfSize}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * progress)}
          />
        </G>
      </Svg>
      
      {/* Content inside the circle */}
      <View style={styles.childrenContainer}>
        {children}
      </View>
      
      {/* Optional visual effects can be added here */}
      <View style={[
        styles.glowEffect, 
        { 
          width: size + 10,
          height: size + 10,
          borderRadius: (size + 10) / 2,
          backgroundColor: color,
          opacity: 0.15 * progress
        }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  childrenContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  glowEffect: {
    position: 'absolute',
    zIndex: -1,
    top: -5,
    left: -5,
  }
});

export default CircularProgress; 