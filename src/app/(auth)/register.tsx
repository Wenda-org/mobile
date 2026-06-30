import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInDownView, FadeInUpView } from '@/components/animated-wrappers';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { register, isLoading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLocalError(null);
    if (!name || !email || !password) {
      setLocalError(t('auth.validation_fields') || 'Preencha os campos obrigatórios');
      return;
    }

    const result = await register({ name, email, password, phone });
    if (result.success) {
      router.replace('/(auth)/confirm');
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-base-light dark:bg-base-dark"
      contentContainerStyle={{ 
        flexGrow: 1, 
        justifyContent: 'space-between',
        paddingTop: insets.top + 20, 
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24
      }}
    >
      <View className="flex-1 justify-center max-w-md mx-auto w-full">
        {/* Header */}
        <FadeInDownView duration={400} delay={100} className="mb-8">
          <Text className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('auth.register_title')}
          </Text>
          <Text className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {t('auth.register_subtitle')}
          </Text>
        </FadeInDownView>

        {/* Form */}
        <FadeInDownView duration={400} delay={200} className="space-y-4">
          {/* Name Input */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              {t('auth.name')} *
            </Text>
            <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-14">
              <User size={20} color="#8C8779" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                placeholderTextColor="#8C8779"
                className="flex-1 ml-3 text-text-primary-light dark:text-text-primary-dark text-base"
              />
            </View>
          </View>

          {/* Email Input */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              {t('auth.email')} *
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

          {/* Phone Input */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              {t('auth.phone')}
            </Text>
            <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-14">
              <Phone size={20} color="#8C8779" />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+244 9xx xxx xxx"
                placeholderTextColor="#8C8779"
                keyboardType="phone-pad"
                className="flex-1 ml-3 text-text-primary-light dark:text-text-primary-dark text-base"
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              {t('auth.password')} *
            </Text>
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

          {/* Register Button */}
          <Pressable
            onPress={handleRegister}
            disabled={isLoading}
            className="w-full h-14 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium mt-4"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text className="text-base font-bold text-white">
                {t('auth.sign_up')}
              </Text>
            )}
          </Pressable>
        </FadeInDownView>
      </View>

      {/* Footer Link */}
      <FadeInUpView duration={400} delay={300} className="w-full items-center max-w-md mx-auto mt-6">
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {t('auth.already_have_account')}{' '}
            <Text className="text-primary font-bold">{t('auth.sign_in')}</Text>
          </Text>
        </Pressable>
      </FadeInUpView>
    </ScrollView>
  );
}
