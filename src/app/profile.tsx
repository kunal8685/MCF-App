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
  Image,
  Modal,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { CustomButton } from '@/components/common/CustomButton';
import { useAuth } from '@/context/AuthContext';
import { Radius, Shadow } from '@/constants/theme';

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
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [photoSourceModalVisible, setPhotoSourceModalVisible] = useState(false);

  const handleCaptureCamera = async () => {
    try {
      setPhotoSourceModalVisible(false);
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Camera Access Required',
            'Please allow camera permission in device settings to take a profile photo.'
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      Alert.alert('Camera Error', err?.message || 'Could not open camera.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      setPhotoSourceModalVisible(false);
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Gallery Access Required',
            'Please allow photo library permission in device settings to select a profile photo.'
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (err: any) {
      console.warn('Gallery error:', err);
      Alert.alert('Gallery Error', err?.message || 'Could not open photo gallery.');
    }
  };

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
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarInitial}>{name ? name[0] : 'K'}</Text>
            )}
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => setPhotoSourceModalVisible(true)}
              activeOpacity={0.8}
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

      {/* Avatar Picker Modal */}
      <Modal
        visible={photoSourceModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPhotoSourceModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPhotoSourceModalVisible(false)}
        >
          <View style={styles.photoModalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Change Profile Photo</Text>
                <Text style={styles.modalSubtitle}>Choose image from camera or gallery</Text>
              </View>
              <TouchableOpacity onPress={() => setPhotoSourceModalVisible(false)}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.photoOptionsList}>
              <TouchableOpacity
                style={styles.photoOptionBtn}
                onPress={handleCaptureCamera}
                activeOpacity={0.7}
              >
                <View style={[styles.photoIconCircle, { backgroundColor: '#FFF7ED' }]}>
                  <Feather name="camera" size={22} color="#F59019" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.photoOptionTitle}>Take Photo (Camera)</Text>
                  <Text style={styles.photoOptionSubtitle}>Take a new profile photo now</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoOptionBtn}
                onPress={handlePickFromGallery}
                activeOpacity={0.7}
              >
                <View style={[styles.photoIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Feather name="image" size={22} color="#3B82F6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.photoOptionTitle}>Choose from Gallery</Text>
                  <Text style={styles.photoOptionSubtitle}>Select an existing photo from album</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {avatarUri && (
                <TouchableOpacity
                  style={[styles.photoOptionBtn, { borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 4 }]}
                  onPress={() => {
                    setAvatarUri(null);
                    setPhotoSourceModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.photoIconCircle, { backgroundColor: '#FEE2E2' }]}>
                    <Feather name="trash-2" size={20} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.photoOptionTitle, { color: '#DC2626' }]}>Remove Photo</Text>
                    <Text style={styles.photoOptionSubtitle}>Restore default initial avatar</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  avatarImg: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  photoModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  photoOptionsList: {
    gap: 6,
  },
  photoOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  photoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  photoOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  photoOptionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
