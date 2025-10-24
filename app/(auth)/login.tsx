import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Integrate authentication
    console.log('Login:', { email, password });
  };

  const handleGoogleLogin = () => {
    // TODO: Integrate Google OAuth
    console.log('Google Login');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-10">
            <Text className={`text-4xl font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {t('welcome_back')}
            </Text>
            <Text className={`text-base ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {t('login_subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View className="mb-6">
            {/* Email Input */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {t('email')}
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t('email_placeholder')}
                placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
                keyboardType="email-address"
                autoCapitalize="none"
                className={`w-full px-4 py-3.5 rounded-xl text-base ${
                  isDark 
                    ? 'bg-background-dark-secondary text-text-dark border border-border-dark' 
                    : 'bg-background-light-secondary text-text-light border border-border-light'
                }`}
              />
            </View>

            {/* Password Input */}
            <View className="mb-2">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {t('password')}
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t('password_placeholder')}
                placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
                secureTextEntry
                className={`w-full px-4 py-3.5 rounded-xl text-base ${
                  isDark 
                    ? 'bg-background-dark-secondary text-text-dark border border-border-dark' 
                    : 'bg-background-light-secondary text-text-light border border-border-light'
                }`}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end">
              <Text className="text-primary text-sm font-semibold">
                {t('forgot_password')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-primary rounded-xl py-4 items-center mb-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text className="text-white text-lg font-semibold">{t('login')}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <Text className={`mx-4 text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {t('or_continue_with')}
            </Text>
            <View className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            className={`rounded-xl py-4 px-4 flex-row items-center justify-center mb-8 ${
              isDark 
                ? 'bg-background-dark-secondary border border-border-dark' 
                : 'bg-white border border-border-light'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className="text-2xl mr-3">🔵</Text>
            <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {t('sign_in_with_google')}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className={`text-base ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {t('dont_have_account')}{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary text-base font-semibold">{t('sign_up')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

