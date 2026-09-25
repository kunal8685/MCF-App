import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { CustomButton } from '@/components/common/CustomButton';
import { useAuth } from '@/context/AuthContext';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user.name);
  const [mobile, setMobile] = useState(user.mobile);
  const [email, setEmail] = useState(user.email);
  const [ward, setWard] = useState(user.ward);
  const [address, setAddress] = useState(user.address);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    setLoading(true);
    await updateProfile({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      ward: ward.trim(),
      address: address.trim(),
    });
    setLoading(false);
    Alert.alert('Profile Saved', 'Your citizen profile details have been updated.');
  };

  return (
    <View style={styles.container}>
      <Header title="Citizen Profile" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Top Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{name ? name[0] : 'K'}</Text>
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => Alert.alert('Profile Picture', 'Upload photo from gallery or camera.')}
            >
              <Feather name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.citizenName}>{name}</Text>
          <Text style={styles.citizenWard}>📍 {ward}</Text>
        </View>

        {/* Profile Form */}
        <CustomCard style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Personal Information</Text>

          <Text style={styles.fieldLabel}>Full Name</Text>
          <View style={styles.inputBox}>
            <Feather name="user" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Text style={styles.fieldLabel}>Mobile Number</Text>
          <View style={styles.inputBox}>
            <Feather name="phone" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              placeholder="10-digit mobile"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Text style={styles.fieldLabel}>Email Address</Text>
          <View style={styles.inputBox}>
            <Feather name="mail" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.fieldLabel}>Municipal Ward & Zone</Text>
          <View style={styles.inputBox}>
            <Feather name="map" size={18} color="#F59019" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={ward}
              onChangeText={setWard}
              placeholder="e.g. Ward 14, Old Faridabad"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Text style={styles.fieldLabel}>Residential Address</Text>
          <View style={[styles.inputBox, { height: 80, alignItems: 'flex-start' }]}>
            <Feather name="home" size={18} color="#F59019" style={[styles.inputIcon, { marginTop: 12 }]} />
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
              value={address}
              onChangeText={setAddress}
              placeholder="House No, Street, Colony"
              placeholderTextColor="#94A3B8"
              multiline
            />
          </View>
        </CustomCard>

        {/* Preferences */}
        <CustomCard style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Notification Preferences</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>SMS Complaint Updates</Text>
              <Text style={styles.switchSubtitle}>Receive ticket status changes via SMS</Text>
            </View>
            <Switch
              value={smsAlerts}
              onValueChange={setSmsAlerts}
              trackColor={{ false: '#CBD5E1', true: '#FED7AA' }}
              thumbColor={smsAlerts ? '#F59019' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Municipal Announcements</Text>
              <Text style={styles.switchSubtitle}>Tenders, water shutdown, and event alerts</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: '#CBD5E1', true: '#FED7AA' }}
              thumbColor={pushNotifs ? '#F59019' : '#F1F5F9'}
            />
          </View>
        </CustomCard>

        <CustomButton
          title="SAVE PROFILE CHANGES"
          onPress={handleSave}
          loading={loading}
          size="lg"
          style={styles.saveBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFF7ED',
    borderWidth: 2.5,
    borderColor: '#F59019',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Shadow.md,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F59019',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F59019',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  citizenName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
  },
  citizenWard: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  formCard: {
    padding: 16,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  switchSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  saveBtn: {
    marginTop: 6,
  },
});
