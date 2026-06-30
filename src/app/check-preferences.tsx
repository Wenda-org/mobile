import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useDestinations } from '@/hooks/useDestinations';
import { ChevronLeft, Edit3, Compass, MapPin, Wallet, Sparkles } from 'lucide-react-native';

export default function CheckPreferencesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { categories } = useDestinations();

  const prefs = user?.preferences || {};
  const preferredCats = prefs.preferred_categories || [];
  const preferredProvs = prefs.preferred_provinces || [];

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
  };

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-borderSubtle-light dark:border-borderSubtle-dark">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#136F63" />
        </Pressable>
        <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          Minha Calibração IA
        </Text>
        <Pressable onPress={() => router.push('/edit-preferences')} className="p-2 -mr-2">
          <Edit3 size={20} color="#136F63" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-6 mt-4" showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View className="bg-primary/5 dark:bg-primary/10 rounded-md p-5 mb-6 border border-primary/10">
          <View className="flex-row items-center mb-2">
            <Sparkles size={20} color="#FFD166" className="mr-2" />
            <Text className="text-base font-bold text-primary">Perfil Personalizado</Text>
          </View>
          <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            As suas preferências ajudam a nossa Inteligência Artificial a encontrar as melhores praias, monumentos históricos, hotéis e rotas personalizadas nas 18 províncias de Angola.
          </Text>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Compass size={18} color="#136F63" className="mr-2" />
            <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
              Interesses Turísticos
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {preferredCats.length > 0 ? (
              preferredCats.map((catId) => (
                <View key={catId} className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-3 py-2">
                  <Text className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {getCategoryName(catId)}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-xs text-text-muted-light dark:text-text-muted-dark italic">Nenhum interesse selecionado</Text>
            )}
          </View>
        </View>

        {/* Provinces */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <MapPin size={18} color="#136F63" className="mr-2" />
            <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
              Províncias de Interesse
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {preferredProvs.length > 0 ? (
              preferredProvs.map((prov) => (
                <View key={prov} className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-3 py-2">
                  <Text className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {prov}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-xs text-text-muted-light dark:text-text-muted-dark italic">Nenhuma província selecionada</Text>
            )}
          </View>
        </View>

        {/* Style, Budget, Companions Grid */}
        <View className="grid grid-cols-2 gap-4 mb-6">
          {/* Style */}
          <View className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 flex-1">
            <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Estilo de Viagem</Text>
            <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
              {prefs.style ? t(`quiz.styles.${prefs.style}`) : 'Não definido'}
            </Text>
          </View>

          {/* Budget */}
          <View className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 flex-1 mt-3">
            <View className="flex-row items-center mb-1">
              <Wallet size={14} color="#8C8779" className="mr-1" />
              <Text className="text-xs text-text-muted-light dark:text-text-muted-dark">Orçamento confortável</Text>
            </View>
            <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
              {prefs.budget ? t(`quiz.budgets.${prefs.budget}`) : 'Não definido'}
            </Text>
          </View>

          {/* Companions */}
          <View className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 flex-1 mt-3">
            <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Companhia de viagem</Text>
            <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
              {prefs.companions ? t(`quiz.companions.${prefs.companions}`) : 'Não definido'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Button to return home */}
      <View className="px-6 py-4">
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          className="w-full h-14 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium"
        >
          <Text className="text-base font-bold text-white">Ir para a Home</Text>
        </Pressable>
      </View>
    </View>
  );
}
