import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, Platform, ActivityIndicator, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { FadeInDownView } from '@/components/animated-wrappers';
import { feedService } from '@/services/feedService';
import { FeedPost } from '@/types/api.types';
import { Heart, MessageCircle, Send, Bookmark, MapPin, Share2, Award, Clock } from 'lucide-react-native';

const FILTER_TYPES = [
  { key: 'all', label: 'feed.filter_all' },
  { key: 'news', label: 'feed.filter_news' },
  { key: 'promo', label: 'feed.filter_promos' },
  { key: 'event', label: 'feed.filter_events' },
];

export default function FeedTabScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (filterKey: string, isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    try {
      const data = await feedService.getFeedPosts(filterKey);
      setPosts(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts(selectedFilter);
  }, [selectedFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(selectedFilter, true);
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    // Simulate infinite scroll pagination
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoadingMore(false);
  };

  const handleLike = async (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await feedService.likePost(postId);
    if (res.success) {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, isLiked: res.isLiked, likesCount: res.likesCount };
        }
        return post;
      }));
    }
  };

  const handleSave = async (postId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const res = await feedService.savePost(postId);
    if (res.success) {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, isSaved: res.isSaved };
        }
        return post;
      }));
    }
  };

  const handleCTA = (post: FeedPost) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (post.ctaLink) {
      if (post.ctaLink.startsWith('http')) {
        Linking.openURL(post.ctaLink);
      } else {
        // Local navigation if applicable, e.g. router.push(post.ctaLink)
      }
    }
  };

  const formatPublishTime = (isoString: string) => {
    const minutes = Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60));
    if (minutes < 60) {
      return t('feed.posted_ago', { time: `${minutes}m` });
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return t('feed.posted_ago', { time: `${hours}h` });
    }
    const days = Math.floor(hours / 24);
    return t('feed.posted_ago', { time: `${days}d` });
  };

  const renderSkeleton = () => (
    <View className="space-y-6 px-6 mt-4">
      {[1, 2].map((i) => (
        <View key={i} className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 space-y-4">
          <View className="flex-row items-center space-x-3">
            <View className="w-10 h-10 rounded-full bg-borderSubtle-light dark:bg-borderSubtle-dark" />
            <View className="space-y-2 flex-1">
              <View className="w-1/2 h-4 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded" />
              <View className="w-1/3 h-3 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded" />
            </View>
          </View>
          <View className="w-full h-48 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded-md" />
          <View className="w-full h-4 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded" />
          <View className="w-2/3 h-4 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded" />
        </View>
      ))}
    </View>
  );

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Title */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('feed.title')}
        </Text>
        <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
          {t('feed.subtitle')}
        </Text>
      </View>

      {/* Filter Chips Bar */}
      <View className="py-4 border-b border-borderSubtle-light dark:border-borderSubtle-dark">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {FILTER_TYPES.map((filter) => {
            const isSelected = selectedFilter === filter.key;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                className={`px-5 py-2.5 rounded-full mr-3 border ${
                  isSelected 
                    ? 'bg-primary border-primary' 
                    : 'bg-surface-light dark:bg-surface-dark border-borderSubtle-light dark:border-borderSubtle-dark'
                }`}
              >
                <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                  {t(filter.label)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Posts List */}
      {isLoading ? (
        renderSkeleton()
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#136F63" />
          }
          onScroll={({ nativeEvent }) => {
            const isCloseToBottom = nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 100;
            if (isCloseToBottom) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <FadeInDownView
                key={post.id}
                duration={400}
                className="bg-surface-light dark:bg-surface-dark border-b border-borderSubtle-light dark:border-borderSubtle-dark mb-3 p-4"
              >
                {/* Header */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-row items-center flex-1 mr-2">
                    <Image
                      source={{ uri: post.establishmentAvatar || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=50' }}
                      className="w-10 h-10 rounded-full bg-primary/10"
                      contentFit="cover"
                    />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark" numberOfLines={1}>
                        {post.establishmentName}
                      </Text>
                      <View className="flex-row items-center mt-0.5">
                        <MapPin size={10} color="#8C8779" />
                        <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark ml-1" numberOfLines={1}>
                          {post.location}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Badge */}
                  <View className={`px-2.5 py-1 rounded-full ${
                    post.type === 'promo' ? 'bg-secondary/15' : 
                    post.type === 'event' ? 'bg-primary/10' : 
                    'bg-info/10'
                  }`}>
                    <Text className={`text-[9px] font-bold ${
                      post.type === 'promo' ? 'text-secondary-900 dark:text-secondary-400' :
                      post.type === 'event' ? 'text-primary' :
                      'text-info-700'
                    }`}>
                      {t(`feed.${post.type}_tag`)}
                    </Text>
                  </View>
                </View>

                {/* Content */}
                <Text className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark leading-relaxed mb-3">
                  {post.title}
                </Text>
                <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
                  {post.content}
                </Text>

                {/* Images Gallery */}
                {post.images && post.images.length > 0 && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="mb-4"
                  >
                    {post.images.map((img, idx) => (
                      <Image
                        key={idx}
                        source={{ uri: img }}
                        className={`h-48 rounded-md bg-primary/5 mr-2 ${post.images.length > 1 ? 'w-72' : 'w-full'}`}
                        contentFit="cover"
                      />
                    ))}
                  </ScrollView>
                )}

                {/* Actions row */}
                <View className="flex-row justify-between items-center pt-2 border-t border-borderSubtle-light dark:border-borderSubtle-dark">
                  {/* Publish Time */}
                  <View className="flex-row items-center">
                    <Clock size={12} color="#8C8779" />
                    <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark ml-1">
                      {formatPublishTime(post.publishTime)}
                    </Text>
                  </View>

                  {/* Interactivity Buttons */}
                  <View className="flex-row items-center space-x-4">
                    {/* Like */}
                    <Pressable onPress={() => handleLike(post.id)} className="flex-row items-center p-1">
                      <Heart 
                        size={18} 
                        color={post.isLiked ? '#EF476F' : '#8C8779'} 
                        fill={post.isLiked ? '#EF476F' : 'transparent'} 
                      />
                      <Text className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark ml-1">
                        {post.likesCount}
                      </Text>
                    </Pressable>

                    {/* Bookmark */}
                    <Pressable onPress={() => handleSave(post.id)} className="p-1">
                      <Bookmark 
                        size={18} 
                        color={post.isSaved ? '#FFD166' : '#8C8779'} 
                        fill={post.isSaved ? '#FFD166' : 'transparent'} 
                      />
                    </Pressable>

                    {/* Share */}
                    <Pressable className="p-1">
                      <Share2 size={18} color="#8C8779" />
                    </Pressable>
                  </View>
                </View>

                {/* Call To Action Button */}
                {post.ctaText && (
                  <Pressable
                    onPress={() => handleCTA(post)}
                    className="w-full h-11 bg-primary/10 dark:bg-primary/20 items-center justify-center rounded-md active:bg-primary/20 mt-4"
                  >
                    <Text className="text-xs font-bold text-primary">
                      {post.ctaText}
                    </Text>
                  </Pressable>
                )}
              </FadeInDownView>
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20 px-6">
              <Text className="text-base text-text-muted-light dark:text-text-muted-dark italic text-center">
                {t('common.no_results')}
              </Text>
            </View>
          )}

          {/* Loading More spinner */}
          {loadingMore && (
            <View className="py-4">
              <ActivityIndicator size="small" color="#136F63" />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
