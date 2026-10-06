import AsyncStorage from '@react-native-async-storage/async-storage';
import URLS from './base_url';

export const DEMO_MOBILE = '9999999999';
export const DEMO_OTP = '123456';

export const DEMO_CITIZEN_PROFILE = {
  id: 'DEMO-CITIZEN-9999999999',
  user_id: 'DEMO-CITIZEN-9999999999',
  citizen_id: 'CIT-DEMO-9999999999',
  citizenId: 'CIT-DEMO-9999999999',
  name: 'Demo Citizen',
  full_name: 'Demo Citizen',
  phone: '+91 9999999999',
  mobile_number: '9999999999',
  email: 'demo.citizen@example.com',
  ward: 'Ward 14, Old Faridabad',
  wardName: 'Ward 14 — Old Faridabad',
  ward_name: 'Ward 14 — Old Faridabad',
  zone: 'Old Faridabad',
  address: 'Near BK Chowk, NIT, Faridabad, Haryana - 121001',
  city: 'Faridabad',
  state: 'Haryana',
  gender: 'Male',
  aadhaar: 'XXXX-XXXX-9999',
  aadhaar_number: 'XXXX-XXXX-9999',
  user_type: 'Citizen',
  account_type: 'Demo/Reviewer',
  is_demo: true,
};

export const extractErrorMessage = (errorData: any, status?: number, fallback: string = 'An error occurred'): string => {
  if (status === 502 || status === 503 || status === 504) {
    return 'Server is temporarily unavailable. Please try again in a few moments.';
  }

  if (!errorData) return fallback;

  if (typeof errorData === 'string') {
    if (
      errorData.toLowerCase().includes('cloudflare') ||
      errorData.toLowerCase().includes('bad gateway') ||
      errorData.trim().startsWith('<!DOCTYPE html') ||
      errorData.trim().startsWith('<html')
    ) {
      return 'Server is temporarily unavailable. Please try again in a few moments.';
    }
    return errorData;
  }

  const detail = errorData.detail;
  if (typeof detail === 'string' && detail.trim()) {
    if (
      detail.toLowerCase().includes('cloudflare') ||
      detail.toLowerCase().includes('bad gateway') ||
      detail.trim().startsWith('<!DOCTYPE html')
    ) {
      return 'Server is temporarily unavailable. Please try again in a few moments.';
    }
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item: any) => {
        if (typeof item === 'string') return item;
        if (item?.msg) return item.msg;
        if (item?.message) return item.message;
        return JSON.stringify(item);
      })
      .join(', ');
  }

  if (typeof errorData.message === 'string' && errorData.message.trim()) {
    return errorData.message;
  }

  if (typeof errorData.error === 'string' && errorData.error.trim()) {
    return errorData.error;
  }

  if (typeof errorData === 'object' && !Array.isArray(errorData)) {
    const firstKey = Object.keys(errorData)[0];
    const val = errorData[firstKey];
    if (typeof val === 'string' && val.trim()) return val;
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
      return val[0];
    }
  }

  return fallback;
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch {
    return null;
  }
};

const makeRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${URLS.BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  let retryCount = 0;
  const maxRetries = 2;

  while (retryCount <= maxRetries) {
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const status = response.status;
      let data: any = null;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = text;
      }

      const isGatewayError = status === 502 || status === 503 || status === 504;
      if (isGatewayError && retryCount < maxRetries) {
        retryCount++;
        await new Promise((res) => setTimeout(res, retryCount === 1 ? 1500 : 2500));
        continue;
      }

      if (!response.ok) {
        const errorMsg = extractErrorMessage(data, status, `Request failed with status ${status}`);
        throw new Error(errorMsg);
      }

      return data;
    } catch (err: any) {
      if (retryCount >= maxRetries || !err.message?.includes('50')) {
        throw err;
      }
      retryCount++;
      await new Promise((res) => setTimeout(res, 1500));
    }
  }
};

// ======================== AUTH APIS ========================

export const sendOtpApi = async (phone: string) => {
  const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);

  if (cleanPhone === DEMO_MOBILE) {
    return {
      success: true,
      message: 'Demo OTP generated successfully for Reviewer account.',
      expires_in: 60,
      is_demo: true,
    };
  }

  return makeRequest('/auth/otp/request/citizen', {
    method: 'POST',
    body: JSON.stringify({ phone: cleanPhone }),
  });
};

export const verifyOtpApi = async (phone: string, otp: string) => {
  const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
  const cleanOtp = String(otp || '').trim();

  if (cleanPhone === DEMO_MOBILE) {
    if (cleanOtp !== DEMO_OTP) {
      throw new Error('Invalid OTP. For Demo Reviewer account (9999999999), please enter OTP 123456.');
    }

    const demoData = {
      access_token: 'demo-reviewer-access-token-9999999999-jwt',
      refresh_token: 'demo-reviewer-refresh-token-9999999999-jwt',
      user_id: 'DEMO-CITIZEN-9999999999',
      role: 'citizen',
      is_demo: true,
      expires_at: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000),
      citizen: DEMO_CITIZEN_PROFILE,
      profile: DEMO_CITIZEN_PROFILE,
    };

    const storagePairs: [string, string][] = [
      ['access_token', demoData.access_token],
      ['refresh_token', demoData.refresh_token],
      ['user_id', demoData.user_id],
      ['role', demoData.role],
      ['is_demo_user', 'true'],
    ];
    await AsyncStorage.multiSet(storagePairs);
    return demoData;
  }

  const data = await makeRequest('/auth/otp/verify_citizen', {
    method: 'POST',
    body: JSON.stringify({ phone: cleanPhone, code: cleanOtp }),
  });

  const storagePairs: [string, string][] = [];
  if (data?.access_token) storagePairs.push(['access_token', String(data.access_token)]);
  if (data?.refresh_token) storagePairs.push(['refresh_token', String(data.refresh_token)]);
  if (data?.user_id) storagePairs.push(['user_id', String(data.user_id)]);
  if (data?.role) storagePairs.push(['role', String(data.role)]);
  if (storagePairs.length) {
    await AsyncStorage.multiSet(storagePairs);
  }

  return data;
};

export interface RegisterCitizenPayload {
  full_name: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  gender?: string;
  email?: string;
}

export const registerCitizenApi = async (payload: RegisterCitizenPayload) => {
  const data = await makeRequest('/auth/citizen/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const storagePairs: [string, string][] = [];
  if (data?.access_token) storagePairs.push(['access_token', String(data.access_token)]);
  if (data?.refresh_token) storagePairs.push(['refresh_token', String(data.refresh_token)]);
  const userId = data?.citizen?.user_id || data?.citizen?.id || data?.user_id;
  if (userId) storagePairs.push(['user_id', String(userId)]);
  const role = data?.citizen?.role || data?.role || 'citizen';
  storagePairs.push(['role', String(role)]);

  if (storagePairs.length) {
    await AsyncStorage.multiSet(storagePairs);
  }

  return data;
};

export const getCitizenProfileApi = async (overrideToken?: string) => {
  const token = overrideToken || (await getAccessToken());
  const userId = await AsyncStorage.getItem('user_id');
  const isDemoUser = (await AsyncStorage.getItem('is_demo_user')) === 'true' || userId === 'DEMO-CITIZEN-9999999999';

  if (token === 'demo-reviewer-access-token-9999999999-jwt' || isDemoUser) {
    return {
      status: 'success',
      citizen: DEMO_CITIZEN_PROFILE,
      profile: DEMO_CITIZEN_PROFILE,
      data: DEMO_CITIZEN_PROFILE,
    };
  }

  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const response = await makeRequest('/auth/citizen/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
