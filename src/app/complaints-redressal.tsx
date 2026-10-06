import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { Radius, Shadow } from '@/constants/theme';
import { fetchCitizenComplaintsApi } from '@/services/grievanceApi';

export default function ComplaintsRedressalScreen() {
  const router = useRouter();
  const [counts, setCounts] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  const loadCounts = useCallback(async () => {
    try {
      const res = await fetchCitizenComplaintsApi({ page_size: 100 });
      if (res && res.complaints) {
        const list = res.complaints;
        const total = res.pagination?.total_records || list.length;
        const resolved = list.filter((c) => {
          const s = (c.status_label || String(c.GmdaComplaint?.status || '')).toLowerCase();
          return s.includes('close') || s.includes('resolve') || s === '5';
        }).length;
        const inProgress = list.filter((c) => {
          const s = (c.status_label || String(c.GmdaComplaint?.status || '')).toLowerCase();
          return s.includes('progress') || s.includes('assign') || s.includes('inspect') || s === '2';
        }).length;
        const pending = Math.max(0, total - resolved - inProgress);
        setCounts({ total, pending, inProgress, resolved });
      }
    } catch {
      // keep default 0 counts
    }
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const { total, pending, inProgress, resolved } = counts;

  const handleCallTollFree = () => {
    Linking.openURL('tel:18001802013');
  };

  return (
    <View style={styles.container}>
      <Header title="Complaints Redressal" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Statistics Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Citizen Grievance Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#F59019' }]}>{total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{inProgress}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{resolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>
        </View>

        {/* 1. Lodge New Complaint */}
        <CustomCard
          style={styles.actionCard}
          onPress={() => router.push('/new-complaint' as any)}
        >
          <View style={styles.actionRow}>
            <View style={[styles.iconBg, { backgroundColor: '#FFF7ED' }]}>
              <Feather name="plus-circle" size={28} color="#F59019" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Lodge New Complaint</Text>
              <Text style={styles.actionDesc}>
                Take or upload a photo, select category, and submit civic issues directly to ward officers.
              </Text>
              <View style={styles.btnRow}>
                <View style={[styles.pillBtn, { backgroundColor: '#F59019' }]}>
                  <Text style={styles.pillBtnText}>Lodge Complaint</Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
        </CustomCard>

        {/* 2. My Complaints */}
        <CustomCard
          style={styles.actionCard}
          onPress={() => router.push('/my-complaints' as any)}
        >
          <View style={styles.actionRow}>
            <View style={[styles.iconBg, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="clock" size={28} color="#3B82F6" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>My Complaints</Text>
              <Text style={styles.actionDesc}>
                Track live resolution progress, inspection remarks, and action photos for your lodged tickets.
              </Text>
              <View style={styles.btnRow}>
                <View style={[styles.pillBtn, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.pillBtnText}>View History ({total})</Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
        </CustomCard>

        {/* 3. Toll Free Helpline */}
        <CustomCard style={styles.actionCard} onPress={handleCallTollFree}>
          <View style={styles.actionRow}>
            <View style={[styles.iconBg, { backgroundColor: '#F0FDF4' }]}>
              <Feather name="phone-call" size={28} color="#10B981" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Toll Free Helpline</Text>
              <Text style={styles.actionDesc}>
                24x7 Municipal Control Room for emergency civic assistance, water supply distress, and stray animals.
              </Text>
              <Text style={styles.phoneHighlight}>1800-180-2013 • 0129-2415549</Text>
              <View style={styles.btnRow}>
                <View style={[styles.pillBtn, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.pillBtnText}>Call 1800-180-2013</Text>
                  <Feather name="phone" size={14} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
        </CustomCard>

        {/* Citizen Charter Guarantee */}
        <View style={styles.charterCard}>
          <Feather name="shield" size={20} color="#F59019" />
          <View style={styles.charterTextCol}>
            <Text style={styles.charterTitle}>MCF Citizen Charter SLA</Text>
            <Text style={styles.charterDesc}>
              Under the Haryana Right to Service Act, all civic complaints must be acted upon within 24 to 72 hours. Escalations are directly monitored by the Commissioner.
            </Text>
          </View>
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
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 16,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  actionCard: {
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  phoneHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: 'row',
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pillBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  charterCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    borderRadius: Radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    gap: 12,
    alignItems: 'flex-start',
    marginTop: 4,
  },
  charterTextCol: {
    flex: 1,
  },
  charterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C86600',
    marginBottom: 2,
  },
  charterDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
});
