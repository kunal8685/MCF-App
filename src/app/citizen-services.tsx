import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { CustomButton } from '@/components/common/CustomButton';
import { CITIZEN_SERVICES, CitizenService } from '@/data/servicesData';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function CitizenServicesScreen() {
  const { language } = useLanguage();
  const [selectedService, setSelectedService] = useState<CitizenService | null>(null);
  const [consumerId, setConsumerId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenService = (service: CitizenService) => {
    setSelectedService(service);
    setConsumerId('');
    setModalVisible(true);
  };

  const handleProcessAction = () => {
    if (!selectedService) return;

    if (selectedService.id === 'prop-tax' || selectedService.id === 'water-sewer') {
      if (!consumerId.trim()) {
        Alert.alert('Required', 'Please enter your Property / Consumer ID to fetch bill.');
        return;
      }
      Alert.alert(
        'Bill Fetched',
        `Account: ${consumerId.trim()}\nBill Amount: ₹ 1,420\nDue Date: 31 Oct 2026\nEligible for 10% Online Rebate.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Pay Securely Online',
            onPress: () => {
              setModalVisible(false);
              Alert.alert('Payment Gateway', 'Redirecting to Haryana Treasury Payment Gateway.');
            },
          },
        ]
      );
    } else {
      setModalVisible(false);
      Alert.alert(
        selectedService.title,
        `Opening official e-portal for ${selectedService.title}. Ensure you have your Aadhaar and supporting documents ready.`
      );
    }
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'home':
        return <Feather name="home" size={24} color="#F59019" />;
      case 'droplets':
        return <Ionicons name="water" size={24} color="#0284C7" />;
      case 'briefcase':
        return <Feather name="briefcase" size={24} color="#D97706" />;
      case 'file-text':
        return <Feather name="file-text" size={24} color="#10B981" />;
      case 'layers':
        return <Feather name="layers" size={24} color="#8B5CF6" />;
      case 'flame':
        return <Ionicons name="flame" size={24} color="#EF4444" />;
      case 'smile':
        return <Feather name="smile" size={24} color="#EC4899" />;
      default:
        return <Feather name="grid" size={24} color="#F59019" />;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="All Citizen Services" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topNotice}>
          <Feather name="check-circle" size={18} color="#10B981" />
          <Text style={styles.noticeText}>
            Official Haryana Municipal Online Portal (ULB). Avail instant rebates, digital receipts, and verified certificates.
          </Text>
        </View>

        <View style={styles.servicesList}>
          {CITIZEN_SERVICES.map((service) => (
            <CustomCard
              key={service.id}
              style={styles.serviceCard}
              onPress={() => handleOpenService(service)}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.iconCircle}>
                  {renderIcon(service.icon)}
                </View>
                <View style={styles.titleCol}>
                  <Text style={styles.serviceTitle}>
                    {language === 'hi' ? service.hindiTitle : service.title}
                  </Text>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{service.category}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.serviceDescription}>
                {language === 'hi' ? service.hindiDescription : service.description}
              </Text>

              <View style={styles.requirementsBox}>
                <Text style={styles.reqTitle}>Required Documents:</Text>
                <Text style={styles.reqText}>
                  {service.requirements.join(' • ')}
                </Text>
              </View>

              <View style={styles.cardBottomRow}>
                <Text style={styles.actionPrompt}>Tap to proceed</Text>
                <View style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>{service.actionText}</Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" />
                </View>
              </View>
            </CustomCard>
          ))}
        </View>
      </ScrollView>

      {/* Service Action Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedService?.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>{selectedService?.description}</Text>

            {(selectedService?.id === 'prop-tax' || selectedService?.id === 'water-sewer') && (
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>
                  {selectedService.id === 'prop-tax'
                    ? 'Enter Unique Property ID (PID)'
                    : 'Enter Water Consumer Number'}
                </Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder={
                    selectedService.id === 'prop-tax'
                      ? 'e.g. 14A-452-019'
                      : 'e.g. WTR-2026-8910'
                  }
                  placeholderTextColor="#94A3B8"
                  value={consumerId}
                  onChangeText={setConsumerId}
                />
              </View>
            )}

            <View style={styles.reqSection}>
              <Text style={styles.reqModalTitle}>Checklist Requirements:</Text>
              {selectedService?.requirements.map((req, i) => (
                <View key={i} style={styles.reqRow}>
                  <Feather name="check" size={14} color="#10B981" />
                  <Text style={styles.reqRowText}>{req}</Text>
                </View>
              ))}
            </View>

            <CustomButton
              title={selectedService?.actionText || 'Proceed'}
              onPress={handleProcessAction}
              style={styles.modalBtn}
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
  topNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: Radius.card,
    padding: 12,
    gap: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    lineHeight: 17,
  },
  servicesList: {
    gap: 14,
  },
  serviceCard: {
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleCol: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  serviceDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  requirementsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  reqTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  reqText: {
    fontSize: 12,
    color: '#334155',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionPrompt: {
    fontSize: 12,
    color: '#94A3B8',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59019',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.button,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  inputSection: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  reqSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.sm,
    padding: 12,
    marginBottom: 18,
  },
  reqModalTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  reqRowText: {
    fontSize: 12,
    color: '#475569',
  },
  modalBtn: {
    width: '100%',
  },
});
