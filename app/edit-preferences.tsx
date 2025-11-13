import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { TravelPreferences } from '../types/preferences.types';

export default function EditPreferencesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<Partial<TravelPreferences>>({});

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences as TravelPreferences);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await updateProfile({ preferences });
      
      if (result.success) {
        Alert.alert(
          'Sucesso!',
          'Suas preferências foram atualizadas.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível salvar suas preferências.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar suas preferências.');
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = (key: keyof TravelPreferences['notifications']) => {
    setPreferences((prev: any) => ({
      ...prev,
      notifications: {
        ...(prev.notifications || {}),
        [key]: !prev.notifications?.[key],
      },
    }));
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Header */}
      <View className="px-6 pt-12 pb-6 flex-row items-center border-b border-border-light dark:border-border-dark">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold flex-1 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          Editar Preferências
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text className={`text-base font-semibold ${loading ? 'text-gray-400' : 'text-primary'}`}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Travel Preferences */}
        <View className="px-6 py-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            Preferências de Viagem
          </Text>

          {/* Budget */}
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              Orçamento
            </Text>
            <View className="flex-row gap-2">
              {[
                { id: 'low', label: 'Baixo', icon: 'cash-outline' },
                { id: 'medium', label: 'Médio', icon: 'cash' },
                { id: 'high', label: 'Alto', icon: 'diamond-outline' },
                { id: 'luxury', label: 'Luxo', icon: 'diamond' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setPreferences((prev: Partial<TravelPreferences>) => ({ ...prev, budgetRange: option.id as any }))}
                  className={`flex-1 p-3 rounded-xl items-center ${
                    preferences.budgetRange === option.id
                      ? 'bg-primary'
                      : isDark
                      ? 'bg-background-dark-secondary'
                      : 'bg-white border border-border-light'
                  }`}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={preferences.budgetRange === option.id ? '#fff' : '#136F63'}
                  />
                  <Text
                    className={`text-xs mt-1 font-medium ${
                      preferences.budgetRange === option.id
                        ? 'text-white'
                        : isDark
                        ? 'text-text-dark'
                        : 'text-text-light'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Travel With */}
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              Costuma viajar
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {[
                { id: 'solo', label: 'Sozinho', emoji: '🧳' },
                { id: 'couple', label: 'Casal', emoji: '💑' },
                { id: 'family', label: 'Família', emoji: '👨‍👩‍👧‍👦' },
                { id: 'friends', label: 'Amigos', emoji: '👥' },
                { id: 'group', label: 'Grupo', emoji: '🚌' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setPreferences((prev: Partial<TravelPreferences>) => ({ ...prev, travelWith: option.id as any }))}
                  className={`px-4 py-2 rounded-full flex-row items-center ${
                    preferences.travelWith === option.id
                      ? 'bg-primary'
                      : isDark
                      ? 'bg-background-dark-secondary'
                      : 'bg-white border border-border-light'
                  }`}
                >
                  <Text className="mr-2">{option.emoji}</Text>
                  <Text
                    className={`text-sm font-medium ${
                      preferences.travelWith === option.id
                        ? 'text-white'
                        : isDark
                        ? 'text-text-dark'
                        : 'text-text-light'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Activity Level */}
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              Nível de Atividade
            </Text>
            <View className="gap-2">
              {[
                { id: 'low', label: 'Baixo', description: 'Muitos dias relaxados', icon: 'bed' },
                { id: 'moderate', label: 'Moderado', description: 'Equilíbrio', icon: 'walk' },
                { id: 'high', label: 'Alto', description: 'Dias cheios', icon: 'bicycle' },
                { id: 'extreme', label: 'Extremo', description: 'Aventura', icon: 'flash' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setPreferences((prev: Partial<TravelPreferences>) => ({ ...prev, activityLevel: option.id as any }))}
                  className={`p-3 rounded-xl flex-row items-center ${
                    preferences.activityLevel === option.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : isDark
                      ? 'bg-background-dark-secondary'
                      : 'bg-white border border-border-light'
                  }`}
                >
                  <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <Ionicons name={option.icon as any} size={20} color="#136F63" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}
                    >
                      {option.label}
                    </Text>
                    <Text
                      className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}
                    >
                      {option.description}
                    </Text>
                  </View>
                  {preferences.activityLevel === option.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#136F63" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Accessibility */}
          <View className={`p-4 rounded-xl flex-row items-center justify-between mb-6 ${
            isDark ? 'bg-background-dark-secondary' : 'bg-white'
          }`}>
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="accessibility" size={20} color="#136F63" />
              </View>
              <View className="flex-1">
                <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  Acessibilidade
                </Text>
                <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                  Precisa de recursos acessíveis
                </Text>
              </View>
            </View>
            <Switch
              value={preferences.needsAccessibility || false}
              onValueChange={(value) => setPreferences((prev: Partial<TravelPreferences>) => ({ ...prev, needsAccessibility: value }))}
              trackColor={{ false: '#767577', true: '#136F63' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Notifications */}
        <View className="px-6 py-6 border-t border-border-light dark:border-border-dark">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            Notificações
          </Text>

          {[
            { key: 'recommendations', label: 'Recomendações', description: 'Sugestões personalizadas', icon: 'sparkles' },
            { key: 'deals', label: 'Ofertas', description: 'Descontos e promoções', icon: 'pricetag' },
            { key: 'updates', label: 'Atualizações', description: 'Novidades do app', icon: 'notifications' },
            { key: 'newsletter', label: 'Newsletter', description: 'Dicas de viagem', icon: 'mail' },
          ].map((item) => (
            <View
              key={item.key}
              className={`p-4 rounded-xl flex-row items-center justify-between mb-3 ${
                isDark ? 'bg-background-dark-secondary' : 'bg-white'
              }`}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                  <Ionicons name={item.icon as any} size={20} color="#136F63" />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                    {item.label}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={preferences.notifications?.[item.key as keyof TravelPreferences['notifications']] || false}
                onValueChange={() => toggleNotification(item.key as keyof TravelPreferences['notifications'])}
                trackColor={{ false: '#767577', true: '#136F63' }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        <View className="h-32" />
      </ScrollView>
    </View>
  );
}
