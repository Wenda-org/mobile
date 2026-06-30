import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Platform, TextInput, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { FadeInDownView } from '@/components/animated-wrappers';
import { useDestinationDetail } from '@/hooks/useDestinations';
import { useFavorites } from '@/hooks/useFavorites';
import { reviewService } from '@/services/reviewService';
import { ChevronLeft, Star, Heart, MapPin, Compass, Info, MessageSquare, Plus } from 'lucide-react-native';

export default function DestinationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const { destination, isLoading, refetch } = useDestinationDetail(id as string);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // New Review Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handleToggleFavorite = async () => {
    if (!destination) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleFavorite(destination);
  };

  const handleAddReview = async () => {
    if (!id || !comment) {
      setReviewError('Por favor preencha o comentário.');
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    try {
      await reviewService.createReview({ destinationId: id as string, rating, comment });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setReviewModalVisible(false);
      // Reset form
      setRating(5);
      setComment('');
      // Refetch destination to see new review and updated average score
      await refetch();
    } catch (e: any) {
      setReviewError(e.response?.data?.message || 'Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading || !destination) {
    return (
      <View className="flex-1 bg-base-light dark:bg-base-dark items-center justify-center">
        <ActivityIndicator size="large" color="#136F63" />
      </View>
    );
  }

  const favorited = isFavorite(destination.id);

  return (
    <View className="flex-1 bg-base-light dark:bg-base-dark">
      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Images Carousel */}
        <View className="relative w-full h-[320px] bg-primary/10">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
              if (slide !== activeImageIdx) {
                setActiveImageIdx(slide);
              }
            }}
            scrollEventThrottle={200}
          >
            {destination.images && destination.images.length > 0 ? (
              destination.images.map((img: any, idx: number) => (
                <Image
                  key={idx}
                  source={{ uri: img.url }}
                  className="w-screen h-[320px]"
                  contentFit="cover"
                />
              ))
            ) : (
              <View className="w-screen h-[320px] items-center justify-center bg-primary/5">
                <Compass size={64} color="#136F63" />
              </View>
            )}
          </ScrollView>

          {/* Dots Indicator */}
          {destination.images && destination.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-1.5 z-10">
              {destination.images.map((_: any, idx: number) => (
                <View
                  key={idx}
                  className={`h-1.5 rounded-full ${
                    idx === activeImageIdx ? 'w-4 bg-primary' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </View>
          )}

          {/* Floating Actions overlay */}
          <View 
            className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-6 z-10"
            style={{ paddingTop: insets.top + 10 }}
          >
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-black/40 rounded-full items-center justify-center"
            >
              <ChevronLeft size={24} color="#FFF" />
            </Pressable>

            <Pressable
              onPress={handleToggleFavorite}
              className="w-10 h-10 bg-black/40 rounded-full items-center justify-center"
            >
              <Heart size={20} color={favorited ? '#EF476F' : '#FFF'} fill={favorited ? '#EF476F' : 'transparent'} />
            </Pressable>
          </View>
        </View>

        {/* Info Area */}
        <View className="px-6 pt-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-3">
              <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {destination.name}
              </Text>
              <View className="flex-row items-center mt-2">
                <MapPin size={14} color="#8C8779" />
                <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark ml-1">
                  {destination.province || destination.location}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center bg-secondary/15 px-3 py-1.5 rounded-md">
              <Star size={14} color="#FFD166" fill="#FFD166" />
              <Text className="text-sm font-bold text-secondary-900 dark:text-secondary-400 ml-1">
                {destination.rating || '4.5'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mt-6 mb-2">
            Descrição
          </Text>
          <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            {destination.description}
          </Text>

          {/* Facilities / Accommodations */}
          {destination.facilities && destination.facilities.length > 0 && (
            <View className="mt-6">
              <Text className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
                Facilidades
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {destination.facilities.map((fac: string, idx: number) => (
                  <View 
                    key={idx}
                    className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-3 py-1.5"
                  >
                    <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {fac}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Reviews List */}
          <View className="mt-8 border-t border-borderSubtle-light dark:border-borderSubtle-dark pt-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <MessageSquare size={18} color="#136F63" className="mr-2" />
                <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                  Avaliações ({destination.reviews?.length || 0})
                </Text>
              </View>
              
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setReviewModalVisible(true);
                }}
                className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-md"
              >
                <Plus size={14} color="#136F63" className="mr-1" />
                <Text className="text-xs font-bold text-primary">Avaliar</Text>
              </Pressable>
            </View>

            {destination.reviews && destination.reviews.length > 0 ? (
              <View className="space-y-4">
                {destination.reviews.map((rev) => (
                  <View 
                    key={rev.id}
                    className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4"
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark" numberOfLines={1}>
                        {rev.user?.name || 'Viajante Wenda'}
                      </Text>
                      
                      <View className="flex-row items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={10}
                            color={s <= rev.rating ? '#FFD166' : '#8C8779'}
                            fill={s <= rev.rating ? '#FFD166' : 'transparent'}
                          />
                        ))}
                      </View>
                    </View>
                    

                    <Text className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      {rev.comment}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-xs text-text-muted-light dark:text-text-muted-dark italic py-4 text-center">
                Seja o primeiro a avaliar este destino!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Review Submission Modal */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface-light dark:bg-surface-dark border-t border-borderSubtle-light dark:border-borderSubtle-dark rounded-t-lg p-6 max-h-[90%]">
            <View className="w-12 h-1 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded-full mx-auto mb-4" />
            
            <Text className="text-lg font-bold text-center text-text-primary-light dark:text-text-primary-dark">
              Avaliar Destino
            </Text>
            <Text className="text-xs text-center text-text-muted-light dark:text-text-muted-dark mt-1 mb-6">
              Deixe a sua opinião sincera sobre a experiência
            </Text>

            {/* Stars Selector */}
            <View className="flex-row justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setRating(s);
                  }}
                  className="p-1"
                >
                  <Star
                    size={32}
                    color={s <= rating ? '#FFD166' : '#8C8779'}
                    fill={s <= rating ? '#FFD166' : 'transparent'}
                  />
                </Pressable>
              ))}
            </View>

            {/* Form Inputs */}
            <View className="space-y-4">

              <View>
                <Text className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Comentário
                </Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Escreva aqui a sua experiência..."
                  placeholderTextColor="#8C8779"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-base-light dark:bg-base-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 py-3 h-28 text-text-primary-light dark:text-text-primary-dark text-sm"
                />
              </View>
            </View>

            {/* Error Message */}
            {reviewError && (
              <View className="p-3 bg-error/10 border border-error/20 rounded-md mt-4">
                <Text className="text-xs text-error font-medium text-center">
                  {reviewError}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row space-x-3 mt-6">
              <Pressable
                onPress={() => setReviewModalVisible(false)}
                className="flex-1 h-12 bg-base-light dark:bg-base-dark border border-borderSubtle-light dark:border-borderSubtle-dark items-center justify-center rounded-md active:bg-borderSubtle-light"
              >
                <Text className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleAddReview}
                disabled={submittingReview}
                className="flex-1 h-12 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium"
              >
                {submittingReview ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text className="text-xs font-bold text-white">Enviar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
