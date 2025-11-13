import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useColorScheme } from '../components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TestPreferencesScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);

  const testSimpleUpdate = async () => {
    try {
      setLoading(true);
      console.log('=== TESTE 1: Update simples (apenas nome) ===');
      
      const result = await updateProfile({
        name: user?.name || 'Test User',
      });

      console.log('Result:', result);
      
      if (result.success) {
        Alert.alert('✅ Sucesso', 'Update simples funcionou!');
      } else {
        Alert.alert('❌ Erro', result.error || 'Falhou');
      }
    } catch (error: any) {
      console.error('Test error:', error);
      Alert.alert('❌ Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testPreferencesUpdate = async () => {
    try {
      setLoading(true);
      console.log('=== TESTE 2: Update com preferences ===');
      
      const testPreferences = {
        favoriteCategories: ['test1', 'test2'],
        travelStyle: ['adventure', 'cultural'],
        budgetRange: 'medium',
      };

      console.log('Sending preferences:', testPreferences);
      
      const result = await updateProfile({
        preferences: testPreferences,
      });

      console.log('Result:', result);
      
      if (result.success) {
        Alert.alert('✅ Sucesso', 'Update com preferences funcionou!');
      } else {
        Alert.alert('❌ Erro', result.error || 'Falhou');
      }
    } catch (error: any) {
      console.error('Test error:', error);
      Alert.alert('❌ Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testFullUpdate = async () => {
    try {
      setLoading(true);
      console.log('=== TESTE 3: Update completo (nome + preferences) ===');
      
      const fullData = {
        name: user?.name || 'Test User',
        preferences: {
          favoriteCategories: ['praia', 'historico', 'aventura'],
          travelStyle: ['adventure', 'cultural', 'nature'],
          budgetRange: 'high',
          travelWith: 'couple',
          activityLevel: 'moderate',
          notifications: {
            recommendations: true,
            deals: true,
            updates: false,
            newsletter: true,
          },
        },
      };

      console.log('Sending full data:', JSON.stringify(fullData, null, 2));
      
      const result = await updateProfile(fullData);

      console.log('Result:', result);
      
      if (result.success) {
        Alert.alert('✅ Sucesso', 'Update completo funcionou!\n\nVerifique o console para ver os dados salvos.');
        console.log('User preferences saved:', result.user?.preferences);
      } else {
        Alert.alert('❌ Erro', result.error || 'Falhou');
      }
    } catch (error: any) {
      console.error('Test error:', error);
      Alert.alert('❌ Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Header */}
      <View className="px-6 pt-12 pb-6 border-b border-border-light dark:border-border-dark">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          Test Preferences API
        </Text>
        <Text className={`text-sm mt-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
          Testes para verificar se o updateProfile está funcionando
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* User Info */}
        <View className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-background-dark-secondary' : 'bg-white'}`}>
          <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            Usuário Atual
          </Text>
          <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            Nome: {user?.name}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            Email: {user?.email}
          </Text>
          <Text className={`text-xs mt-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            Preferences: {JSON.stringify(user?.preferences, null, 2)}
          </Text>
        </View>

        {/* Test Buttons */}
        <View className="gap-4">
          <TouchableOpacity
            onPress={testSimpleUpdate}
            disabled={loading}
            className="p-4 rounded-xl bg-blue-500 disabled:opacity-50"
          >
            <Text className="text-white font-semibold text-center">
              {loading ? 'Testando...' : 'Teste 1: Update Simples (Nome)'}
            </Text>
            <Text className="text-white text-xs text-center mt-1">
              Atualiza apenas o nome do usuário
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testPreferencesUpdate}
            disabled={loading}
            className="p-4 rounded-xl bg-purple-500 disabled:opacity-50"
          >
            <Text className="text-white font-semibold text-center">
              {loading ? 'Testando...' : 'Teste 2: Update Preferences'}
            </Text>
            <Text className="text-white text-xs text-center mt-1">
              Atualiza apenas preferences
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testFullUpdate}
            disabled={loading}
            className="p-4 rounded-xl bg-primary disabled:opacity-50"
          >
            <Text className="text-white font-semibold text-center">
              {loading ? 'Testando...' : 'Teste 3: Update Completo'}
            </Text>
            <Text className="text-white text-xs text-center mt-1">
              Atualiza nome + preferences completas
            </Text>
          </TouchableOpacity>
        </View>

        <View className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-100'}`}>
          <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-yellow-200' : 'text-yellow-900'}`}>
            ℹ️ Como usar:
          </Text>
          <Text className={`text-xs ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
            1. Abra o console (Metro Bundler){'\n'}
            2. Clique em um teste{'\n'}
            3. Veja os logs detalhados no console{'\n'}
            4. Verifique se houve sucesso ou erro{'\n'}
            {'\n'}
            Os logs mostrarão:{'\n'}
            - Dados enviados{'\n'}
            - Resposta do servidor{'\n'}
            - Erros (se houver)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
