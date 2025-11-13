import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleLogin = async () => {
    // Validação básica
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    try {
      setLocalLoading(true);
      const result = await login(email.trim().toLowerCase(), password);

      if (result.success) {
        // Sucesso - verificar preferências
        router.replace('/check-preferences');
      } else {
        // Exibir erro
        Alert.alert(
          'Erro ao fazer login',
          result.error || 'Email ou senha incorretos. Tente novamente.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
      console.error('Login error:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      'Em breve',
      'Login com Google estará disponível em breve!'
    );
  };

  const loading = isLoading || localLoading;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
            disabled={loading}
            className={`bg-primary rounded-xl py-4 items-center mb-4 ${loading ? 'opacity-50' : ''}`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-semibold">{t('login')}</Text>
            )}
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
            <Ionicons name="logo-google" size={20} color="#DB4437" className="mr-3" />
            <Text className={`text-base font-semibold ml-3 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {t('sign_in_with_google')}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mb-4">
            <Text className={`text-base ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {t('dont_have_account')}{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary text-base font-semibold">{t('sign_up')}</Text>
            </TouchableOpacity>
          </View>

          {/* Tutorial Link */}
          <View className="flex-row justify-center">
            <TouchableOpacity onPress={() => router.push('/(auth)/onboarding/0')}>
              <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                🎓 Ver tutorial
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

