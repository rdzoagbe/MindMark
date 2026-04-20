import { useLanguageContext } from '../contexts/LanguageContext';
import { TRANSLATIONS } from '../locales';

export function useTranslation() {
  const { preferredLanguage } = useLanguageContext();
  
  const translations = TRANSLATIONS[preferredLanguage] || TRANSLATIONS['EN'];

  const t = (path: string, params?: Record<string, string>) => {
    const keys = path.split('.');
    let value = translations;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to English if key missing in preferred language
        let fallbackValue = TRANSLATIONS['EN'];
        for (const fallbackKey of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
            fallbackValue = fallbackValue[fallbackKey];
          } else {
            return path; // Return key path if all fails
          }
        }
        value = fallbackValue;
        break;
      }
    }
    
    // If it's an object, we return it directly (useful for multi-field lookups like tiers)
    if (typeof value !== 'string') return value;

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        value = (value as string).replace(`{{${key}}}`, val);
      });
    }

    return value;
  };

  return { t, preferredLanguage };
}
