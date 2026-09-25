import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOVT_CONFIG } from '@/constants/config';
import { CitizenProfile, Complaint } from '@/types';
import { Language } from '@/context/LanguageContext';

export const StorageService = {
  // Citizen Profile
  async getUser(): Promise<CitizenProfile | null> {
    try {
      const data = await AsyncStorage.getItem(GOVT_CONFIG.STORAGE_KEYS.CITIZEN_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('StorageService: Error getting user', e);
      return null;
    }
  },

  async setUser(profile: CitizenProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(GOVT_CONFIG.STORAGE_KEYS.CITIZEN_USER, JSON.stringify(profile));
    } catch (e) {
      console.error('StorageService: Error saving user', e);
    }
  },

  // Language
  async getLanguage(): Promise<Language | null> {
    try {
      const lang = await AsyncStorage.getItem(GOVT_CONFIG.STORAGE_KEYS.LANGUAGE);
      return (lang as Language) || null;
    } catch (e) {
      console.error('StorageService: Error getting language', e);
      return null;
    }
  },

  async setLanguage(lang: Language): Promise<void> {
    try {
      await AsyncStorage.setItem(GOVT_CONFIG.STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('StorageService: Error saving language', e);
    }
  },

  // Complaints
  async getComplaints(): Promise<Complaint[] | null> {
    try {
      const data = await AsyncStorage.getItem(GOVT_CONFIG.STORAGE_KEYS.COMPLAINTS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('StorageService: Error getting complaints', e);
      return null;
    }
  },

  async setComplaints(complaints: Complaint[]): Promise<void> {
    try {
      await AsyncStorage.setItem(GOVT_CONFIG.STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('StorageService: Error saving complaints', e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('StorageService: Error clearing storage', e);
    }
  },
};
