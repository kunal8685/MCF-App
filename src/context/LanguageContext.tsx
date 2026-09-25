import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const STORAGE_KEY = '@mcf_citizen_language';

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    appName: 'MCF CITIZEN',
    mcfFullTitle: 'Municipal Corporation Faridabad',
    home: 'Home',
    profile: 'Profile',
    faqs: 'FAQs',
    feedback: 'Feedback',
    changeLanguage: 'Change Language',
    logout: 'Logout',
    selectLanguage: 'Select Language',
    english: 'English',
    hindi: 'हिंदी (Hindi)',
    save: 'Save Preference',
    cancel: 'Cancel',
    weatherTitle: 'Faridabad, Haryana',
    mcfInfo: 'MCF Info',
    connectMcf: 'Connect With MCF',
    complaintsRedressal: 'Complaints Redressal',
    helpline: 'Helpline 24*7',
    whatNearMe: 'What Near Me',
    pensionerPortal: 'Pensioner Portal',
    allCitizenServices: 'All Citizen Services',
    waterSewage: 'Water & Sewage Complaints',
    eDirectory: 'E-Directory',
    lodgeComplaint: 'Lodge New Complaint',
    myComplaints: 'My Complaints',
    tollFree: 'Toll Free Helpline',
    submit: 'Submit',
    viewAll: 'View All',
  },
  hi: {
    welcome: 'नमस्ते',
    appName: 'एमसीएफ सिटीजन',
    mcfFullTitle: 'नगर निगम फरीदाबाद',
    home: 'होम',
    profile: 'प्रोफाइल',
    faqs: 'अक्सर पूछे जाने वाले प्रश्न',
    feedback: 'प्रतिक्रिया (फीडबैक)',
    changeLanguage: 'भाषा बदलें',
    logout: 'लॉग आउट',
    selectLanguage: 'भाषा चुनें',
    english: 'English',
    hindi: 'हिंदी (Hindi)',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    weatherTitle: 'फरीदाबाद, हरियाणा',
    mcfInfo: 'एमसीएफ जानकारी',
    connectMcf: 'एमसीएफ से जुड़ें',
    complaintsRedressal: 'शिकायत निवारण',
    helpline: 'हेल्पलाइन 24*7',
    whatNearMe: 'मेरे पास क्या है',
    pensionerPortal: 'पेंशनभोगी पोर्टल',
    allCitizenServices: 'सभी नागरिक सेवाएं',
    waterSewage: 'पानी और सीवेज शिकायतें',
    eDirectory: 'ई-डायरेक्टरी',
    lodgeComplaint: 'नई शिकायत दर्ज करें',
    myComplaints: 'मेरी शिकायतें',
    tollFree: 'टोल फ्री हेल्पलाइन',
    submit: 'जमा करें',
    viewAll: 'सभी देखें',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'hi' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch (e) {
      console.error('Failed to load language', e);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
