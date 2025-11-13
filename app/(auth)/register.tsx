import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import { useAuth } from '../../hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { uploadImage } from '../../services/upload.service';

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { register, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setAvatarUri(uri);
        
        setUploadingImage(true);
        try {
          const publicUrl = await uploadImage(uri);
          setAvatarUrl(publicUrl);
          Alert.alert('Sucesso', 'Foto carregada com sucesso!');
        } catch (error) {
          Alert.alert('Erro', 'Falha ao fazer upload da foto. Tente novamente.');
          setAvatarUri(null);
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Erro', 'Erro ao selecionar imagem.');
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert('Erro', 'O nome deve ter pelo menos 3 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    if (phone && phone.trim().length < 9) {
      Alert.alert('Erro', 'Por favor, insira um número de telefone válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      setLocalLoading(true);
      const result = await register(
        name.trim(),
        email.trim().toLowerCase(),
        password,
        confirmPassword,
        phone.trim() || undefined,
        avatarUrl || undefined
      );

      if (result.success) {
        Alert.alert(
          'Conta criada!',
          'Sua conta foi criada com sucesso. Agora vamos personalizar sua experiência!',
          [
            {
              text: 'Continuar',
              onPress: () => router.replace('/preferences-setup'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Erro ao criar conta',
          result.error || 'Ocorreu um erro ao criar sua conta. Tente novamente.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
      console.error('Register error:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    Alert.alert(
      'Em breve',
      'Registro com Google estará disponível em breve!'
    );
  };

  const loading = isLoading || localLoading;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-12">
            <View className="mb-8">
              <Text className={`text-4xl font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {t('create_account')}
              </Text>
              <Text className={`text-base ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                {t('register_subtitle')}
              </Text>
            </View>

            <View className="items-center mb-6">
              <TouchableOpacity 
                onPress={pickImage}
                disabled={uploadingImage}
                className="relative"
              >
                <View className={`w-24 h-24 rounded-full items-center justify-center ${
                  isDark ? 'bg-background-dark-secondary border-2 border-border-dark' : 'bg-background-light-secondary border-2 border-border-light'
                }`}>
                  {uploadingImage ? (
                    <ActivityIndicator color={isDark ? '#fff' : '#000'} />
                  ) : avatarUri ? (
                    <Image source={{ uri: avatarUri }} className="w-full h-full rounded-full" />
                  ) : (
                    <Ionicons name="person" size={40} color={isDark ? '#B0B3B8' : '#65676B'} />
                  )}
                </View>
                <View className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white">
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>
              <Text className={`text-xs mt-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Toque para adicionar foto
              </Text>
            </View>

            <View className="mb-6">
              <View className="mb-4">
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  {t('name')} *
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={t('name_placeholder')}
                  placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
                  autoCapitalize="words"
                  className={`w-full px-4 py-3.5 rounded-xl text-base ${
                    isDark 
                      ? 'bg-background-dark-secondary text-text-dark border border-border-dark' 
                      : 'bg-background-light-secondary text-text-light border border-border-light'
                  }`}
                />
              </View>

              <View className="mb-4">
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  {t('email')} *
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('email_placeholder')}
                  placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`w-full px-4 py-3.5 rounded-xl text-base ${
                    isDark 
                      ? 'bg-background-dark-secondary text-text-dark border border-border-dark' 
                      : 'bg-background-light-secondary text-text-light border border-border-light'
                  }`}
                />
              </View>

              <View className="mb-4">
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  Telefone
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+244 923 456 789"
                  placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
                  keyboardType="phone-pad"
                  className={`w-full px-4 py-3.5 rounded-xl text-base ${
                    isDark 
                      ? 'bg-background-dark-secondary text-text-dark border border-border-dark' 
                      : 'bg-background-light-secondary text-text-light border border-border-light'
                  }`}
                />
              </View>

              <View className="mb-4">
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  {t('password')} *
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('password_placeholder')}
                  placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
                  secureTextEntry
                  className={`w-full px-4 py-3.5 rounded-xl text-base ${
                    isDark 
                      ? 'bg-background-dark-secondary text-text-dark border border-border-dark' 
                      : 'bg-background-light-secondary text-text-light border border-border-light'
                  }`}
                />
              </View>

              <View className="mb-4">
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  {t('confirm_password')} *
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t('confirm_password_placeholder')}
                  placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
                  secureTextEntry
                  className={`w-full px-4 py-3.5 rounded-xl text-base ${
                    isDark 
                      ? 'bg-background-dark-secondary text-text-dark border border-border-dark' 
                      : 'bg-background-light-secondary text-text-light border border-border-light'
                  }`}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={`bg-primary rounded-xl py-4 items-center mb-4 ${loading ? 'opacity-50' : ''}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-semibold">{t('register')}</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
              <Text className={`mx-4 text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                {t('or_continue_with')}
              </Text>
              <View className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            </View>

            <TouchableOpacity
              onPress={handleGoogleRegister}
              className={`rounded-xl py-4 px-4 flex-row items-center justify-center mb-6 ${
                isDark 
                  ? 'bg-background-dark-secondary border border-border-dark' 
                  : 'bg-white border border-border-light'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text className={`text-base font-semibold ml-3 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {t('sign_in_with_google')}
              </Text>
            </TouchableOpacity>

            <Text className={`text-xs text-center mb-6 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {t('by_signing_up')}{' '}
              <Text className="text-primary">{t('terms_of_service')}</Text>
              {' '}{t('and')}{' '}
              <Text className="text-primary">{t('privacy_policy')}</Text>
            </Text>

            <View className="flex-row justify-center">
              <Text className={`text-base ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                {t('already_have_account')}{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text className="text-primary text-base font-semibold">{t('sign_in')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

