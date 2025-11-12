import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../../components/useColorScheme';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace('/language');
  };

  const changeLanguage = (lang: 'en' | 'pt') => {
    i18n.changeLanguage(lang);
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-4 flex-row items-center justify-between ${
        isDark ? 'bg-background-dark-secondary' : 'bg-white'
      } mb-2 rounded-xl`}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
          <Ionicons name={icon} size={20} color="#136F63" />
        </View>
        <View className="flex-1">
          <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            {title}
          </Text>
          {subtitle && (
            <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
      )}
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            {t('profile')}
          </Text>
        </View>

        {/* User Info Card */}
        <View className="px-4 mb-6">
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
            <View className="flex-row items-center">
              {/* Avatar */}
              <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mr-4">
                <Text className="text-white text-2xl font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              
              {/* User Details */}
              <View className="flex-1">
                <Text className={`text-xl font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  {user?.name || 'Guest User'}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                  {user?.email || 'guest@wenda.com'}
                </Text>
              </View>
              
              {/* Edit Button */}
              <TouchableOpacity className="w-8 h-8 items-center justify-center">
                <Ionicons name="create-outline" size={22} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View className="px-4">
          {/* Account Section */}
          <Text className={`text-sm font-semibold mb-2 px-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            ACCOUNT
          </Text>
          
          <MenuItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your details"
            onPress={() => console.log('Personal info')}
          />
          
          <MenuItem
            icon="heart-outline"
            title={t('preferences')}
            subtitle="Customize your experience"
            onPress={() => console.log('Preferences')}
          />
          
          <MenuItem
            icon="map-outline"
            title={t('my_trips')}
            subtitle="View saved itineraries"
            onPress={() => console.log('My trips')}
          />

          {/* Settings Section */}
          <Text className={`text-sm font-semibold mb-2 mt-6 px-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            SETTINGS
          </Text>
          
          {/* Notifications Toggle */}
          <View
            className={`px-4 py-4 flex-row items-center justify-between ${
              isDark ? 'bg-background-dark-secondary' : 'bg-white'
            } mb-2 rounded-xl`}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="notifications-outline" size={20} color="#136F63" />
              </View>
              <View className="flex-1">
                <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  {t('notifications')}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                  Enable push notifications
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#136F63' }}
              thumbColor={notificationsEnabled ? '#FFD166' : '#f4f3f4'}
            />
          </View>
          
          {/* Theme Switcher */}
          <TouchableOpacity
            onPress={() => {
              // Cycle through themes: light -> dark -> auto -> light
              if (theme === 'light') setTheme('dark');
              else if (theme === 'dark') setTheme('auto');
              else setTheme('light');
            }}
            className={`px-4 py-4 flex-row items-center justify-between ${
              isDark ? 'bg-background-dark-secondary' : 'bg-white'
            } mb-2 rounded-xl active:opacity-70`}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons 
                  name={theme === 'light' ? 'sunny-outline' : theme === 'dark' ? 'moon-outline' : 'sync-outline'} 
                  size={20} 
                  color="#136F63" 
                />
              </View>
              <View className="flex-1">
                <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  {t('theme')}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                  {theme === 'light' ? t('light_mode') : theme === 'dark' ? t('dark_mode') : t('auto_mode')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          
          <MenuItem
            icon="language-outline"
            title={t('language_settings')}
            subtitle={i18n.language === 'en' ? 'English' : 'Português'}
            onPress={() => router.push('/settings/language')}
          />

          {/* About Section */}
          <Text className={`text-sm font-semibold mb-2 mt-6 px-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            ABOUT
          </Text>
          
          <MenuItem
            icon="information-circle-outline"
            title={t('about')}
            subtitle="Learn more about Wenda"
            onPress={() => console.log('About')}
          />
          
          <MenuItem
            icon="mail-outline"
            title={t('contact')}
            subtitle="Get in touch with us"
            onPress={() => console.log('Contact')}
          />
          
          <MenuItem
            icon="document-text-outline"
            title={t('terms_of_service')}
            onPress={() => console.log('Terms')}
          />
          
          <MenuItem
            icon="shield-checkmark-outline"
            title={t('privacy_policy')}
            onPress={() => console.log('Privacy')}
          />

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="mt-6 mb-8 bg-error rounded-xl py-4 items-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text className="text-white text-base font-semibold">{t('logout')}</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text className={`text-center text-xs mb-6 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            Wenda v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

