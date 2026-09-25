import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { CustomButton } from '@/components/common/CustomButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtp('1234');
      Alert.alert('OTP Sent', 'One Time Password has been sent to +91 ' + mobile + ' (Use 1234 for demo)');
    }, 800);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit OTP.');
      return;
    }
    setLoading(true);
    await login(mobile, 'Kunal Jagtap');
    setLoading(false);
    router.replace('/(drawer)/home' as any);
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    await login('9876543210', 'Kunal Jagtap');
    setLoading(false);
    router.replace('/(drawer)/home' as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <Text style={styles.heading}>LOGIN OR REGISTER</Text>
          <Text style={styles.subheading}>
            {otpSent
              ? `Enter the 4-digit code sent to +91 ${mobile}`
              : 'Enter your 10 digit mobile number to continue'}
          </Text>

          {!otpSent ? (
            <View style={styles.inputContainer}>
              <View style={styles.prefixContainer}>
                <Text style={styles.prefixText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
              />
            </View>
          ) : (
            <View style={styles.otpWrapper}>
              <View style={styles.otpInputContainer}>
                <Feather name="lock" size={20} color="#F59019" style={{ marginLeft: 12 }} />
                <TextInput
                  style={[styles.input, { letterSpacing: 8, fontSize: 20, textAlign: 'center' }]}
                  placeholder="• • • •"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  autoFocus
                />
              </View>
              <TouchableOpacity
                onPress={() => setOtpSent(false)}
                style={styles.changeNumberBtn}
              >
                <Text style={styles.changeNumberText}>Edit Phone Number</Text>
              </TouchableOpacity>
            </View>
          )}

          <CustomButton
            title={otpSent ? 'VERIFY & LOGIN' : 'GET OTP'}
            onPress={otpSent ? handleVerifyOtp : handleSendOtp}
            loading={loading}
            style={styles.submitBtn}
          />

          <TouchableOpacity
            style={styles.quickLoginBtn}
            onPress={handleQuickLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={18} color="#D97706" />
            <Text style={styles.quickLoginText}>Instant Demo Access (Kunal Jagtap)</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push('/(auth)/register' as any)}
          >
            <Text style={styles.registerLinkPrompt}>Don't have an account? </Text>
            <Text style={styles.registerLinkAction}>REGISTER HERE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            By continuing, you agree to MCF Faridabad Terms & Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
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
    width: 84,
    height: 84,
    marginBottom: 10,
  },
  hindiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  engTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59019',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 8,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C86600',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sheet,
    padding: 24,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    marginBottom: 18,
  },
  prefixContainer: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#F1F5F9',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E293B',
  },
  otpWrapper: {
    marginBottom: 18,
  },
  otpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F59019',
    borderRadius: Radius.input,
    backgroundColor: '#FFF7ED',
  },
  changeNumberBtn: {
    alignSelf: 'center',
    marginTop: 8,
  },
  changeNumberText: {
    fontSize: 12,
    color: '#F59019',
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 4,
  },
  quickLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 10,
    borderRadius: Radius.button,
    marginTop: 14,
    gap: 6,
  },
  quickLoginText: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '600',
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
    marginHorizontal: 12,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
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
    paddingHorizontal: 20,
  },
});
