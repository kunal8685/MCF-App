import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Header } from '@/components/common/Header';
import { CustomButton } from '@/components/common/CustomButton';
import { useAuth } from '@/context/AuthContext';
import URLS from '@/services/base_url';
import {
  getComplaintTypesWithSubtypesApi,
  getAllWardsApi,
  createCitizenComplaintApi,
  uploadComplaintMediaApi,
  GrievanceComplaintType,
  GrievanceSubtype,
  WardItem,
  DEFAULT_COMPLAINT_TYPES,
  DEFAULT_WARDS,
} from '@/services/grievanceApi';
import { Radius, Shadow } from '@/constants/theme';

export default function NewComplaintScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [complaintTypes, setComplaintTypes] = useState<GrievanceComplaintType[]>(DEFAULT_COMPLAINT_TYPES);
  const [wards, setWards] = useState<WardItem[]>(DEFAULT_WARDS);

  const [selectedType, setSelectedType] = useState<GrievanceComplaintType>(DEFAULT_COMPLAINT_TYPES[0]);
  const [selectedSubtype, setSelectedSubtype] = useState<GrievanceSubtype | null>(
    DEFAULT_COMPLAINT_TYPES[0].subtypes[0] || null
  );
  const [selectedWard, setSelectedWard] = useState<WardItem>(DEFAULT_WARDS[0]);
  const [severity, setSeverity] = useState<'minor' | 'major'>('minor');

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [wardModalVisible, setWardModalVisible] = useState(false);

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(user.address || '');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoSourceModalVisible, setPhotoSourceModalVisible] = useState(false);
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [photoMediaUrl, setPhotoMediaUrl] = useState<string>('');
  const [photoUploading, setPhotoUploading] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number | null>(28.3629157);
  const [longitude, setLongitude] = useState<number | null>(77.3316223);
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');

  const MAX_CHARS = 300;

  useEffect(() => {
    let active = true;

    const fetchDropdowns = async () => {
      try {
        const [typesData, wardsData] = await Promise.all([
          getComplaintTypesWithSubtypesApi(),
          getAllWardsApi(),
        ]);

        if (!active) return;

        if (typesData && typesData.length > 0) {
          setComplaintTypes(typesData);
          setSelectedType(typesData[0]);
          if (typesData[0].subtypes && typesData[0].subtypes.length > 0) {
            setSelectedSubtype(typesData[0].subtypes[0]);
          }
        }

        if (wardsData && wardsData.length > 0) {
          setWards(wardsData);
          const userWardNum = parseInt(user.ward?.replace(/\D/g, '') || '1', 10);
          const matched = wardsData.find((w) => w.ward_id === userWardNum) || wardsData[0];
          setSelectedWard(matched);
        }
      } catch (e) {
        console.warn('Error loading complaint dropdowns:', e);
      }
    };

    fetchDropdowns();

    return () => {
      active = false;
    };
  }, [user.ward]);

  // Automatically detect user current GPS location
  useEffect(() => {
    let active = true;

    const detectLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (!active) return;
          setLatitude(loc.coords.latitude);
          setLongitude(loc.coords.longitude);

          try {
            const geo = await Location.reverseGeocodeAsync({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
            if (geo && geo.length > 0 && active) {
              const g = geo[0];
              const parts = [
                g.name,
                g.street,
                g.district || g.subregion,
                g.city,
                g.postalCode,
              ].filter(Boolean);
              if (parts.length > 0) {
                setAddress((prev) => (prev.trim() ? prev : parts.join(', ')));
              }
            }
          } catch (geoErr) {
            console.warn('Reverse geocode notice:', geoErr);
          }
        }
      } catch (err) {
        console.warn('Auto location detect notice:', err);
      }
    };

    detectLocation();

    return () => {
      active = false;
    };
  }, []);

  const handleSelectType = (type: GrievanceComplaintType) => {
    setSelectedType(type);
    setCategoryModalVisible(false);
    if (type.subtypes && type.subtypes.length > 0) {
      setSelectedSubtype(type.subtypes[0]);
    } else {
      setSelectedSubtype(null);
    }
  };

  const handleSelectPhoto = () => {
    setPhotoSourceModalVisible(true);
  };

  const processAndUploadPhoto = async (asset: ImagePicker.ImagePickerAsset) => {
    const uri = asset.uri;
    setLocalPhotoUri(uri);
    setPhotoAttached(true);
    setPhotoUploading(true);
    setErrorBanner('');

    try {
      const mediaId = await uploadComplaintMediaApi(
        uri,
        asset.fileName || undefined,
        asset.mimeType || undefined,
        (asset as any).file
      );
      setPhotoMediaUrl(mediaId);
    } catch (uploadErr: any) {
      console.warn('Photo direct upload warning:', uploadErr?.message);
      // Still keep local photo attached; will retry upload when user taps submit
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleCaptureCamera = async () => {
    try {
      setPhotoSourceModalVisible(false);

      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'Please allow camera permission in device settings to capture a photo of the civic issue.'
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await processAndUploadPhoto(result.assets[0]);
      }
    } catch (err: any) {
      console.warn('Error launching camera:', err);
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
            'Gallery Permission Required',
            'Please allow photo library permission in device settings to select an evidence photo.'
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await processAndUploadPhoto(result.assets[0]);
      }
    } catch (err: any) {
      console.warn('Error launching gallery:', err);
      Alert.alert('Gallery Error', err?.message || 'Could not open photo gallery.');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoAttached(false);
    setLocalPhotoUri(null);
    setPhotoMediaUrl('');
    setPhotoUploading(false);
  };

  const handleSubmit = async () => {
    setErrorBanner('');

    if (photoUploading) {
      setErrorBanner('Please wait for photo evidence upload to complete before submitting.');
      return;
    }

    const cleanPhone = String(phone || user.mobile || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorBanner('A valid 10-digit mobile number is required.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorBanner('Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.');
      return;
    }

    if (!description.trim()) {
      setErrorBanner('Please provide a brief description of the grievance.');
      return;
    }
    if (!address.trim()) {
      setErrorBanner('Please provide the incident location address.');
      return;
    }

    setLoading(true);

    try {
      let finalMediaId = photoMediaUrl.trim();
      if (photoAttached && !finalMediaId && localPhotoUri) {
        try {
          finalMediaId = await uploadComplaintMediaApi(localPhotoUri);
          setPhotoMediaUrl(finalMediaId);
        } catch (uploadRetryErr) {
          console.warn('Retry upload failed during submit:', uploadRetryErr);
        }
      }

      const mediaList: string[] = [];
      if (photoAttached && finalMediaId) {
        mediaList.push(finalMediaId);
      }

      const payload: any = {
        address: address.trim(),
        complaint_type_id: Number(selectedType.complaint_type_id),
        description: description.trim(),
        severity,
        ward_id: Number(selectedWard.ward_id),
        phone: cleanPhone,
        user_name: userName.trim() || user.name || 'Citizen',
      };

      const subtypeId = selectedSubtype?.sub_type_id || selectedType.subtypes?.[0]?.sub_type_id;
      if (subtypeId) {
        payload.sub_type_id = Number(subtypeId);
        payload.complaint_sub_type_id = Number(subtypeId);
      }

      if (mediaList.length > 0) {
        payload.media_id = mediaList;
        payload.media_ids = mediaList;
      }

      if (latitude !== null && longitude !== null) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      const result = await createCitizenComplaintApi(payload);

      const ticketNo = result.complaint_no_auto || String(result.id);
      setGeneratedTicket(ticketNo);
      setSuccessModalVisible(true);
    } catch (err: any) {
      const msg = err?.message || 'Failed to lodge complaint. Please try again.';
      setErrorBanner(msg);
      Alert.alert('Complaint Submission Failed', msg);
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
        keyboardShouldPersistTaps="handled"
      >
        {errorBanner ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" />
            <Text style={styles.errorText}>{errorBanner}</Text>
          </View>
        ) : null}

        {/* Photo Attachment Area */}
        <Text style={styles.sectionLabel}>Attach Photo Evidence (Optional)</Text>
        {photoAttached && (localPhotoUri || photoMediaUrl) ? (
          <View style={styles.photoPreviewCard}>
            <View style={styles.photoImageWrapper}>
              <Image
                source={{
                  uri:
                    localPhotoUri ||
                    (photoMediaUrl.startsWith('http')
                      ? photoMediaUrl
                      : `${URLS.BASE_URL}/media/${photoMediaUrl}`),
                }}
                style={styles.realPhotoImage}
                resizeMode="cover"
              />
              {photoUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.uploadingText}>Uploading to media server...</Text>
                </View>
              )}
            </View>

            <View style={styles.photoCardContent}>
              <View style={styles.photoMetaRow}>
                {photoUploading ? (
                  <View style={styles.badgeUploading}>
                    <ActivityIndicator size="small" color="#EA580C" />
                    <Text style={styles.badgeUploadingText}>Uploading Evidence...</Text>
                  </View>
                ) : photoMediaUrl ? (
                  <View style={styles.badgeSuccess}>
                    <Feather name="check-circle" size={14} color="#16A34A" />
                    <Text style={styles.badgeSuccessText}>Evidence Uploaded</Text>
                  </View>
                ) : (
                  <View style={styles.badgePending}>
                    <Feather name="clock" size={14} color="#D97706" />
                    <Text style={styles.badgePendingText}>Attached Locally</Text>
                  </View>
                )}
              </View>

              <View style={styles.photoBtnRow}>
                <TouchableOpacity
                  style={styles.changePhotoBtn}
                  onPress={() => setPhotoSourceModalVisible(true)}
                  disabled={photoUploading}
                  activeOpacity={0.7}
                >
                  <Feather name="camera" size={14} color="#2563EB" />
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={handleRemovePhoto}
                  disabled={photoUploading}
                  activeOpacity={0.7}
                >
                  <Feather name="trash-2" size={14} color="#DC2626" />
                  <Text style={styles.removePhotoText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.photoBox}
            onPress={handleSelectPhoto}
            activeOpacity={0.8}
          >
            <View style={styles.photoPlaceholder}>
              <View style={styles.cameraIconCircle}>
                <Feather name="camera" size={24} color="#F59019" />
              </View>
              <Text style={styles.photoPlaceholderTitle}>Tap to Take Photo or Choose from Gallery</Text>
              <Text style={styles.photoPlaceholderSubtitle}>Supports Camera capture or Gallery JPG, PNG</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Complaint Category */}
        <Text style={styles.sectionLabel}>Grievance Category *</Text>
        <TouchableOpacity
          style={styles.pickerBox}
          onPress={() => setCategoryModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.pickerLeft}>
            <View style={styles.pickerIconBg}>
              <Feather name="layers" size={18} color="#F59019" />
            </View>
            <Text style={styles.pickerValue}>{selectedType.complaint_type_name}</Text>
          </View>
          <Feather name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>

        {/* Ward Selector */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionLabel}>Ward / Municipal Area *</Text>
          <TouchableOpacity
            style={styles.pickerBox}
            onPress={() => setWardModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.pickerLeft}>
              <View style={[styles.pickerIconBg, { backgroundColor: '#F0FDF4' }]}>
                <Feather name="shield" size={18} color="#16A34A" />
              </View>
              <Text style={styles.pickerValue}>{selectedWard.ward}</Text>
            </View>
            <Feather name="chevron-down" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Severity Toggle */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionLabel}>Issue Severity</Text>
          <View style={styles.severityRow}>
            <TouchableOpacity
              style={[styles.severityChip, severity === 'minor' && styles.severityChipActiveMinor]}
              onPress={() => setSeverity('minor')}
              activeOpacity={0.8}
            >
              <Feather
                name="info"
                size={16}
                color={severity === 'minor' ? '#0284C7' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.severityChipText,
                  severity === 'minor' && styles.severityChipTextActiveMinor,
                ]}
              >
                Minor / Routine
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.severityChip, severity === 'major' && styles.severityChipActiveMajor]}
              onPress={() => setSeverity('major')}
              activeOpacity={0.8}
            >
              <Feather
                name="alert-triangle"
                size={16}
                color={severity === 'major' ? '#DC2626' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.severityChipText,
                  severity === 'major' && styles.severityChipTextActiveMajor,
                ]}
              >
                Major / Urgent
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description Input */}
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
            onChangeText={(t) => {
              setDescription(t);
              if (errorBanner) setErrorBanner('');
            }}
          />
        </View>

        {/* Applicant Details */}
        <Text style={styles.sectionLabel}>Applicant Name (Optional)</Text>
        <View style={styles.inputBox}>
          <Feather name="user" size={18} color="#F59019" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#94A3B8"
            value={userName !== '' ? userName : user.name || ''}
            onChangeText={setUserName}
          />
        </View>

        <Text style={styles.sectionLabel}>Contact Mobile Number *</Text>
        <View style={styles.inputBox}>
          <Feather name="phone" size={18} color="#F59019" style={styles.inputIcon} />
          <Text style={styles.phonePrefix}>+91 </Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone !== '' ? phone : user.mobile || ''}
            onChangeText={(t) => {
              setPhone(t.replace(/\D/g, ''));
              if (errorBanner) setErrorBanner('');
            }}
          />
        </View>

        {/* Address Input */}
        <Text style={styles.sectionLabel}>Incident Address *</Text>
        <View style={styles.inputBox}>
          <Feather name="map-pin" size={18} color="#F59019" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Street address, house / shop number, area"
            placeholderTextColor="#94A3B8"
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              if (errorBanner) setErrorBanner('');
            }}
          />
        </View>

        {/* Submit Button */}
        <CustomButton
          title="SUBMIT COMPLAINT TO MCF"
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
              {complaintTypes.map((cat) => (
                <TouchableOpacity
                  key={cat.complaint_type_id}
                  style={[
                    styles.catOption,
                    selectedType.complaint_type_id === cat.complaint_type_id && styles.catOptionActive,
                  ]}
                  onPress={() => handleSelectType(cat)}
                >
                  <Text
                    style={[
                      styles.catOptionText,
                      selectedType.complaint_type_id === cat.complaint_type_id && styles.catOptionTextActive,
                    ]}
                  >
                    {cat.complaint_type_name}
                  </Text>
                  {selectedType.complaint_type_id === cat.complaint_type_id && (
                    <Feather name="check" size={18} color="#F59019" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Ward Selection Modal */}
      <Modal
        visible={wardModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWardModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.categoryCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Ward</Text>
              <TouchableOpacity onPress={() => setWardModalVisible(false)}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoryScroll}>
              {wards.map((w) => (
                <TouchableOpacity
                  key={w.ward_id}
                  style={[
                    styles.catOption,
                    selectedWard.ward_id === w.ward_id && styles.catOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedWard(w);
                    setWardModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.catOptionText,
                      selectedWard.ward_id === w.ward_id && styles.catOptionTextActive,
                    ]}
                  >
                    {w.ward}
                  </Text>
                  {selectedWard.ward_id === w.ward_id && (
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
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={42} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Grievance Lodged!</Text>
            <Text style={styles.successSubtitle}>
              Your complaint has been registered in the Municipal Central System and forwarded to the field officer.
            </Text>

            <View style={styles.ticketBox}>
              <Text style={styles.ticketLabel}>COMPLAINT REFERENCE NO.</Text>
              <Text style={styles.ticketValue}>{generatedTicket}</Text>
            </View>

            <Text style={styles.successSlaNote}>⏱ Guaranteed Service Level: 24 - 48 Hours</Text>

            <CustomButton
              title="VIEW IN MY COMPLAINTS"
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace('/my-complaints' as any);
              }}
              style={styles.modalActionBtn}
            />

            <TouchableOpacity
              style={styles.backHomeBtn}
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace('/(drawer)/home' as any);
              }}
            >
              <Text style={styles.backHomeBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Photo Picker Options Modal */}
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
          <View
            style={[styles.categoryCard, { paddingBottom: 24 }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Attach Photo Evidence</Text>
                <Text style={styles.modalSubtitle}>Select source to capture or choose photo</Text>
              </View>
              <TouchableOpacity onPress={() => setPhotoSourceModalVisible(false)}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.photoModalOptions}>
              <TouchableOpacity
                style={styles.photoSourceOption}
                onPress={handleCaptureCamera}
                activeOpacity={0.7}
              >
                <View style={[styles.photoSourceIconBg, { backgroundColor: '#FFF7ED' }]}>
                  <Feather name="camera" size={22} color="#F59019" />
                </View>
                <View style={styles.photoSourceTextCol}>
                  <Text style={styles.photoSourceTitle}>Take Photo (Camera)</Text>
                  <Text style={styles.photoSourceDesc}>Capture immediate photo of civic issue</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoSourceOption}
                onPress={handlePickFromGallery}
                activeOpacity={0.7}
              >
                <View style={[styles.photoSourceIconBg, { backgroundColor: '#EFF6FF' }]}>
                  <Feather name="image" size={22} color="#3B82F6" />
                </View>
                <View style={styles.photoSourceTextCol}>
                  <Text style={styles.photoSourceTitle}>Choose from Gallery</Text>
                  <Text style={styles.photoSourceDesc}>Select existing photo from device album</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {photoAttached && (
                <TouchableOpacity
                  style={[styles.photoSourceOption, { borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 4 }]}
                  onPress={() => {
                    handleRemovePhoto();
                    setPhotoSourceModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.photoSourceIconBg, { backgroundColor: '#FEE2E2' }]}>
                    <Feather name="trash-2" size={20} color="#DC2626" />
                  </View>
                  <View style={styles.photoSourceTextCol}>
                    <Text style={[styles.photoSourceTitle, { color: '#DC2626' }]}>Remove Photo</Text>
                    <Text style={styles.photoSourceDesc}>Delete currently attached evidence</Text>
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#B91C1C',
    flex: 1,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 6,
  },
  photoBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: Radius.card,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  photoBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  cameraIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoPlaceholderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  photoPlaceholderSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  photoPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 14,
    ...Shadow.sm,
  },
  photoImageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: '#0F172A',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  realPhotoImage: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  photoCardContent: {
    padding: 12,
  },
  photoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeUploading: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  badgeUploadingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EA580C',
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  badgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  badgePendingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  photoBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    gap: 6,
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    gap: 6,
  },
  removePhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  photoModalOptions: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  photoSourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  photoSourceIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  photoSourceTextCol: {
    flex: 1,
  },
  photoSourceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  photoSourceDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
    flex: 1,
  },
  pickerIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pickerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  severityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radius.input,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  severityChipActiveMinor: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  severityChipActiveMajor: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  severityChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  severityChipTextActiveMinor: {
    color: '#0284C7',
    fontWeight: '700',
  },
  severityChipTextActiveMajor: {
    color: '#DC2626',
    fontWeight: '700',
  },
  labelCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  counterText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  counterOver: {
    color: '#EF4444',
    fontWeight: '700',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    padding: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#1E293B',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  inputIcon: {
    marginRight: 8,
  },
  phonePrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  submitBtn: {
    marginTop: 20,
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Shadow.md,
  },
  successTitle: {
    fontSize: 19,
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
    fontSize: 19,
    fontWeight: '800',
    color: '#F59019',
    marginTop: 4,
    letterSpacing: 1,
  },
  successSlaNote: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
    marginBottom: 18,
  },
  modalActionBtn: {
    width: '100%',
  },
  backHomeBtn: {
    marginTop: 12,
    paddingVertical: 8,
  },
  backHomeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  mediaUrlBox: {
    width: '100%',
    marginTop: 8,
    marginBottom: 4,
  },
  mediaUrlLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  mediaUrlInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#1E293B',
  },
  coordsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  coordCol: {
    flex: 1,
    marginRight: 8,
  },
  coordLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  coordInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1E293B',
  },
});
