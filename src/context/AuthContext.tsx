import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCitizenProfileApi } from '@/services/citizenApi';

export interface UserProfile {
  name: string;
  mobile: string;
  email: string;
  ward: string;
  address: string;
  isLoggedIn: boolean;
  gender?: string;
  city?: string;
  state?: string;
  userId?: string;
  role?: string;
}

const EMPTY_USER: UserProfile = {
  name: '',
  mobile: '',
  email: '',
  ward: '',
  address: '',
  isLoggedIn: false,
};

interface AuthContextType {
  user: UserProfile;
  login: (mobile: string, name?: string, profileData?: any) => Promise<void>;
  register: (details: Partial<UserProfile>) => Promise<void>;
  updateProfile: (details: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@mcf_citizen_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(EMPTY_USER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const buildProfileFromApi = (data: any, fallbackPhone?: string): UserProfile => {
    const citizen = data?.citizen ?? data?.user ?? data?.profile ?? data?.data ?? data ?? {};
    const rawPhone = citizen.mobile_number || citizen.phone || fallbackPhone || '';
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);

    return {
      name: citizen.full_name || citizen.name || citizen.fullName || 'Citizen',
      mobile: cleanPhone,
      email: citizen.email || '',
      ward: citizen.ward_name || citizen.wardName || citizen.ward || 'Faridabad Municipal Area',
      address: citizen.address || 'Faridabad, Haryana',
      city: citizen.city || 'Faridabad',
      state: citizen.state || 'Haryana',
      gender: citizen.gender || '',
      userId: citizen.user_id || citizen.id || data?.user_id,
      role: citizen.role || data?.role || 'citizen',
      isLoggedIn: true,
    };
  };

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (token) {
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser({ ...parsed, isLoggedIn: true });
          } catch {
            // fallback
          }
        }

        // Try syncing fresh profile in the background
        try {
          const profileResponse = await getCitizenProfileApi(token);
          if (profileResponse) {
            const freshUser = buildProfileFromApi(profileResponse);
            setUser(freshUser);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(freshUser));
          }
        } catch (err) {
          console.warn('Could not refresh profile on app startup:', err);
        }
      } else {
        setUser(EMPTY_USER);
      }
    } catch (e) {
      console.error('Failed to load user', e);
      setUser(EMPTY_USER);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;
      const profileResponse = await getCitizenProfileApi(token);
      if (profileResponse) {
        const freshUser = buildProfileFromApi(profileResponse, user.mobile);
        setUser(freshUser);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(freshUser));
      }
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    }
  };

  const login = async (mobile: string, name?: string, profileData?: any) => {
    let updated: UserProfile;

    if (profileData) {
      updated = buildProfileFromApi(profileData, mobile);
      if (name && updated.name === 'Citizen') {
        updated.name = name;
      }
    } else {
      updated = {
        name: name || user.name || 'Citizen',
        mobile: mobile ? String(mobile).replace(/\D/g, '').slice(-10) : user.mobile,
        email: user.email || '',
        ward: user.ward || 'Faridabad Municipal Area',
        address: user.address || 'Faridabad, Haryana',
        city: user.city || 'Faridabad',
        state: user.state || 'Haryana',
        gender: user.gender || '',
        isLoggedIn: true,
      };
    }

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
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEY,
        'access_token',
        'refresh_token',
        'user_id',
        'role',
        'is_demo_user',
      ]);
    } catch (e) {
      console.error('Error during logout removal:', e);
    }
    setUser(EMPTY_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateProfile,
        logout,
        isLoading,
        refreshProfile,
      }}
    >
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
