import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { categoryService } from '../services';
import { Category } from '../types/api.types';
import { TravelPreferences } from '../types/preferences.types';

export default function PreferencesSetupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, updateProfile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Preferences state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<string>('medium');
  const [travelWith, setTravelWith] = useState<string>('solo');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const steps = [
    {
      title: 'Interesses',
      description: 'Que tipo de lugares você gosta?',
      icon: 'heart',
    },
    {
      title: 'Estilo de Viagem',
      description: 'Como você gosta de viajar?',
      icon: 'airplane',
    },
    {
      title: 'Orçamento',
      description: 'Qual é o seu orçamento preferido?',
      icon: 'wallet',
    },
    {
      title: 'Companhia',
      description: 'Com quem você costuma viajar?',
      icon: 'people',
    },
    {
      title: 'Atividade',
      description: 'Qual o seu nível de atividade?',
      icon: 'fitness',
    },
  ];

  const travelStyles = [
    { id: 'adventure', label: 'Aventura', icon: 'trail-sign', emoji: '🏔️' },
    { id: 'relaxation', label: 'Relaxamento', icon: 'leaf', emoji: '🧘' },
    { id: 'cultural', label: 'Cultural', icon: 'library', emoji: '🏛️' },
    { id: 'nature', label: 'Natureza', icon: 'flower', emoji: '🌿' },
    { id: 'urban', label: 'Urbano', icon: 'business', emoji: '🏙️' },
    { id: 'beach', label: 'Praia', icon: 'water', emoji: '🏖️' },
  ];

  const budgetOptions = [
    { id: 'low', label: 'Económico', icon: 'cash-outline', description: 'Até 10.000 Kz/dia' },
    { id: 'medium', label: 'Médio', icon: 'cash', description: '10.000 - 30.000 Kz/dia' },
    { id: 'high', label: 'Alto', icon: 'diamond-outline', description: '30.000 - 100.000 Kz/dia' },
    { id: 'luxury', label: 'Luxo', icon: 'diamond', description: 'Acima de 100.000 Kz/dia' },
  ];

  const travelWithOptions = [
    { id: 'solo', label: 'Sozinho', icon: 'person', emoji: '🧳' },
    { id: 'couple', label: 'Casal', icon: 'heart', emoji: '💑' },
    { id: 'family', label: 'Família', icon: 'home', emoji: '👨‍👩‍👧‍👦' },
    { id: 'friends', label: 'Amigos', icon: 'people', emoji: '👥' },
    { id: 'group', label: 'Grupo', icon: 'people-circle', emoji: '🚌' },
  ];

  const activityLevelOptions = [
    { id: 'low', label: 'Baixo', icon: 'bed', description: 'Muitos dias relaxados' },
    { id: 'moderate', label: 'Moderado', icon: 'walk', description: 'Equilíbrio entre descanso e atividade' },
    { id: 'high', label: 'Alto', icon: 'bicycle', description: 'Dias cheios de atividades' },
    { id: 'extreme', label: 'Extremo', icon: 'flash', description: 'Aventura e adrenalina' },
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleTravelStyle = (style: string) => {
    setTravelStyle(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      
      const preferences = {
        favoriteCategories: selectedCategories,
        travelStyle,
        budgetRange,
        travelWith,
        activityLevel,
        preferredDuration: 'weekend',
        needsAccessibility: false,
        preferredLanguage: 'pt',
        notifications: {
          recommendations: true,
          deals: true,
          updates: true,
          newsletter: false,
        },
      };

      const result = await updateProfile({ preferences });
      
      if (result.success) {
        Alert.alert(
          'Preferências Salvas! 🎉',
          'Agora podemos recomendar os melhores lugares para você!',
          [
            {
              text: 'Explorar',
              onPress: () => router.replace('/(tabs)'),
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

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedCategories.length > 0;
      case 1:
        return travelStyle.length > 0;
      case 2:
        return budgetRange !== '';
      case 3:
        return travelWith !== '';
      case 4:
        return activityLevel !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <Text className={`text-sm mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              Selecione pelo menos uma categoria (pode escolher várias)
            </Text>
            {loadingCategories ? (
              <ActivityIndicator size="large" color="#136F63" />
            ) : (
              <View className="flex-row flex-wrap gap-3">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => toggleCategory(category.id)}
                    className={`flex-1 min-w-[45%] p-4 rounded-2xl border-2 ${
                      selectedCategories.includes(category.id)
                        ? 'bg-primary/10 border-primary'
                        : isDark
                        ? 'bg-background-dark-secondary border-border-dark'
                        : 'bg-white border-border-light'
                    }`}
                  >
                    <View className="items-center">
                      <View className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${
                        selectedCategories.includes(category.id)
                          ? 'bg-primary/20'
                          : isDark
                          ? 'bg-background-dark'
                          : 'bg-background-light'
                      }`}>
                        <Text className="text-3xl">{category.icon || '📍'}</Text>
                      </View>
                      <Text className={`text-sm font-semibold text-center ${
                        isDark ? 'text-text-dark' : 'text-text-light'
                      }`}>
                        {category.name}
                      </Text>
                      {selectedCategories.includes(category.id) && (
                        <Ionicons name="checkmark-circle" size={20} color="#136F63" className="absolute top-2 right-2" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case 1:
        return (
          <View>
            <Text className={`text-sm mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              Selecione os estilos que mais combinam com você
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {travelStyles.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  onPress={() => toggleTravelStyle(style.id)}
                  className={`flex-1 min-w-[45%] p-4 rounded-2xl border-2 ${
                    travelStyle.includes(style.id)
                      ? 'bg-primary/10 border-primary'
                      : isDark
                      ? 'bg-background-dark-secondary border-border-dark'
                      : 'bg-white border-border-light'
                  }`}
                >
                  <View className="items-center">
                    <Text className="text-4xl mb-2">{style.emoji}</Text>
                    <Text className={`text-sm font-semibold ${
                      isDark ? 'text-text-dark' : 'text-text-light'
                    }`}>
                      {style.label}
                    </Text>
                    {travelStyle.includes(style.id) && (
                      <Ionicons name="checkmark-circle" size={20} color="#136F63" className="mt-1" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <Text className={`text-sm mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              Selecione sua faixa de orçamento preferida
            </Text>
            <View className="gap-3">
              {budgetOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setBudgetRange(option.id)}
                  className={`p-4 rounded-2xl border-2 ${
                    budgetRange === option.id
                      ? 'bg-primary/10 border-primary'
                      : isDark
                      ? 'bg-background-dark-secondary border-border-dark'
                      : 'bg-white border-border-light'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                        budgetRange === option.id
                          ? 'bg-primary/20'
                          : isDark
                          ? 'bg-background-dark'
                          : 'bg-background-light'
                      }`}>
                        <Ionicons name={option.icon as any} size={24} color="#136F63" />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-base font-semibold ${
                          isDark ? 'text-text-dark' : 'text-text-light'
                        }`}>
                          {option.label}
                        </Text>
                        <Text className={`text-sm ${
                          isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                        }`}>
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    {budgetRange === option.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#136F63" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <Text className={`text-sm mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              Com quem você costuma viajar?
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {travelWithOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setTravelWith(option.id)}
                  className={`flex-1 min-w-[45%] p-4 rounded-2xl border-2 ${
                    travelWith === option.id
                      ? 'bg-primary/10 border-primary'
                      : isDark
                      ? 'bg-background-dark-secondary border-border-dark'
                      : 'bg-white border-border-light'
                  }`}
                >
                  <View className="items-center">
                    <Text className="text-4xl mb-2">{option.emoji}</Text>
                    <Text className={`text-sm font-semibold ${
                      isDark ? 'text-text-dark' : 'text-text-light'
                    }`}>
                      {option.label}
                    </Text>
                    {travelWith === option.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#136F63" className="mt-1" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <Text className={`text-sm mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              Qual o seu nível de atividade preferido?
            </Text>
            <View className="gap-3">
              {activityLevelOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setActivityLevel(option.id)}
                  className={`p-4 rounded-2xl border-2 ${
                    activityLevel === option.id
                      ? 'bg-primary/10 border-primary'
                      : isDark
                      ? 'bg-background-dark-secondary border-border-dark'
                      : 'bg-white border-border-light'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                        activityLevel === option.id
                          ? 'bg-primary/20'
                          : isDark
                          ? 'bg-background-dark'
                          : 'bg-background-light'
                      }`}>
                        <Ionicons name={option.icon as any} size={24} color="#136F63" />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-base font-semibold ${
                          isDark ? 'text-text-dark' : 'text-text-light'
                        }`}>
                          {option.label}
                        </Text>
                        <Text className={`text-sm ${
                          isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                        }`}>
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    {activityLevel === option.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#136F63" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Header */}
      <View className="px-6 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-2xl font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            Configure suas Preferências
          </Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-primary text-base font-semibold">Pular</Text>
          </TouchableOpacity>
        </View>
        
        {/* Progress */}
        <View className="flex-row gap-2 mb-4">
          {steps.map((_, index) => (
            <View
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= currentStep ? 'bg-primary' : isDark ? 'bg-border-dark' : 'bg-border-light'
              }`}
            />
          ))}
        </View>

        {/* Step Info */}
        <View className="flex-row items-center mb-2">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-3">
            <Ionicons name={steps[currentStep].icon as any} size={24} color="#136F63" />
          </View>
          <View className="flex-1">
            <Text className={`text-xl font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {steps[currentStep].title}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              Passo {currentStep + 1} de {steps.length}
            </Text>
          </View>
        </View>
        
        <Text className={`text-base ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
          {steps[currentStep].description}
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {renderStep()}
        <View className="h-32" />
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 py-6 border-t border-border-light dark:border-border-dark">
        <View className="flex-row gap-3">
          {currentStep > 0 && (
            <TouchableOpacity
              onPress={handleBack}
              className={`flex-1 py-4 rounded-2xl items-center justify-center ${
                isDark ? 'bg-background-dark-secondary' : 'bg-white border border-border-light'
              }`}
            >
              <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                Voltar
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            disabled={!canProceed() || loading}
            className={`flex-1 py-4 rounded-2xl items-center justify-center ${
              canProceed() && !loading ? 'bg-primary' : 'bg-gray-400'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-bold">
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
