import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInRightView } from '@/components/animated-wrappers';
import { useAuth } from '@/hooks/useAuth';
import { useDestinations } from '@/hooks/useDestinations';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react-native';

const PROVINCES = [
  'Luanda', 'Namibe', 'Huíla', 'Benguela', 'Malanje', 
  'Cabinda', 'Uíge', 'Cuanza Sul', 'Huambo', 'Zaire'
];

export default function PreferencesSetupScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();
  const { categories } = useDestinations();

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Quiz State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedCompanions, setSelectedCompanions] = useState<string>('');

  const totalSteps = 5;

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

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
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
      
      // Navigate to tabs home
      router.replace('/(tabs)');
    } catch (e) {
      // Ignore error, redirect anyway for safety
      router.replace('/(tabs)');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <FadeInRightView key="step1" className="flex-1">
            <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('quiz.interests_title')}
            </Text>
            <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-6">
              {t('quiz.interests_desc')}
            </Text>
            
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap gap-3 pb-6">
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
                      className={`flex-row items-center px-5 py-4 rounded-md border ${
                        isSelected 
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                      }`}
                    >
                      <Text className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                        {cat.name}
                      </Text>
                      {isSelected && <Check size={14} color="#136F63" className="ml-2" />}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </FadeInRightView>
        );

      case 2:
        return (
          <FadeInRightView key="step2" className="flex-1">
            <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('quiz.provinces_title') || 'Que províncias quer visitar?'}
            </Text>
            <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Selecione as províncias de Angola que mais lhe interessam.
            </Text>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap gap-3 pb-6">
                {PROVINCES.map((prov) => {
                  const isSelected = selectedProvinces.includes(prov);
                  return (
                    <Pressable
                      key={prov}
                      onPress={() => toggleProvince(prov)}
                      className={`flex-row items-center px-5 py-4 rounded-md border ${
                        isSelected 
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                      }`}
                    >
                      <Text className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                        {prov}
                      </Text>
                      {isSelected && <Check size={14} color="#136F63" className="ml-2" />}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </FadeInRightView>
        );

      case 3:
        return (
          <FadeInRightView key="step3" className="flex-1">
            <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('quiz.style_title')}
            </Text>
            <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-6">
              {t('quiz.style_desc')}
            </Text>

            <View className="space-y-4">
              {['relaxation', 'adventure', 'beach', 'urban'].map((styleKey) => {
                const isSelected = selectedStyle === styleKey;
                return (
                  <Pressable
                    key={styleKey}
                    onPress={() => setSelectedStyle(styleKey)}
                    className={`p-5 rounded-md border ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                    }`}
                  >
                    <Text className={`text-base font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                      {t(`quiz.styles.${styleKey}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </FadeInRightView>
        );

      case 4:
        return (
          <FadeInRightView key="step4" className="flex-1">
            <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('quiz.budget_title')}
            </Text>
            <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-6">
              {t('quiz.budget_desc')}
            </Text>

            <View className="space-y-4">
              {['low', 'medium', 'high', 'luxury'].map((budgetKey) => {
                const isSelected = selectedBudget === budgetKey;
                return (
                  <Pressable
                    key={budgetKey}
                    onPress={() => setSelectedBudget(budgetKey)}
                    className={`p-5 rounded-md border ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                    }`}
                  >
                    <Text className={`text-base font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                      {t(`quiz.budgets.${budgetKey}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </FadeInRightView>
        );

      case 5:
        return (
          <FadeInRightView key="step5" className="flex-1">
            <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('quiz.companions_title')}
            </Text>
            <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-6">
              {t('quiz.companions_desc')}
            </Text>

            <View className="space-y-4">
              {['alone', 'couple', 'friends', 'family'].map((compKey) => {
                const isSelected = selectedCompanions === compKey;
                return (
                  <Pressable
                    key={compKey}
                    onPress={() => setSelectedCompanions(compKey)}
                    className={`p-5 rounded-md border ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
                    }`}
                  >
                    <Text className={`text-base font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                      {t(`quiz.companions.${compKey}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </FadeInRightView>
        );
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return selectedCategories.length > 0;
      case 2: return selectedProvinces.length > 0;
      case 3: return selectedStyle !== '';
      case 4: return selectedBudget !== '';
      case 5: return selectedCompanions !== '';
      default: return false;
    }
  };

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark justify-between px-6"
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
    >
      {/* Top Navbar */}
      <View className="flex-row justify-between items-center w-full max-w-md mx-auto mb-4">
        {step > 1 ? (
          <Pressable onPress={handleBack} className="p-2 -ml-2">
            <ChevronLeft size={24} color="#136F63" />
          </Pressable>
        ) : (
          <View className="w-8 h-8" />
        )}
        <View className="flex-row items-center">
          <Sparkles size={16} color="#FFD166" className="mr-1" />
          <Text className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">
            {t('quiz.progress', { current: step, total: totalSteps })}
          </Text>
        </View>
        <View className="w-8 h-8" />
      </View>

      {/* Progress Bar */}
      <View className="w-full max-w-md mx-auto bg-borderSubtle-light dark:bg-borderSubtle-dark h-1 rounded-full mb-8 overflow-hidden">
        <View 
          className="bg-primary h-1 rounded-full" 
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </View>

      {/* Step Content */}
      <View className="flex-1 max-w-md mx-auto w-full mb-8">
        {renderStepContent()}
      </View>

      {/* Action Button */}
      <View className="w-full max-w-md mx-auto">
        <Pressable
          onPress={handleNext}
          disabled={!isStepValid() || isSaving}
          className={`w-full h-14 items-center justify-center rounded-md flex-row shadow-premium ${
            isStepValid() ? 'bg-primary active:bg-primary-600' : 'bg-primary/40'
          }`}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Text className="text-base font-bold text-white mr-2">
                {step === totalSteps ? t('quiz.finish') : t('common.continue')}
              </Text>
              {step !== totalSteps && <ChevronRight size={18} color="#FFF" />}
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
