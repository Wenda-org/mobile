import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import i18n from '../../i18n';
import AuthButton from '../../components/AuthButton';

export default function Confirm() {
  const router = useRouter();
  const [code, setCode] = useState('');

  function verify() {
    // TODO: verify code with API
  router.replace('/' as any);
  }

  return (
    <View className="flex-1 justify-center">
      <Text className="text-2xl font-bold mb-4">{i18n.t('enter_code')}</Text>
      <TextInput value={code} onChangeText={setCode} placeholder="123456" className="w-full border border-gray-300 rounded-lg p-3 mb-4" />
      <AuthButton title={i18n.t('continue')} onPress={verify} />
    </View>
  );
}
