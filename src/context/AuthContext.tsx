import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  mobile: string;
  email: string;
  ward: string;
  address: string;
  isLoggedIn: boolean;
}

const DEFAULT_USER: UserProfile = {
  name: 'Kunal Jagtap',
  mobile: '9876543210',
  email: 'kunal.jagtap@example.com',
  ward: 'Ward 14, Old Faridabad',
  address: 'House No. 452, Sector 15, Faridabad, Haryana',
  isLoggedIn: true,
};

interface AuthContextType {
  user: UserProfile;
  login: (mobile: string, name?: string) => Promise<void>;
  register: (details: Partial<UserProfile>) => Promise<void>;
  updateProfile: (details: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@mcf_citizen_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to logged in as per screenshot
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (mobile: string, name?: string) => {
    const updated: UserProfile = {
      ...user,
      mobile: mobile || user.mobile,
      name: name || user.name,
      isLoggedIn: true,
    };
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const register = async (details: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...user,
      ...details,
      isLoggedIn: true,
    };
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateProfile = async (details: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...user,
      ...details,
    };
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const logout = async () => {
    const loggedOut: UserProfile = {
      ...user,
      isLoggedIn: false,
    };
    setUser(loggedOut);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loggedOut));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
