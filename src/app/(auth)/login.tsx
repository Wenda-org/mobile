import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInDownView, FadeInUpView } from '@/components/animated-wrappers';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    if (!email || !password) {
      setLocalError(t('auth.validation_fields') || 'Preencha todos os campos');
      return;
    }

    const result = await login({ email, password });
    if (result.success) {
      router.replace('/');
    }
  };

  const handleOfflineDemoLogin = async () => {
    // For developers convenience/demo offline mode:
    // Create a mock user session in store
    const { useAuthStore } = require('@/stores/useAuthStore');
    await useAuthStore.getState().setAuth(
      {
        id: 'demo_user_id',
        name: 'Guilherme Santos',
        email: 'guilherme@wenda.ao',
        role: 'user',
        isActive: true,
        preferences: {},
        createdAt: new Date().toISOString()
      },
      'demo_token_secret_xyz'
    );
    router.replace('/');
  };

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark px-6 justify-between"
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
    >
      <View className="flex-1 justify-center max-w-md mx-auto w-full">
        {/* Header */}
        <FadeInDownView duration={400} delay={100} className="mb-8">
          <Text className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('auth.login_title')}
          </Text>
          <Text className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {t('auth.login_subtitle')}
          </Text>
        </FadeInDownView>

        {/* Form */}
        <FadeInDownView duration={400} delay={200} className="space-y-4">
          {/* Email Input */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              {t('auth.email')}
            </Text>
            <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-14">
              <Mail size={20} color="#8C8779" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="exemplo@wenda.ao"
                placeholderTextColor="#8C8779"
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 ml-3 text-text-primary-light dark:text-text-primary-dark text-base"
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                {t('auth.password')}
              </Text>
              <Pressable onPress={() => {}}>
                <Text className="text-xs text-primary font-semibold">
                  {t('auth.forgot_password')}
                </Text>
              </Pressable>
            </View>
            <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-14">
              <Lock size={20} color="#8C8779" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#8C8779"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 ml-3 text-text-primary-light dark:text-text-primary-dark text-base"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#8C8779" />
                ) : (
                  <Eye size={20} color="#8C8779" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Error Message */}
          {(error || localError) && (
            <View className="p-3 bg-error/10 border border-error/20 rounded-md">
              <Text className="text-xs text-error font-medium">
                {localError || error}
              </Text>
            </View>
          )}

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className="w-full h-14 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium mt-4"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text className="text-base font-bold text-white">
                {t('auth.sign_in')}
              </Text>
            )}
          </Pressable>

          {/* Demo Login Option */}
          <Pressable
            onPress={handleOfflineDemoLogin}
            className="w-full h-12 bg-secondary/10 items-center justify-center rounded-md active:bg-secondary/20 mt-2"
          >
            <Text className="text-sm font-semibold text-secondary-900 dark:text-secondary-300">
              Entrar como Visitante (Modo Demonstração)
            </Text>
          </Pressable>
        </FadeInDownView>
      </View>

      {/* Footer Link */}
      <FadeInUpView duration={400} delay={300} className="w-full items-center max-w-md mx-auto">
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {t('auth.dont_have_account')}{' '}
            <Text className="text-primary font-bold">{t('auth.sign_up')}</Text>
          </Text>
        </Pressable>
      </FadeInUpView>
    </View>
  );
}
