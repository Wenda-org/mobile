import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useDestinations } from '@/hooks/useDestinations';
import { ChevronLeft, Check, Sparkles } from 'lucide-react-native';

const PROVINCES = [
  'Luanda', 'Namibe', 'Huíla', 'Benguela', 'Malanje', 
  'Cabinda', 'Uíge', 'Cuanza Sul', 'Huambo', 'Zaire'
];

export default function EditPreferencesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();
  const { categories } = useDestinations();

  const prefs = user?.preferences || {};
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(prefs.preferred_categories || []);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(prefs.preferred_provinces || []);
  const [selectedStyle, setSelectedStyle] = useState<string>(prefs.style || '');
  const [selectedBudget, setSelectedBudget] = useState<string>(prefs.budget || '');
  const [selectedCompanions, setSelectedCompanions] = useState<string>(prefs.companions || '');
  
  const [isSaving, setIsSaving] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleProvince = (name: string) => {
    setSelectedProvinces(prev => 
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const preferences = {
        preferred_categories: selectedCategories,
        preferred_provinces: selectedProvinces,
        style: selectedStyle,
        budget: selectedBudget as any,
        companions: selectedCompanions as any,
      };

      await updateProfile({ preferences });
      router.back();
    } catch (e) {
      // Catch error
    } finally {
      setIsSaving(false);
    }
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
          Editar Calibração IA
        </Text>
        <View className="w-8 h-8" />
      </View>

      <ScrollView className="flex-1 px-6 mt-4" showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View className="flex-row items-center bg-primary/5 dark:bg-primary/10 rounded-md p-4 mb-6">
          <Sparkles size={20} color="#FFD166" className="mr-2" />
          <Text className="text-xs font-semibold text-primary">
            Sintonize as recomendações inteligentes em tempo real.
          </Text>
        </View>

        {/* Categories Section */}
        <View className="mb-8">
          <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
            Interesses Turísticos
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {(categories.length > 0 ? categories : [
              { id: '1', name: 'Natureza' },
              { id: '2', name: 'História & Cultura' },
              { id: '3', name: 'Aventura' },
              { id: '4', name: 'Praia' },
              { id: '5', name: 'Gastronomia' }
            ]).map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => toggleCategory(cat.id)}
                  className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                    isSelected 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <Text className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Provinces Section */}
        <View className="mb-8">
          <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
            Províncias de Interesse
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {PROVINCES.map((prov) => {
              const isSelected = selectedProvinces.includes(prov);
              return (
                <Pressable
                  key={prov}
                  onPress={() => toggleProvince(prov)}
                  className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                    isSelected 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <Text className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                    {prov}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Travel Style */}
        <View className="mb-8">
          <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
            Estilo de Viagem
          </Text>
          <View className="space-y-2">
            {['relaxation', 'adventure', 'beach', 'urban'].map((styleKey) => {
              const isSelected = selectedStyle === styleKey;
              return (
                <Pressable
                  key={styleKey}
                  onPress={() => setSelectedStyle(styleKey)}
                  className={`flex-row items-center justify-between p-4 rounded-md border ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <Text className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                    {t(`quiz.styles.${styleKey}`)}
                  </Text>
                  {isSelected && <Check size={16} color="#136F63" />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Budget */}
        <View className="mb-8">
          <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
            Faixa de Orçamento
          </Text>
          <View className="space-y-2">
            {['low', 'medium', 'high', 'luxury'].map((budgetKey) => {
              const isSelected = selectedBudget === budgetKey;
              return (
                <Pressable
                  key={budgetKey}
                  onPress={() => setSelectedBudget(budgetKey)}
                  className={`flex-row items-center justify-between p-4 rounded-md border ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <Text className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                    {t(`quiz.budgets.${budgetKey}`)}
                  </Text>
                  {isSelected && <Check size={16} color="#136F63" />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Companions */}
        <View className="mb-12">
          <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
            Companhia Recomendada
          </Text>
          <View className="space-y-2">
            {['alone', 'couple', 'friends', 'family'].map((compKey) => {
              const isSelected = selectedCompanions === compKey;
              return (
                <Pressable
                  key={compKey}
                  onPress={() => setSelectedCompanions(compKey)}
                  className={`flex-row items-center justify-between p-4 rounded-md border ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <Text className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                    {t(`quiz.companions.${compKey}`)}
                  </Text>
                  {isSelected && <Check size={16} color="#136F63" />}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-6 py-4 border-t border-borderSubtle-light dark:border-borderSubtle-dark">
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="w-full h-14 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text className="text-base font-bold text-white">Guardar Alterações</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
