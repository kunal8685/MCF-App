import { GOVT_CONFIG } from '@/constants/config';
import { Complaint, CitizenProfile } from '@/types';
import URLS from './base_url';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

/**
 * Enterprise API client abstraction for Municipal Corporation Faridabad backend.
 */
class ApiService {
  private baseUrl: string = URLS.BASE_URL;

  private getHeaders(token?: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-App-Platform': 'Android/iOS',
      'X-App-Version': GOVT_CONFIG.APP_VERSION,
      'X-Municipal-Code': 'MCF-01',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  // Simulation fallback methods for offline & development resilience
  async submitComplaint(complaintData: Partial<Complaint>): Promise<ApiResponse<{ ticketId: string }>> {
    try {
      // In production: fetch(`${this.baseUrl}/grievance/submit`, { method: 'POST', body: JSON.stringify(complaintData) })
      return {
        success: true,
        data: { ticketId: `MCF-2026-${Math.floor(1000 + Math.random() * 9000)}` },
        message: 'Grievance ticket created successfully in Municipal Central System.',
      };
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || 'Network error occurred while connecting to Municipal servers.',
      };
    }
  }

  async verifyOtp(mobile: string, otp: string): Promise<ApiResponse<CitizenProfile>> {
    try {
      return {
        success: true,
        data: {
          name: 'Kunal Jagtap',
          mobile,
          email: 'kunal.jagtap@example.com',
          ward: 'Ward 14, Old Faridabad',
          address: 'House No. 452, Sector 15, Faridabad, Haryana',
          isLoggedIn: true,
        },
      };
    } catch (e: any) {
      return {
        success: false,
        message: 'Invalid OTP or authentication session expired.',
      };
    }
  }
}

export const api = new ApiService();
