import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { CustomButton } from '@/components/common/CustomButton';
import { useComplaints } from '@/context/ComplaintsContext';
import { useAuth } from '@/context/AuthContext';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function WaterSewageScreen() {
  const { addComplaint } = useComplaints();
  const { user } = useAuth();

  const [tankerModalVisible, setTankerModalVisible] = useState(false);
  const [tankerAddress, setTankerAddress] = useState(user.address || 'Sector 15, Faridabad');
  const [tankerPhone, setTankerPhone] = useState(user.mobile || '9876543210');
  const [tankerRemarks, setTankerRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookTanker = async () => {
    if (!tankerAddress.trim()) {
      Alert.alert('Required', 'Please enter delivery address.');
      return;
    }
    setLoading(true);
    await addComplaint({
      category: 'Water Tanker Request',
      description: `Emergency Water Tanker requested at ${tankerAddress}. Contact: ${tankerPhone}. Remarks: ${tankerRemarks || 'Urgent requirement'}`,
      address: tankerAddress,
      ward: user.ward || 'Ward 14',
    });
    setLoading(false);
    setTankerModalVisible(false);
    Alert.alert(
      'Tanker Booked Successfully!',
      'Your emergency drinking water tanker request has been logged. The nearest Water Works station will contact you for dispatch.'
    );
  };

  const handleQuickLodge = async (category: string) => {
    Alert.alert(
      `Report ${category}`,
      `Would you like to register a high-priority ticket for ${category} at ${user.address}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Lodge Urgent Ticket',
          onPress: async () => {
            const ticket = await addComplaint({
              category,
              description: `Urgent ${category} reported by citizen at ${user.address}. Requires immediate field intervention.`,
              address: user.address,
              ward: user.ward || 'Ward 14',
            });
            Alert.alert('Ticket Created', `Your grievance ticket ${ticket} has been dispatched to the Water & Sewage Division.`);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Water & Sewage Complaints" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerCard}>
          <Ionicons name="water" size={32} color="#0284C7" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>MCF Water Supply & Sewage Wing</Text>
            <Text style={styles.bannerSubtitle}>
              Dedicated fast-track resolution for water supply shortages, dirty water, pipeline leaks, and sewer overflow.
            </Text>
          </View>
        </View>

        {/* 1. Request Water Tanker */}
        <CustomCard
          style={styles.actionCard}
          onPress={() => setTankerModalVisible(true)}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <MaterialCommunityIcons name="water-pump" size={28} color="#0284C7" />
            </View>
            <View style={styles.infoCol}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>Request Emergency Water Tanker</Text>
                <View style={styles.fastPill}>
                  <Text style={styles.fastPillText}>FAST TRACK</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>
                Facing water shortage or supply breakdown? Request a free municipal drinking water tanker directly to your doorstep.
              </Text>
              <Text style={styles.actionPrompt}>Book Water Tanker →</Text>
            </View>
          </View>
        </CustomCard>

        {/* 2. Pipeline Leakage */}
        <CustomCard
          style={styles.actionCard}
          onPress={() => handleQuickLodge('Water Supply & Leakage')}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="alert-circle" size={28} color="#D97706" />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.cardTitle}>Report Main Pipeline Leakage</Text>
              <Text style={styles.cardDesc}>
                Prevent clean water wastage. Report broken distribution pipes or gushing valve leaks for immediate excavation clamp repair.
              </Text>
              <Text style={[styles.actionPrompt, { color: '#D97706' }]}>Report Leakage →</Text>
            </View>
          </View>
        </CustomCard>

        {/* 3. Sewerage Overflow */}
        <CustomCard
          style={styles.actionCard}
          onPress={() => handleQuickLodge('Sewerage Overflow / Blockage')}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
              <MaterialCommunityIcons name="pipe-leak" size={28} color="#DC2626" />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.cardTitle}>Sewer Overflow & Manhole Desilting</Text>
              <Text style={styles.cardDesc}>
                Choked sewer lines, missing manhole covers, or backflow in colonies. Dispatches super-sucker jetting machines.
              </Text>
              <Text style={[styles.actionPrompt, { color: '#DC2626' }]}>Report Overflow →</Text>
            </View>
          </View>
        </CustomCard>

        {/* 4. Water Contamination */}
        <CustomCard
          style={styles.actionCard}
          onPress={() => handleQuickLodge('Water Contamination')}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDF2F8' }]}>
              <Ionicons name="flask" size={26} color="#DB2777" />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.cardTitle}>Contaminated / Dirty Tap Water</Text>
              <Text style={styles.cardDesc}>
                Smelly, muddy, or unpotable water. Immediately prompts lab sample collection and chlorination check.
              </Text>
              <Text style={[styles.actionPrompt, { color: '#DB2777' }]}>Report Contamination →</Text>
            </View>
          </View>
        </CustomCard>

        {/* Contact Strip */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Water Supply Control Desk</Text>
          <Text style={styles.contactText}>
            Direct Line: 0129-2288001 / 9818899001 • Operating 24 Hours
          </Text>
          <TouchableOpacity
            style={styles.callDeskBtn}
            onPress={() => Linking.openURL('tel:01292288001')}
          >
            <Feather name="phone-call" size={14} color="#FFFFFF" />
            <Text style={styles.callDeskBtnText}>Call Control Room</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tanker Booking Modal */}
      <Modal
        visible={tankerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTankerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Water Tanker</Text>
              <TouchableOpacity onPress={() => setTankerModalVisible(false)}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              MCF provides free drinking water tankers for colonies experiencing tubewell/booster breakdown.
            </Text>

            <Text style={styles.fieldLabel}>Delivery Address *</Text>
            <TextInput
              style={styles.modalInput}
              value={tankerAddress}
              onChangeText={setTankerAddress}
              placeholder="House No, Street, Sector"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.fieldLabel}>Citizen Contact Number *</Text>
            <TextInput
              style={styles.modalInput}
              value={tankerPhone}
              onChangeText={setTankerPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Text style={styles.fieldLabel}>Requirement Reason (Optional)</Text>
            <TextInput
              style={[styles.modalInput, { height: 60 }]}
              value={tankerRemarks}
              onChangeText={setTankerRemarks}
              placeholder="e.g. Booster pump failure in sector since morning"
              placeholderTextColor="#94A3B8"
              multiline
            />

            <CustomButton
              title="DISPATCH TANKER REQUEST"
              onPress={handleBookTanker}
              loading={loading}
              style={{ marginTop: 10 }}
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
    gap: 14,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: Radius.card,
    padding: 16,
    gap: 14,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0369A1',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
    lineHeight: 17,
  },
  actionCard: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  fastPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  fastPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 8,
  },
  actionPrompt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  contactText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  callDeskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.button,
    alignSelf: 'flex-start',
    gap: 6,
  },
  callDeskBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 20,
    ...Shadow.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 12,
  },
});
