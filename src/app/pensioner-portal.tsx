import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { CustomButton } from '@/components/common/CustomButton';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function PensionerPortalScreen() {
  const [ppoNumber, setPpoNumber] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const handleSearchPpo = () => {
    if (!ppoNumber.trim()) {
      Alert.alert('Required', 'Please enter your PPO (Pension Payment Order) Number.');
      return;
    }
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setSearchResult({
        name: 'Sh. Ram Kumar Sharma',
        ppo: ppoNumber.trim(),
        department: 'Engineering (Water Works)',
        lastPaidMonth: 'August 2026',
        amount: '₹ 28,450',
        status: 'Active (Life Certificate Valid up to Nov 2026)',
      });
    }, 800);
  };

  const handleOpenJeevanPramaan = () => {
    Linking.openURL('https://jeevanpramaan.gov.in').catch(() => {
      Alert.alert('Jeevan Pramaan', 'Visit nearest CSC or download Jeevan Pramaan app with Face RD.');
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Pensioner Portal" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <FontAwesome5 name="user-check" size={30} color="#F59019" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>MCF Pensioner Welfare Cell</Text>
            <Text style={styles.heroSubtitle}>
              Dedicated services for retired municipal staff and family pensioners.
            </Text>
          </View>
        </View>

        {/* PPO Quick Search Card */}
        <CustomCard style={styles.searchCard}>
          <Text style={styles.searchCardTitle}>Track Pension Status & Slip</Text>
          <Text style={styles.searchCardSubtitle}>
            Enter your 12-digit PPO Number to check payment disbursal.
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.ppoInput}
              placeholder="e.g. MCF-PPO-2018-4421"
              placeholderTextColor="#94A3B8"
              value={ppoNumber}
              onChangeText={setPpoNumber}
            />
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={handleSearchPpo}
              disabled={searching}
            >
              <Feather name="search" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {searchResult && (
            <View style={styles.resultBox}>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.resultName}>{searchResult.name}</Text>
              </View>
              <Text style={styles.resultDetail}>PPO: {searchResult.ppo}</Text>
              <Text style={styles.resultDetail}>Dept: {searchResult.department}</Text>
              <Text style={styles.resultDetail}>Last Disbursed: {searchResult.lastPaidMonth}</Text>
              <Text style={[styles.resultDetail, { color: '#059669', fontWeight: '700' }]}>
                Status: {searchResult.status}
              </Text>

              <TouchableOpacity
                style={styles.downloadSlipBtn}
                onPress={() => Alert.alert('Download', 'Pension Pay Slip downloaded to device.')}
              >
                <Feather name="download" size={14} color="#F59019" />
                <Text style={styles.downloadSlipText}>Download Aug 2026 Slip</Text>
              </TouchableOpacity>
            </View>
          )}
        </CustomCard>

        {/* Key Pensioner Services Grid */}
        <Text style={styles.sectionHeading}>Pension Services</Text>

        {/* 1. Life Certificate */}
        <CustomCard style={styles.serviceCard} onPress={handleOpenJeevanPramaan}>
          <View style={styles.serviceRow}>
            <View style={[styles.iconBg, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="shield" size={24} color="#3B82F6" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Digital Life Certificate (Jeevan Pramaan)</Text>
              <Text style={styles.serviceDesc}>
                Submit biometric / face authentication annual life certificate from home or any CSC.
              </Text>
              <Text style={styles.actionLink}>Open Jeevan Pramaan →</Text>
            </View>
          </View>
        </CustomCard>

        {/* 2. Pension Grievance */}
        <CustomCard
          style={styles.serviceCard}
          onPress={() =>
            Alert.alert(
              'Pension Grievance',
              'To register a pension grievance, email pension@mcfaridabad.org or call 0129-2415549 (Ext. 214).'
            )
          }
        >
          <View style={styles.serviceRow}>
            <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="alert-circle" size={24} color="#D97706" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Pension Grievance Redressal</Text>
              <Text style={styles.serviceDesc}>
                Report pension arrears, family pension transfer, or medical reimbursement delays.
              </Text>
              <Text style={[styles.actionLink, { color: '#D97706' }]}>Lodge Redressal →</Text>
            </View>
          </View>
        </CustomCard>

        {/* 3. Downloadable Forms */}
        <CustomCard
          style={styles.serviceCard}
          onPress={() =>
            Alert.alert(
              'Pension Forms',
              'Form 6, Form 7, Nomination Form, and Commutation forms are available for download.'
            )
          }
        >
          <View style={styles.serviceRow}>
            <View style={[styles.iconBg, { backgroundColor: '#F0FDF4' }]}>
              <Feather name="file-text" size={24} color="#10B981" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Download Statutory Forms</Text>
              <Text style={styles.serviceDesc}>
                Download Form 6 (Retirement Claim), Form 7 (Family Pension), and Commutation slips.
              </Text>
              <Text style={[styles.actionLink, { color: '#10B981' }]}>Browse Forms →</Text>
            </View>
          </View>
        </CustomCard>

        {/* Help Desk Info */}
        <View style={styles.helpDeskCard}>
          <Text style={styles.helpDeskTitle}>Pension Branch Contact</Text>
          <Text style={styles.helpDeskText}>
            Room 104, 1st Floor, MCF Headquarters, BK Chowk, Faridabad.
          </Text>
          <Text style={styles.helpDeskContact}>
            Phone: 0129-2415549 (Ext 214) • 10:00 AM - 5:00 PM
          </Text>
        </View>
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
    gap: 14,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: Radius.card,
    padding: 16,
    gap: 14,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C86600',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 17,
  },
  searchCard: {
    padding: 16,
  },
  searchCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  searchCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ppoInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  searchBtn: {
    backgroundColor: '#F59019',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radius.button,
  },
  resultBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    padding: 12,
    marginTop: 14,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  resultDetail: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  downloadSlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    gap: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  downloadSlipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59019',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 6,
  },
  serviceCard: {
    padding: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 6,
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  helpDeskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helpDeskTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  helpDeskText: {
    fontSize: 12,
    color: '#64748B',
  },
  helpDeskContact: {
    fontSize: 11,
    color: '#F59019',
    fontWeight: '600',
    marginTop: 4,
  },
});
