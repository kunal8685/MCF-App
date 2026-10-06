import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { sendOtpApi, verifyOtpApi, getCitizenProfileApi, DEMO_MOBILE, DEMO_OTP } from '@/services/citizenApi';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { CustomButton } from '@/components/common/CustomButton';

const OTP_LENGTH = 6;

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; autoSendOtp?: string }>();
  const { login } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState(params.phone || '');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputsRef = useRef<(TextInput | null)[]>([]);

  // Handle incoming params from registration
  useEffect(() => {
    if (params.phone) {
      const clean = String(params.phone).replace(/\D/g, '').slice(-10);
      setPhone(clean);
      if (params.autoSendOtp === 'true') {
        handleSendOtp(clean);
      }
    }
  }, [params.phone, params.autoSendOtp]);

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            setCanResend(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const normalizePhone = (p?: string) => {
    const val = typeof p === 'string' ? p : phone;
    return val.replace(/\D/g, '').slice(-10);
  };

  const handleSendOtp = async (overridePhone?: string) => {
    const cleanPhone = normalizePhone(overridePhone);
    setErrorBanner('');

    if (cleanPhone.length !== 10) {
      setErrorBanner('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const res = await sendOtpApi(cleanPhone);
      const expiresIn = Number(res?.expires_in);
      const nextTimer = Number.isFinite(expiresIn) && expiresIn > 0 ? Math.min(expiresIn, 60) : 30;

      setLoading(false);
      setStep('otp');
      setTimer(nextTimer);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(''));

      if (cleanPhone === DEMO_MOBILE) {
        Alert.alert('Demo Account', 'For Demo Reviewer (9999999999), use OTP: 123456');
      }
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'Unable to send OTP. Please check your number or try again.';
      setErrorBanner(msg);
      Alert.alert('OTP Request Failed', msg);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      // Pasted full OTP
      const chars = cleaned.slice(0, OTP_LENGTH).split('');
      for (let i = 0; i < OTP_LENGTH; i++) {
        newOtp[i] = chars[i] || '';
      }
      setOtp(newOtp);
      const nextFocus = Math.min(chars.length, OTP_LENGTH - 1);
      otpInputsRef.current[nextFocus]?.focus();
      return;
    }

    newOtp[index] = cleaned;
    setOtp(newOtp);
    if (errorBanner) setErrorBanner('');

    // Auto-advance
    if (cleaned && index < OTP_LENGTH - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (overrideOtp?: string) => {
    const cleanPhone = normalizePhone();
    const otpCode = overrideOtp || otp.join('');
    setErrorBanner('');

    if (otpCode.length !== OTP_LENGTH) {
      setErrorBanner(`Please enter the complete ${OTP_LENGTH}-digit OTP.`);
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOtpApi(cleanPhone, otpCode);

      // Attempt to load full profile from backend
      let profileData = data?.citizen || data?.profile || null;
      if (data?.access_token) {
        try {
          const fetched = await getCitizenProfileApi(data.access_token);
          if (fetched?.citizen || fetched?.data || fetched?.profile) {
            profileData = fetched.citizen || fetched.data || fetched.profile;
          }
        } catch (pe) {
          console.warn('Could not fetch citizen profile:', pe);
        }
      }

      await login(cleanPhone, profileData?.full_name || profileData?.name, profileData);
      setLoading(false);

      router.replace('/(drawer)/home' as any);
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'Invalid OTP code. Please try again.';
      setErrorBanner(msg);
      Alert.alert('Verification Failed', msg);
    }
  };

  const handleQuickDemoLogin = async () => {
    setErrorBanner('');
    setPhone(DEMO_MOBILE);
    setLoading(true);

    try {
      await sendOtpApi(DEMO_MOBILE);
      setStep('otp');
      setOtp(['1', '2', '3', '4', '5', '6']);

      const data = await verifyOtpApi(DEMO_MOBILE, DEMO_OTP);
      await login(DEMO_MOBILE, 'Demo Citizen', data?.citizen || data?.profile);

      setLoading(false);
      router.replace('/(drawer)/home' as any);
    } catch (err: any) {
      setLoading(false);
      setErrorBanner(err?.message || 'Demo login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topCard}>
          <Image
            source={require('@/../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.hindiTitle}>नगर निगम फरीदाबाद</Text>
          <Text style={styles.engTitle}>MUNICIPAL CORPORATION FARIDABAD</Text>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>CITIZEN SERVICES PORTAL</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>CITIZEN LOGIN</Text>
          <Text style={styles.subheading}>
            {step === 'otp'
              ? `Enter the 6-digit OTP sent to +91 ${normalizePhone()}`
              : 'Enter your 10 digit registered mobile number to continue'}
          </Text>

          {errorBanner ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{errorBanner}</Text>
            </View>
          ) : null}

          {step === 'phone' ? (
            <View>
              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <View style={styles.inputContainer}>
                <View style={styles.prefixContainer}>
                  <Text style={styles.prefixText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    if (errorBanner) setErrorBanner('');
                  }}
                  autoFocus
                />
              </View>
            </View>
          ) : (
            <View style={styles.otpSection}>
              <View style={styles.otpGrid}>
                {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
                  <TextInput
                    key={idx}
                    ref={(r) => {
                      otpInputsRef.current[idx] = r;
                    }}
                    style={[
                      styles.otpBox,
                      otp[idx] ? styles.otpBoxFilled : null,
                    ]}
                    keyboardType="number-pad"
                    maxLength={idx === 0 ? OTP_LENGTH : 1}
                    value={otp[idx]}
                    onChangeText={(val) => handleOtpChange(val, idx)}
                    onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                    selectTextOnFocus
                    autoFocus={idx === 0}
                  />
                ))}
              </View>

              <View style={styles.otpMetaRow}>
                <TouchableOpacity
                  onPress={() => {
                    setStep('phone');
                    setErrorBanner('');
                  }}
                  style={styles.changePhoneBtn}
                >
                  <Feather name="edit-2" size={13} color="#F59019" />
                  <Text style={styles.changePhoneText}>Edit Mobile Number</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={!canResend || loading}
                  onPress={() => handleSendOtp()}
                  style={styles.resendBtn}
                >
                  <Text style={[styles.resendText, !canResend && styles.resendDisabled]}>
                    {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <CustomButton
            title={step === 'otp' ? 'VERIFY & PROCEED' : 'GET SECURE OTP'}
            onPress={step === 'otp' ? () => handleVerifyOtp() : () => handleSendOtp()}
            loading={loading}
            style={styles.submitBtn}
          />

          <TouchableOpacity
            style={styles.quickLoginBtn}
            onPress={handleQuickDemoLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={17} color="#D97706" />
            <Text style={styles.quickLoginText}>Reviewer Demo Login (9999999999)</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push('/(auth)/register' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLinkPrompt}>New Citizen? </Text>
            <Text style={styles.registerLinkAction}>REGISTER HERE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            Secured by Municipal Corporation Faridabad & Smart City Mission.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 76,
    height: 76,
    marginBottom: 10,
  },
  hindiTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  engTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59019',
    letterSpacing: 0.5,
  },
  badgePill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EA580C',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sheet,
    padding: 22,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#B91C1C',
    flex: 1,
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  prefixContainer: {
    marginRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
    paddingRight: 8,
  },
  prefixText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  otpSection: {
    marginBottom: 14,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  otpBox: {
    width: 44,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  otpBoxFilled: {
    borderColor: '#F59019',
    backgroundColor: '#FFF7ED',
  },
  otpMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  changePhoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  changePhoneText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59019',
    marginLeft: 4,
  },
  resendBtn: {
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59019',
  },
  resendDisabled: {
    color: '#94A3B8',
  },
  submitBtn: {
    marginTop: 10,
  },
  quickLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: Radius.button,
    paddingVertical: 11,
    marginTop: 12,
  },
  quickLoginText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginHorizontal: 12,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerLinkPrompt: {
    fontSize: 13,
    color: '#64748B',
  },
  registerLinkAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59019',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerNote: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
