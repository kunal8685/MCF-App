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
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { CustomButton } from '@/components/common/CustomButton';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [ward, setWard] = useState('Ward 14, Old Faridabad');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your Full Name.');
      return;
    }
    if (!mobile || mobile.length !== 10) {
      Alert.alert('Required Field', 'Please enter a valid 10-digit Mobile Number.');
      return;
    }

    setLoading(true);
    await register({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || 'citizen@mcfaridabad.gov.in',
      ward,
      address: address.trim() || 'Faridabad, Haryana',
    });
    setLoading(false);
    Alert.alert('Registration Successful', `Welcome to MCF CITIZEN, ${name}!`, [
      {
        text: 'Proceed to Dashboard',
        onPress: () => router.replace('/(drawer)/home' as any),
      },
    ]);
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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
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
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>REGISTER HERE</Text>
          <Text style={styles.subheading}>
            Create your citizen profile for fast grievance tracking & services
          </Text>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Kunal Jagtap"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Mobile Number */}
          <Text style={styles.inputLabel}>Mobile Number *</Text>
          <View style={styles.inputContainer}>
            <Feather name="phone" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          {/* Email */}
          <Text style={styles.inputLabel}>Email ID (Optional)</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="citizen@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Ward / Zone */}
          <Text style={styles.inputLabel}>Select Ward / Zone</Text>
          <View style={styles.inputContainer}>
            <Feather name="map" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={ward}
              onChangeText={setWard}
              placeholder="e.g. Ward 14, Old Faridabad"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Residential Address */}
          <Text style={styles.inputLabel}>Residential Address</Text>
          <View style={[styles.inputContainer, { height: 80, alignItems: 'flex-start' }]}>
            <Feather name="home" size={18} color="#F59019" style={[styles.inputIcon, { marginTop: 12 }]} />
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
              placeholder="House No., Street, Sector/Colony"
              placeholderTextColor="#94A3B8"
              multiline
              value={address}
              onChangeText={setAddress}
            />
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
          >
            <Text style={styles.loginLinkPrompt}>Already registered? </Text>
            <Text style={styles.loginLinkAction}>LOGIN HERE</Text>
          </TouchableOpacity>
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
    width: 72,
    height: 72,
    marginBottom: 8,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sheet,
    padding: 22,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  heading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
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
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  submitBtn: {
    marginTop: 10,
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
});
