/**
 * Validation utilities for Citizen Portal Forms
 */

export const isValidIndianMobile = (mobile: string): boolean => {
  const cleaned = mobile.replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
};

export const isValidEmail = (email: string): boolean => {
  if (!email || !email.trim()) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isNonEmpty = (value?: string | null): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isWithinCharLimit = (text: string, maxLimit: number = 300): boolean => {
  return text.length <= maxLimit;
};
