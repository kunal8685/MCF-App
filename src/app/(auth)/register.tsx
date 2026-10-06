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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { registerCitizenApi } from '@/services/citizenApi';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { CustomButton } from '@/components/common/CustomButton';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Faridabad');
  const [state, setState] = useState('Haryana');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validate = () => {
    setErrorBanner('');
    if (!fullName.trim()) {
      setErrorBanner('Please enter your Full Name.');
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorBanner('Please enter a valid 10-digit Mobile Number.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrorBanner('');

    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      await registerCitizenApi({
        full_name: fullName.trim(),
        phone: cleanPhone,
        gender,
        address: address.trim() || undefined,
        city: city.trim() || 'Faridabad',
        state: state.trim() || 'Haryana',
      });

      setLoading(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'Registration failed. Please try again.';
      setErrorBanner(msg);
      Alert.alert('Registration Failed', msg);
    }
  };

  const handleProceedToLogin = () => {
    setShowSuccessModal(false);
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    router.replace({
      pathname: '/(auth)/login' as any,
      params: { phone: cleanPhone, autoSendOtp: 'true' },
    });
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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.topCard}>
          <Image
            source={require('@/../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.hindiTitle}>नगर निगम फरीदाबाद</Text>
          <Text style={styles.engTitle}>MUNICIPAL CORPORATION FARIDABAD</Text>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>CITIZEN REGISTRATION</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>CREATE ACCOUNT</Text>
          <Text style={styles.subheading}>
            Register with MCF to access municipal services, submit grievances, and track bills
          </Text>

          {errorBanner ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{errorBanner}</Text>
            </View>
          ) : null}

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Ramesh Kumar"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errorBanner) setErrorBanner('');
              }}
            />
          </View>

          {/* Mobile Number */}
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
              onChangeText={(text) => {
                setPhone(text);
                if (errorBanner) setErrorBanner('');
              }}
            />
          </View>

          {/* Gender */}
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((opt) => {
              const isSelected = gender === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.genderChip, isSelected && styles.genderChipSelected]}
                  onPress={() => setGender(opt)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.genderChipText, isSelected && styles.genderChipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Residential Address */}
          <Text style={styles.inputLabel}>Residential Address</Text>
          <View style={[styles.inputContainer, { height: 80, alignItems: 'flex-start' }]}>
            <Feather name="home" size={18} color="#F59019" style={[styles.inputIcon, { marginTop: 12 }]} />
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
              placeholder="House / Flat No., Street, Sector or Colony"
              placeholderTextColor="#94A3B8"
              multiline
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* City & State (Two Columns) */}
          <View style={styles.twoColumnRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>City</Text>
              <View style={styles.inputContainer}>
                <Feather name="map-pin" size={16} color="#F59019" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#94A3B8"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>State</Text>
              <View style={styles.inputContainer}>
                <Feather name="map" size={16} color="#F59019" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor="#94A3B8"
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>
          </View>

          <CustomButton
            title="CREATE CITIZEN ACCOUNT"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLinkPrompt}>Already have an account? </Text>
            <Text style={styles.loginLinkAction}>LOGIN HERE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            By registering, you agree to Municipal Corporation Faridabad Citizen Guidelines.
          </Text>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>Account Created!</Text>
            <Text style={styles.modalSub}>
              Your citizen profile has been registered successfully with Municipal Corporation Faridabad.
            </Text>
            <TouchableOpacity
              style={styles.modalActionBtn}
              onPress={handleProceedToLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.modalActionBtnText}>PROCEED TO LOGIN</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 44,
    paddingBottom: 30,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Shadow.sm,
  },
  topCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 68,
    height: 68,
    marginBottom: 8,
  },
  hindiTitle: {
    fontSize: 16,
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
    marginBottom: 16,
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
  inputIcon: {
    marginRight: 10,
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
    fontSize: 14,
    color: '#1E293B',
  },
  genderRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.input,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipSelected: {
    borderColor: '#F59019',
    backgroundColor: '#FFF7ED',
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  genderChipTextSelected: {
    color: '#EA580C',
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitBtn: {
    marginTop: 8,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginLinkPrompt: {
    fontSize: 13,
    color: '#64748B',
  },
  loginLinkAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59019',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...Shadow.lg,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59019',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  modalActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
