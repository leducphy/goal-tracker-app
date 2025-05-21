import { useAppContext } from '../contexts/AppContext';
import translations from './translations';

// Type for any parameters passed to the translation function
type TranslationParams = Record<string, string | number>;

export const useTranslation = () => {
  const { language } = useAppContext();
  
  const t = (
    key: keyof typeof translations.en | keyof typeof translations.vi, 
    params?: TranslationParams
  ) => {
    let translated = translations[language][key] || key;
    
    if (params) {
      Object.keys(params).forEach(param => {
        translated = translated.replace(
          new RegExp(`{{${param}}}`, 'g'), 
          String(params[param])
        );
      });
    }
    
    return translated;
  };
  
  return { t };
};

export default useTranslation; 