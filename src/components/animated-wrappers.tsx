/**
 * AnimatedWrappers — Drop-in replacements for react-native-reanimated
 * animated entry components, using only the built-in React Native Animated API.
 * This allows the app to run in Expo Go without the New Architecture.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface AnimatedEntryProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export function FadeInDownView({ children, duration = 350, delay = 0, style, className }: AnimatedEntryProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration, delay, useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]} className={className}>
      {children}
    </Animated.View>
  );
}

export function FadeInUpView({ children, duration = 350, delay = 0, style, className }: AnimatedEntryProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration, delay, useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]} className={className}>
      {children}
    </Animated.View>
  );
}

export function FadeInView({ children, duration = 300, delay = 0, style, className }: AnimatedEntryProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[{ opacity }, style]} className={className}>
      {children}
    </Animated.View>
  );
}

export function FadeInRightView({ children, duration = 350, delay = 0, style, className }: AnimatedEntryProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration, delay, useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateX }] }, style]} className={className}>
      {children}
    </Animated.View>
  );
}
