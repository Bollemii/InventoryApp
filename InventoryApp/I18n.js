import { I18n } from 'i18n-js';
import { I18nManager } from 'react-native';
import { getLocales } from 'expo-localization';

const translations = {
  en: require('./locales/en.json'),
  fr: require('./locales/fr.json'),
}
const i18n = new I18n(translations)

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode;
i18n.defaultLocale = 'en'

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true

//don't change app dir to rtl. 
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

export default i18n