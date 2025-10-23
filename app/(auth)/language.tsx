import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import i18n from '../../i18n';

export default function Language() {
  const router = useRouter();

  function setLang(l: 'en' | 'pt') {
    i18n.changeLanguage(l);
    router.replace('/onboarding/0' as any);
  }

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-3xl font-bold mb-8 text-gray-800">Escolha seu idioma</Text>
      <TouchableOpacity
        onPress={() => setLang('pt')}
        className="w-full bg-blue-500 py-4 rounded-lg mb-4 items-center"
      >
        <Text className="text-white font-semibold text-lg">Português</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setLang('en')}
        className="w-full border-2 border-blue-500 py-4 rounded-lg items-center"
      >
        <Text className="text-blue-500 font-semibold text-lg">English</Text>
      </TouchableOpacity>
    </View>
  );
}
