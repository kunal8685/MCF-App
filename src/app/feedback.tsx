import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { CustomButton } from '@/components/common/CustomButton';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function FeedbackScreen() {
  const router = useRouter();

  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('App Usability');
  const [comments, setComments] = useState<string>('');
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [submittedModal, setSubmittedModal] = useState(false);

  const categories = [
    'App Usability',
    'Grievance Resolution Speed',
    'Field Staff Behavior',
    'Cleanliness & Sanitation',
    'Water & Sewerage Services',
    'General Suggestions',
  ];

  const MAX_CHARS = 300;

  const handleSubmit = () => {
    if (!comments.trim()) {
      Alert.alert('Required', 'Please share your thoughts or suggestions.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmittedModal(true);
    }, 700);
  };

  return (
    <View style={styles.container}>
      <Header title="Citizen Feedback" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomCard style={styles.card}>
          <Text style={styles.cardTitle}>Rate Your Experience</Text>
          <Text style={styles.cardSubtitle}>
            Your feedback helps Municipal Corporation Faridabad improve citizen digital services and field response.
          </Text>

          {/* Star Rating */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
                style={styles.starBtn}
              >
                <FontAwesome
                  name={star <= rating ? 'star' : 'star-o'}
                  size={34}
                  color={star <= rating ? '#F59E0B' : '#CBD5E1'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 5
              ? 'Excellent ★★★★★'
              : rating === 4
              ? 'Good ★★★★☆'
              : rating === 3
              ? 'Average ★★★☆☆'
              : rating === 2
              ? 'Below Average ★★☆☆☆'
              : 'Poor ★☆☆☆☆'}
          </Text>

          {/* Category Selection */}
          <Text style={styles.fieldLabel}>Feedback Category</Text>
          <View style={styles.categoryChipsWrap}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catChip,
                  category === cat && styles.catChipActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.catChipText,
                    category === cat && styles.catChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment Box */}
          <View style={styles.labelCounterRow}>
            <Text style={styles.fieldLabel}>Your Comments</Text>
            <Text style={styles.counterText}>
              {comments.length} / {MAX_CHARS}
            </Text>
          </View>
          <View style={styles.textAreaBox}>
            <TextInput
              style={styles.textArea}
              placeholder="What did you like or how can we improve MCF services?..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              maxLength={MAX_CHARS}
              value={comments}
              onChangeText={setComments}
            />
          </View>

          {/* Optional Attachment */}
          <TouchableOpacity
            style={[styles.attachBox, photoAttached && styles.attachBoxActive]}
            onPress={() => setPhotoAttached(!photoAttached)}
          >
            <Feather
              name={photoAttached ? 'check-circle' : 'paperclip'}
              size={18}
              color={photoAttached ? '#10B981' : '#F59019'}
            />
            <Text style={styles.attachText}>
              {photoAttached
                ? 'Screenshot Attached (Tap to remove)'
                : 'Attach Screenshot (Optional)'}
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="SUBMIT FEEDBACK"
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            style={{ marginTop: 20 }}
          />
        </CustomCard>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={submittedModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="heart" size={38} color="#FFFFFF" />
            </View>
            <Text style={styles.modalHeading}>Thank You For Your Feedback!</Text>
            <Text style={styles.modalBody}>
              Your rating and suggestions have been recorded and sent to the MCF Commissioner's Citizen Grievance Audit Team.
            </Text>
            <CustomButton
              title="RETURN TO HOME"
              onPress={() => {
                setSubmittedModal(false);
                router.replace('/(drawer)/home' as any);
              }}
              style={{ width: '100%', marginTop: 16 }}
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
  card: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 18,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  starBtn: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 10,
  },
  categoryChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F59019',
  },
  catChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  catChipTextActive: {
    color: '#F59019',
    fontWeight: '700',
  },
  labelCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  counterText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  textAreaBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    padding: 12,
    minHeight: 110,
    marginBottom: 14,
  },
  textArea: {
    fontSize: 14,
    color: '#1E293B',
    textAlignVertical: 'top',
    height: 90,
  },
  attachBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    borderRadius: Radius.md,
    gap: 8,
  },
  attachBoxActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  attachText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },

  /* Success Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Shadow.lg,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
