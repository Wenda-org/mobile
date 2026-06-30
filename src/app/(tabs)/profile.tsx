import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Platform, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { FadeInDownView } from '@/components/animated-wrappers';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { mlService } from '@/services/mlService';
import { User, LogOut, Settings, ShieldAlert, Sparkles, Moon, Sun, ChevronRight, Globe } from 'lucide-react-native';

const PREMIUM_AVATARS = [
  { id: 'av1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'av2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'av3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'av4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'av5', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { id: 'av6', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  { id: 'av7', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'av8', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { id: 'av9', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop&q=80' },
  { id: 'av10', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' }
];

export default function ProfileTabScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user, logout, updateProfile } = useAuth();
  const { theme, colorScheme, setTheme } = useTheme();

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [userSegment, setUserSegment] = useState<string>('Carregando...');
  const [segmentConfidence, setSegmentConfidence] = useState<number>(0);

  useEffect(() => {
    const fetchSegment = async () => {
      if (user?.id) {
        try {
          const res = await mlService.getUserSegment(user.id);
          setUserSegment(t(`quiz.styles.${res.segment}`) || res.segment);
          setSegmentConfidence(Math.round(res.confidence * 100));
        } catch {
          // Fallback based on user selected quiz preference style
          const fallbackStyle = user?.preferences?.style || 'relaxation';
          setUserSegment(t(`quiz.styles.${fallbackStyle}`));
          setSegmentConfidence(92);
        }
      }
    };
    fetchSegment();
  }, [user]);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/(auth)/login');
  };

  const handleAvatarSelect = async (url: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAvatarModalVisible(false);
    await updateProfile({ avatarUrl: url });
  };

  const toggleAppTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  const changeLanguageToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(nextLang);
    require('@react-native-async-storage/async-storage').default.setItem('@wenda_language', nextLang);
  };

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('profile.title')}
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 mt-4"
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 120 : 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <FadeInDownView className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-5 items-center mb-6 shadow-sm">
          {/* Avatar Area */}
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setAvatarModalVisible(true);
            }}
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-primary/5 items-center justify-center relative mb-4"
          >
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} className="w-full h-full" contentFit="cover" />
            ) : (
              <Text className="text-3xl font-bold text-primary">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            )}
            <View className="absolute bottom-0 left-0 right-0 bg-black/40 py-1">
              <Text className="text-[8px] text-white text-center font-bold">MUTAR</Text>
            </View>
          </Pressable>

          <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
            {user?.name || 'Viajante'}
          </Text>
          <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
            {user?.email || 'viajante@wenda.ao'}
          </Text>

          {/* AI Segment */}
          <View className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-md px-4 py-2 mt-4 flex-row items-center">
            <Sparkles size={14} color="#FFD166" className="mr-2" />
            <Text className="text-xs font-semibold text-primary">
              {t('profile.traveler_segment', { segment: userSegment })} ({segmentConfidence}%)
            </Text>
          </View>
        </FadeInDownView>

        {/* Options List */}
        <View className="space-y-3">
          {/* Check Preferences */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/check-preferences');
            }}
            className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 flex-row justify-between items-center"
          >
            <View className="flex-row items-center">
              <Sparkles size={18} color="#136F63" className="mr-3" />
              <Text className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {t('profile.edit_preferences')}
              </Text>
            </View>
            <ChevronRight size={18} color="#8C8779" />
          </Pressable>

          {/* Dark Mode Toggle */}
          <Pressable
            onPress={toggleAppTheme}
            className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 flex-row justify-between items-center"
          >
            <View className="flex-row items-center">
              {colorScheme === 'dark' ? (
                <Sun size={18} color="#FFD166" className="mr-3" />
              ) : (
                <Moon size={18} color="#136F63" className="mr-3" />
              )}
              <Text className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {colorScheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              </Text>
            </View>
            <View className="px-3 py-1 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded-md">
              <Text className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase">
                {colorScheme === 'dark' ? 'ON' : 'OFF'}
              </Text>
            </View>
          </Pressable>

          {/* Language Switch */}
          <Pressable
            onPress={changeLanguageToggle}
            className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 flex-row justify-between items-center"
          >
            <View className="flex-row items-center">
              <Globe size={18} color="#136F63" className="mr-3" />
              <Text className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {t('profile.language')}
              </Text>
            </View>
            <Text className="text-xs font-bold text-primary uppercase">
              {i18n.language}
            </Text>
          </Pressable>

          {/* Logout */}
          <Pressable
            onPress={handleLogout}
            className="bg-error/5 border border-error/20 rounded-md p-4 flex-row justify-between items-center mt-6"
          >
            <View className="flex-row items-center">
              <LogOut size={18} color="#EF476F" className="mr-3" />
              <Text className="text-sm font-semibold text-error">
                {t('profile.logout')}
              </Text>
            </View>
            <ChevronRight size={18} color="#EF476F" />
          </Pressable>
        </View>
      </ScrollView>

      {/* 10 Premium Illustrated Avatars Modal */}
      <Modal
        visible={avatarModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface-light dark:bg-surface-dark border-t border-borderSubtle-light dark:border-borderSubtle-dark rounded-t-lg p-6 max-h-[70%]">
            <View className="w-12 h-1 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded-full mx-auto mb-4" />
            
            <Text className="text-lg font-bold text-center text-text-primary-light dark:text-text-primary-dark">
              {t('profile.avatars_title')}
            </Text>
            <Text className="text-xs text-center text-text-muted-light dark:text-text-muted-dark mt-1 mb-6">
              {t('profile.avatars_subtitle')}
            </Text>

            <FlatList
              data={PREMIUM_AVATARS}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleAvatarSelect(item.url)}
                  className="w-[28%] aspect-square rounded-full overflow-hidden border-2 border-borderSubtle-light dark:border-borderSubtle-dark hover:border-primary active:border-primary"
                >
                  <Image source={{ uri: item.url }} className="w-full h-full" contentFit="cover" />
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />

            <Pressable
              onPress={() => setAvatarModalVisible(false)}
              className="w-full h-12 bg-base-light dark:bg-base-dark border border-borderSubtle-light dark:border-borderSubtle-dark items-center justify-center rounded-md active:bg-borderSubtle-light mt-4"
            >
              <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
