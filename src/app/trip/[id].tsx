import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { FadeInDownView } from '@/components/animated-wrappers';
import { useTripsStore } from '@/stores/useTripsStore';
import { useDestinations } from '@/hooks/useDestinations';
import { ChevronLeft, Calendar, Trash2, Plus, MapPin, Star, Compass, Clock, Check } from 'lucide-react-native';

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { currentTrip, isLoading, fetchTripById, deleteTrip, addDestination, removeDestination } = useTripsStore();
  const { destinations } = useDestinations();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addingToTrip, setAddingToTrip] = useState(false);

  // Add Destination Form State
  const [selectedDestId, setSelectedDestId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTripById(id as string).catch(() => {});
    }
  }, [id]);

  const handleDeleteTrip = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const success = await deleteTrip(id as string);
    if (success) {
      router.replace('/(tabs)/trips');
    }
  };

  const handleAddDestination = async () => {
    setFormError(null);
    if (!selectedDestId || !visitDate) {
      setFormError('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    setAddingToTrip(true);
    try {
      const success = await addDestination(id as string, {
        destinationId: selectedDestId,
        visitDate,
        notes,
      });

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setAddModalVisible(false);
        // Reset Form
        setSelectedDestId('');
        setVisitDate('');
        setNotes('');
      } else {
        setFormError('Erro ao adicionar local.');
      }
    } catch {
      setFormError('Erro ao adicionar local.');
    } finally {
      setAddingToTrip(false);
    }
  };

  const handleRemoveDestination = async (destId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await removeDestination(id as string, destId);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(t('language.locale') === 'pt' ? 'pt-AO' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading && !currentTrip) {
    return (
      <View className="flex-1 bg-base-light dark:bg-base-dark items-center justify-center">
        <ActivityIndicator size="large" color="#136F63" />
      </View>
    );
  }

  if (!currentTrip) {
    return (
      <View className="flex-1 bg-base-light dark:bg-base-dark items-center justify-center p-6">
        <Text className="text-base text-text-primary-light dark:text-text-primary-dark font-bold">Roteiro não encontrado</Text>
        <Pressable onPress={() => router.back()} className="mt-4 px-6 h-12 bg-primary items-center justify-center rounded-md">
          <Text className="text-xs font-bold text-white">Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-borderSubtle-light dark:border-borderSubtle-dark">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#136F63" />
        </Pressable>
        <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark" numberOfLines={1}>
          {currentTrip.title}
        </Text>
        <Pressable onPress={handleDeleteTrip} className="p-2 -mr-2">
          <Trash2 size={20} color="#EF476F" />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View className="px-6 py-6 bg-surface-light dark:bg-surface-dark border-b border-borderSubtle-light dark:border-borderSubtle-dark">
          <View className="flex-row items-center space-x-2">
            <Calendar size={14} color="#8C8779" />
            <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
              {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
            </Text>
          </View>
          
          {currentTrip.description && (
            <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-3 leading-relaxed">
              {currentTrip.description}
            </Text>
          )}
        </View>

        {/* Timeline Itinerary Section */}
        <View className="px-6 pt-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              Locais a Visitar
            </Text>
            
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAddModalVisible(true);
              }}
              className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-md"
            >
              <Plus size={14} color="#136F63" className="mr-1" />
              <Text className="text-xs font-bold text-primary">Adicionar Local</Text>
            </Pressable>
          </View>

          {currentTrip.destinations && currentTrip.destinations.length > 0 ? (
            <View className="relative pl-6">
              {/* Vertical line indicator */}
              <View className="absolute left-2.5 top-2 bottom-8 w-0.5 bg-primary/20" />
              
              {currentTrip.destinations.map((item, idx) => {
                const dest = item.destination;
                if (!dest) return null;
                
                return (
                  <FadeInDownView
                     key={item.id || idx}
                     duration={400}
                     delay={idx * 100}
                     className="mb-8 relative"
                   >
                    {/* Circle bullet */}
                    <View className="absolute -left-[23px] top-1 w-4.5 h-4.5 rounded-full border-4 border-base-light dark:border-base-dark bg-primary items-center justify-center" />
                    
                    <View className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4">
                      {/* Destination Header */}
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-2">
                          <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                            {dest.name}
                          </Text>
                          <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-0.5">
                            {formatDate(item.visitDate || '')}
                          </Text>
                        </View>
                        
                        <Pressable 
                          onPress={() => handleRemoveDestination(dest.id)}
                          className="p-1 -mt-1 -mr-1"
                        >
                          <Trash2 size={16} color="#EF476F" />
                        </Pressable>
                      </View>

                      {/* Notes block */}
                      {item.notes && (
                        <View className="bg-base-light dark:bg-base-dark p-2 rounded-md mt-3">
                          <Text className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark italic leading-relaxed">
                            "{item.notes}"
                          </Text>
                        </View>
                      )}
                    </View>
                  </FadeInDownView>
                );
              })}
            </View>
          ) : (
            <View className="items-center justify-center py-12 bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-6">
              <Compass size={36} color="#8C8779" />
              <Text className="text-xs text-text-muted-light dark:text-text-muted-dark italic text-center mt-3 leading-relaxed">
                Nenhum local adicionado ao itinerário. Clique em "Adicionar Local" para planejar.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Destination Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface-light dark:bg-surface-dark border-t border-borderSubtle-light dark:border-borderSubtle-dark rounded-t-lg p-6 max-h-[90%]">
            <View className="w-12 h-1 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded-full mx-auto mb-4" />
            
            <Text className="text-lg font-bold text-center text-text-primary-light dark:text-text-primary-dark">
              Adicionar Local ao Roteiro
            </Text>
            <Text className="text-xs text-center text-text-muted-light dark:text-text-muted-dark mt-1 mb-6">
              Associe um ponto turístico a uma data do seu roteiro
            </Text>

            <ScrollView className="space-y-4 max-h-[60%]">
              {/* Destination Dropdown Mock/Selector */}
              <View>
                <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Selecione o Local *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
                  {destinations.map((dest) => {
                    const isSelected = selectedDestId === dest.id;
                    return (
                      <Pressable
                        key={dest.id}
                        onPress={() => setSelectedDestId(dest.id)}
                        className={`px-4 py-3 rounded-md border flex-row items-center ${
                          isSelected 
                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                            : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-base-light dark:bg-base-dark'
                        }`}
                      >
                        <Text className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                          {dest.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Date Input */}
              <View>
                <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Data de Visita (AAAA-MM-DD) *
                </Text>
                <TextInput
                  value={visitDate}
                  onChangeText={setVisitDate}
                  placeholder="Ex: 2026-07-15"
                  placeholderTextColor="#8C8779"
                  className="bg-base-light dark:bg-base-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-12 text-text-primary-light dark:text-text-primary-dark text-sm"
                />
              </View>

              {/* Notes Input */}
              <View>
                <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Notas / Observações
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Ex: Levar calçado confortável, almoçar no restaurante X..."
                  placeholderTextColor="#8C8779"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="bg-base-light dark:bg-base-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 py-3 h-20 text-text-primary-light dark:text-text-primary-dark text-sm"
                />
              </View>
            </ScrollView>

            {/* Error Message */}
            {formError && (
              <View className="p-3 bg-error/10 border border-error/20 rounded-md mt-4">
                <Text className="text-xs text-error font-medium text-center">
                  {formError}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row space-x-3 mt-6">
              <Pressable
                onPress={() => setAddModalVisible(false)}
                className="flex-1 h-12 bg-base-light dark:bg-base-dark border border-borderSubtle-light dark:border-borderSubtle-dark items-center justify-center rounded-md active:bg-borderSubtle-light"
              >
                <Text className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleAddDestination}
                disabled={addingToTrip}
                className="flex-1 h-12 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium"
              >
                {addingToTrip ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text className="text-xs font-bold text-white">Adicionar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
