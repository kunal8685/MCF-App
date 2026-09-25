import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomButton } from '@/components/common/CustomButton';
import { useComplaints } from '@/context/ComplaintsContext';
import { useAuth } from '@/context/AuthContext';
import { COMPLAINT_CATEGORIES } from '@/data/complaintsData';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function NewComplaintScreen() {
  const router = useRouter();
  const { addComplaint } = useComplaints();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState(COMPLAINT_CATEGORIES[0].title);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(user.address || 'Sector 15, Faridabad');
  const [landmark, setLandmark] = useState('');
  const [ward, setWard] = useState(user.ward || 'Ward 14, Old Faridabad');
  const [photoSelected, setPhotoSelected] = useState<boolean>(false);
  const [locationCoords, setLocationCoords] = useState('28.4069° N, 77.3195° E (Sector 15)');
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');

  const MAX_CHARS = 300;

  const handleSelectPhoto = () => {
    Alert.alert('Upload Photo', 'Choose an option to attach evidence', [
      {
        text: 'Take Photo (Camera)',
        onPress: () => setPhotoSelected(true),
      },
      {
        text: 'Choose from Gallery',
        onPress: () => setPhotoSelected(true),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleRefreshLocation = () => {
    setLocationCoords('28.4082° N, 77.3210° E (Accurate: ±4m)');
    Alert.alert('GPS Updated', 'Location coordinates updated from device sensor.');
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please provide a brief description of the issue.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Missing Address', 'Please provide the incident location address.');
      return;
    }

    setLoading(true);
    try {
      const fullAddress = landmark.trim()
        ? `${address.trim()} (Near ${landmark.trim()})`
        : address.trim();

      const ticket = await addComplaint({
        category: selectedCategory,
        description: description.trim(),
        address: fullAddress,
        ward,
        imageUrl: photoSelected ? 'attached' : undefined,
      });

      setGeneratedTicket(ticket);
      setSuccessModalVisible(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to lodge complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Lodge New Complaint" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Attachment Area */}
        <Text style={styles.sectionLabel}>Attach Photo Evidence *</Text>
        <TouchableOpacity
          style={[styles.photoBox, photoSelected && styles.photoBoxFilled]}
          onPress={handleSelectPhoto}
          activeOpacity={0.8}
        >
          {photoSelected ? (
            <View style={styles.photoPreviewWrapper}>
              <View style={styles.simulatedPhoto}>
                <Ionicons name="image" size={48} color="#F59019" />
                <Text style={styles.photoAttachedText}>Photo Attached (Site Evidence)</Text>
                <Text style={styles.geoTagText}>📍 Geotagged: {locationCoords}</Text>
              </View>
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  setPhotoSelected(false);
                }}
              >
                <Feather name="trash-2" size={16} color="#DC2626" />
                <Text style={styles.removePhotoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <View style={styles.cameraIconCircle}>
                <Feather name="camera" size={28} color="#F59019" />
              </View>
              <Text style={styles.photoPlaceholderTitle}>
                Tap to Capture or Upload Photo
              </Text>
              <Text style={styles.photoPlaceholderSubtitle}>
                Supports JPG, PNG up to 10MB
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Complaint Category */}
        <Text style={styles.sectionLabel}>Select Grievance Category *</Text>
        <TouchableOpacity
          style={styles.pickerBox}
          onPress={() => setCategoryModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.pickerLeft}>
            <View style={styles.pickerIconBg}>
              <Feather name="layers" size={18} color="#F59019" />
            </View>
            <Text style={styles.pickerValue}>{selectedCategory}</Text>
          </View>
          <Feather name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>

        {/* Description Input with 300 char counter */}
        <View style={styles.labelCounterRow}>
          <Text style={styles.sectionLabel}>Complaint Description *</Text>
          <Text
            style={[
              styles.counterText,
              description.length > MAX_CHARS && styles.counterOver,
            ]}
          >
            {description.length} / {MAX_CHARS}
          </Text>
        </View>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Explain the problem in detail (e.g., Overflowing garbage bin near main park entrance since yesterday)..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            maxLength={MAX_CHARS}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* GPS Location Banner */}
        <View style={styles.gpsBanner}>
          <View style={styles.gpsLeft}>
            <Ionicons name="location" size={20} color="#F59019" />
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsTitle}>GPS Location Tagged</Text>
              <Text style={styles.gpsCoords}>{locationCoords}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.gpsRefreshBtn}
            onPress={handleRefreshLocation}
          >
            <Feather name="refresh-cw" size={14} color="#F59019" />
          </TouchableOpacity>
        </View>

        {/* Address Input */}
        <Text style={styles.sectionLabel}>Incident Address *</Text>
        <View style={styles.inputBox}>
          <Feather name="map-pin" size={18} color="#F59019" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Street address, house / shop number"
            placeholderTextColor="#94A3B8"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Landmark */}
        <Text style={styles.sectionLabel}>Nearest Landmark (Optional)</Text>
        <View style={styles.inputBox}>
          <Feather name="navigation" size={18} color="#F59019" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Near Mother Dairy, Sector 15 Market"
            placeholderTextColor="#94A3B8"
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>

        {/* Ward / Zone */}
        <Text style={styles.sectionLabel}>Ward / Municipal Zone</Text>
        <View style={styles.inputBox}>
          <Feather name="shield" size={18} color="#F59019" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={ward}
            onChangeText={setWard}
            placeholder="Ward 14, Old Faridabad"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Submit Button */}
        <CustomButton
          title="SUBMIT COMPLAINT"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
          style={styles.submitBtn}
        />
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.categoryCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Grievance Category</Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoryScroll}>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catOption,
                    selectedCategory === cat.title && styles.catOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.title);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.catOptionText,
                      selectedCategory === cat.title && styles.catOptionTextActive,
                    ]}
                  >
                    {cat.title}
                  </Text>
                  {selectedCategory === cat.title && (
                    <Feather name="check" size={18} color="#F59019" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Complaint Lodged Successfully!</Text>
            <Text style={styles.successSubtitle}>
              Your grievance has been forwarded to the concerned Ward 14 Junior Engineer & Sanitation Inspector.
            </Text>

            <View style={styles.ticketBox}>
              <Text style={styles.ticketLabel}>TICKET TRACKING NUMBER</Text>
              <Text style={styles.ticketValue}>{generatedTicket}</Text>
            </View>

            <Text style={styles.successSlaNote}>
              Resolution SLA: 24 - 48 Hours
            </Text>

            <CustomButton
              title="TRACK IN MY COMPLAINTS"
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace('/my-complaints' as any);
              }}
              style={styles.modalActionBtn}
            />
          </View>
        </View>
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
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  labelCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 10,
    marginBottom: 6,
  },
  counterText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  counterOver: {
    color: '#EF4444',
  },
  photoBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FED7AA',
    borderRadius: Radius.card,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  photoBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#F59019',
    backgroundColor: '#FFFBF5',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  cameraIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoPlaceholderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  photoPlaceholderSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  photoPreviewWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  simulatedPhoto: {
    alignItems: 'center',
    padding: 10,
  },
  photoAttachedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 6,
  },
  geoTagText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
    padding: 6,
  },
  removePhotoText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  pickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pickerIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    padding: 12,
    minHeight: 100,
  },
  textArea: {
    fontSize: 14,
    color: '#1E293B',
    textAlignVertical: 'top',
    height: 90,
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: Radius.md,
    padding: 10,
    marginTop: 14,
  },
  gpsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  gpsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C86600',
  },
  gpsCoords: {
    fontSize: 11,
    color: '#64748B',
  },
  gpsRefreshBtn: {
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  submitBtn: {
    marginTop: 22,
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  categoryCard: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 20,
    ...Shadow.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  categoryScroll: {
    maxHeight: 380,
  },
  catOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  catOptionActive: {
    backgroundColor: '#FFF7ED',
  },
  catOptionText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  catOptionTextActive: {
    color: '#F59019',
    fontWeight: '700',
  },

  /* Success Modal */
  successCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Shadow.lg,
  },
  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Shadow.md,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  ticketBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  ticketLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
  },
  ticketValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F59019',
    marginTop: 4,
    letterSpacing: 1,
  },
  successSlaNote: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 18,
  },
  modalActionBtn: {
    width: '100%',
  },
});
