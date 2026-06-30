import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const getStoredLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem('@wenda_language');
    if (lang) return lang;
    
    // Fallback to system locale
    const locales = Localization.getLocales ? Localization.getLocales() : [];
    if (locales && locales.length > 0) {
      const systemLanguage = locales[0].languageCode;
      return systemLanguage === 'pt' ? 'pt' : 'en';
    }
  } catch (e) {
    // Ignore error
  }
  return 'pt'; // default to Portuguese
};

const initI18n = async () => {
  const lang = await getStoredLanguage();
  
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        pt: { translation: pt },
        en: { translation: en }
      },
      lng: lang,
      fallbackLng: 'pt',
      compatibilityJSON: 'v3',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false
      }
    });
};

initI18n();

export default i18n;
export { getStoredLanguage };
