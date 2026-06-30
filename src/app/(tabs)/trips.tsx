import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { FadeInDownView } from '@/components/animated-wrappers';
import { useTripsStore } from '@/stores/useTripsStore';
import { Calendar, Plus, Compass, ChevronRight, MapPin } from 'lucide-react-native';

export default function TripsTabScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { trips, isLoading, fetchTrips } = useTripsStore();

  useEffect(() => {
    fetchTrips().catch(() => {});
  }, []);

  const handleRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchTrips();
  };

  const handleTripPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/trip/${id}`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(t('language.locale') === 'pt' ? 'pt-AO' : 'en-US', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
        <View>
          <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('trips.title')}
          </Text>
          <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
            {t('trips.subtitle')}
          </Text>
        </View>
        
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/trip/new');
          }}
          className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-premium"
        >
          <Plus size={20} color="#FFF" />
        </Pressable>
      </View>

      {/* Main Content */}
      {isLoading && trips.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#136F63" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 mt-4"
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#136F63" />
          }
        >
          {trips.length > 0 ? (
            <View className="space-y-4">
              {trips.map((trip) => (
                <FadeInDownView
                  key={trip.id}
                  duration={400}
                >
                  <Pressable
                    onPress={() => handleTripPress(trip.id)}
                    className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 flex-row justify-between items-center shadow-sm"
                  >
                    <View className="flex-1 mr-3">
                      <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
                        {trip.title}
                      </Text>
                      
                      <View className="flex-row items-center mt-2 space-x-4">
                        <View className="flex-row items-center">
                          <Calendar size={12} color="#8C8779" />
                          <Text className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark ml-1">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <MapPin size={12} color="#8C8779" />
                          <Text className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark ml-1">
                            {trip.destinations?.length || 0} locais
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <ChevronRight size={20} color="#8C8779" />
                  </Pressable>
                </FadeInDownView>
              ))}
            </View>
          ) : (
            /* Empty State */
            <FadeInDownView className="flex-1 items-center justify-center py-20 px-4">
              <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                <Compass size={36} color="#136F63" />
              </View>
              <Text className="text-lg font-bold text-center text-text-primary-light dark:text-text-primary-dark">
                Nenhum roteiro planeado
              </Text>
              <Text className="text-sm text-center text-text-secondary-light dark:text-text-secondary-dark mt-2 leading-relaxed max-w-xs">
                {t('trips.empty_state')}
              </Text>
              
              <Pressable
                onPress={() => router.push('/trip/new')}
                className="mt-8 px-8 h-12 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium"
              >
                <Text className="text-sm font-bold text-white">Planear Primeira Viagem</Text>
              </Pressable>
            </FadeInDownView>
          )}
        </ScrollView>
      )}
    </View>
  );
}
