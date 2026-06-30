import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInDownView, FadeInUpView } from '@/components/animated-wrappers';
import { ShieldCheck } from 'lucide-react-native';

export default function ConfirmEmailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    if (code.length < 4) {
      setError('Por favor, introduza um código válido.');
      return;
    }

    setIsLoading(true);
    try {
      // Mock call to API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Code confirmed, go to preferences setup
      router.replace('/preferences-setup');
    } catch (e) {
      setError('Código inválido ou expirado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark px-6 justify-between"
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
    >
      <View className="flex-1 justify-center max-w-md mx-auto w-full">
        {/* Header */}
        <FadeInDownView duration={400} delay={100} className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-success/10 items-center justify-center mb-6">
            <ShieldCheck size={32} color="#06D6A0" />
          </View>
          <Text className="text-3xl font-bold text-center text-text-primary-light dark:text-text-primary-dark">
            {t('auth.confirm_title')}
          </Text>
          <Text className="text-sm text-center text-text-secondary-light dark:text-text-secondary-dark mt-2 px-4">
            {t('auth.confirm_subtitle')}
          </Text>
        </FadeInDownView>

        {/* Code Input Form */}
        <FadeInDownView duration={400} delay={200} className="space-y-4">
          <View className="items-center">
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder={t('auth.code_placeholder')}
              placeholderTextColor="#8C8779"
              maxLength={6}
              keyboardType="number-pad"
              className="w-full text-center text-2xl font-bold tracking-widest bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md h-16"
            />
          </View>

          {/* Error Message */}
          {error && (
            <View className="p-3 bg-error/10 border border-error/20 rounded-md">
              <Text className="text-xs text-error font-medium text-center">
                {error}
              </Text>
            </View>
          )}

          {/* Confirm Button */}
          <Pressable
            onPress={handleConfirm}
            disabled={isLoading}
            className="w-full h-14 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium mt-4"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text className="text-base font-bold text-white">
                {t('auth.confirm_btn')}
              </Text>
            )}
          </Pressable>
        </FadeInDownView>
      </View>

      {/* Resend Link */}
      <FadeInUpView duration={400} delay={300} className="w-full items-center max-w-md mx-auto">
        <Pressable onPress={() => {}}>
          <Text className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Não recebeu o código? <Text className="text-primary font-bold">Reenviar código</Text>
          </Text>
        </Pressable>
      </FadeInUpView>
    </View>
  );
}
