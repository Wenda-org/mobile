import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TravelPreferences } from '../types/preferences.types';

interface PreferencesCardProps {
  preferences?: Partial<TravelPreferences>;
  isDark: boolean;
  onEdit: () => void;
}

export function PreferencesCard({ preferences, isDark, onEdit }: PreferencesCardProps) {
  if (!preferences || Object.keys(preferences).length === 0) {
    return (
      <TouchableOpacity
        onPress={onEdit}
        className={`p-4 rounded-xl border-2 border-dashed ${
          isDark ? 'border-border-dark bg-background-dark-secondary' : 'border-border-light bg-white'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className={`text-base font-semibold mb-1 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              Configure suas preferências
            </Text>
            <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              Personalize recomendações de destinos
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
            <Ionicons name="add" size={24} color="#136F63" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const getBudgetLabel = (budget?: string) => {
    switch (budget) {
      case 'low': return 'Econômico';
      case 'medium': return 'Moderado';
      case 'high': return 'Alto';
      case 'luxury': return 'Luxo';
      default: return 'Não definido';
    }
  };

  const getTravelWithLabel = (travelWith?: string) => {
    switch (travelWith) {
      case 'solo': return '🧳 Sozinho';
      case 'couple': return '💑 Casal';
      case 'family': return '👨‍👩‍👧‍👦 Família';
      case 'friends': return '👥 Amigos';
      case 'group': return '🚌 Grupo';
      default: return 'Não definido';
    }
  };

  const getActivityLabel = (activity?: string) => {
    switch (activity) {
      case 'low': return 'Relaxante';
      case 'moderate': return 'Moderado';
      case 'high': return 'Ativo';
      case 'extreme': return 'Aventura';
      default: return 'Não definido';
    }
  };

  return (
    <View
      className={`p-4 rounded-xl ${isDark ? 'bg-background-dark-secondary' : 'bg-white'}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className={`text-lg font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          Minhas Preferências
        </Text>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        {/* Travel Style */}
        {preferences.travelStyle && preferences.travelStyle.length > 0 && (
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="compass" size={16} color="#136F63" />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Estilo de Viagem
              </Text>
              <Text className={`text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {preferences.travelStyle.slice(0, 2).join(', ')}
                {preferences.travelStyle.length > 2 && ` +${preferences.travelStyle.length - 2}`}
              </Text>
            </View>
          </View>
        )}

        {/* Budget */}
        {preferences.budgetRange && (
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="cash" size={16} color="#136F63" />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Orçamento
              </Text>
              <Text className={`text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {getBudgetLabel(preferences.budgetRange)}
              </Text>
            </View>
          </View>
        )}

        {/* Travel With */}
        {preferences.travelWith && (
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="people" size={16} color="#136F63" />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Viaja com
              </Text>
              <Text className={`text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {getTravelWithLabel(preferences.travelWith)}
              </Text>
            </View>
          </View>
        )}

        {/* Activity Level */}
        {preferences.activityLevel && (
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="fitness" size={16} color="#136F63" />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Nível de Atividade
              </Text>
              <Text className={`text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {getActivityLabel(preferences.activityLevel)}
              </Text>
            </View>
          </View>
        )}

        {/* Favorite Categories Count */}
        {preferences.favoriteCategories && preferences.favoriteCategories.length > 0 && (
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="heart" size={16} color="#136F63" />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Categorias Favoritas
              </Text>
              <Text className={`text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {preferences.favoriteCategories.length} selecionadas
              </Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={onEdit}
        className="mt-4 py-2 px-4 bg-primary/10 rounded-lg items-center"
      >
        <Text className="text-primary font-semibold text-sm">Editar Preferências</Text>
      </TouchableOpacity>
    </View>
  );
}
