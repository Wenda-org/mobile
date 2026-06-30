import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { FadeInDownView } from '@/components/animated-wrappers';
import { useTripsStore } from '@/stores/useTripsStore';
import { ChevronLeft, CalendarRange, PenTool } from 'lucide-react-native';

export default function NewTripScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { createTrip, isLoading } = useTripsStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!title || !startDate || !endDate) {
      setErrorMsg('Por favor preencha os campos obrigatórios.');
      return;
    }

    // Basic date parsing validation
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);
    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
      setErrorMsg('Formato de data inválido. Use AAAA-MM-DD (ex: 2026-07-20).');
      return;
    }

    if (endObj < startObj) {
      setErrorMsg('A data de fim não pode ser anterior à data de início.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newTrip = await createTrip({
      title,
      description,
      startDate,
      endDate,
    });

    if (newTrip) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/trips');
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
          Novo Roteiro
        </Text>
        <View className="w-8 h-8" />
      </View>

      <ScrollView className="flex-1 px-6 mt-6" showsVerticalScrollIndicator={false}>
        <FadeInDownView className="space-y-5">
          {/* Trip Title */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              Título da Viagem *
            </Text>
            <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-14">
              <PenTool size={18} color="#8C8779" />
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Férias no Lubango"
                placeholderTextColor="#8C8779"
                className="flex-1 ml-3 text-text-primary-light dark:text-text-primary-dark text-base"
              />
            </View>
          </View>

          {/* Description */}
          <View>
            <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              Descrição (Opcional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Explorar as fendas, provar a gastronomia local..."
              placeholderTextColor="#8C8779"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 py-3 h-28 text-text-primary-light dark:text-text-primary-dark text-sm"
            />
          </View>

          {/* Dates Grid */}
          <View className="flex-row space-x-4">
            {/* Start Date */}
            <View className="flex-1">
              <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Data de Início *
              </Text>
              <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-14">
                <CalendarRange size={16} color="#8C8779" />
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="2026-07-10"
                  placeholderTextColor="#8C8779"
                  className="flex-1 ml-2 text-text-primary-light dark:text-text-primary-dark text-sm"
                />
              </View>
            </View>

            {/* End Date */}
            <View className="flex-1">
              <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Data de Fim *
              </Text>
              <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-14">
                <CalendarRange size={16} color="#8C8779" />
                <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="2026-07-20"
                  placeholderTextColor="#8C8779"
                  className="flex-1 ml-2 text-text-primary-light dark:text-text-primary-dark text-sm"
                />
              </View>
            </View>
          </View>

          {/* Error Message */}
          {errorMsg && (
            <View className="p-3 bg-error/10 border border-error/20 rounded-md">
              <Text className="text-xs text-error font-medium text-center">
                {errorMsg}
              </Text>
            </View>
          )}
        </FadeInDownView>
      </ScrollView>

      {/* Action Button */}
      <View className="px-6 py-4">
        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="w-full h-14 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text className="text-base font-bold text-white">Criar Roteiro</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
