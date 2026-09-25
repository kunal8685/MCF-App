import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { Badge } from '@/components/common/Badge';
import { useComplaints } from '@/context/ComplaintsContext';
import { Complaint, ComplaintStatus } from '@/data/complaintsData';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function MyComplaintsScreen() {
  const router = useRouter();
  const { complaints } = useComplaints();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | ComplaintStatus>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filterTabs: ('All' | ComplaintStatus)[] = ['All', 'Pending', 'In Progress', 'Resolved'];

  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter =
      selectedFilter === 'All' ? true : c.status.toLowerCase() === selectedFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      c.complaintNumber.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderComplaintItem = ({ item }: { item: Complaint }) => {
    const isExpanded = expandedId === item.id;

    return (
      <CustomCard style={styles.card} onPress={() => toggleExpand(item.id)}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryDot} />
            <Text style={styles.categoryTitle}>{item.category}</Text>
          </View>
          <Badge status={item.status} />
        </View>

        {/* Ticket ID & Date */}
        <View style={styles.metaRow}>
          <Text style={styles.ticketNumber}>{item.complaintNumber}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {/* Description */}
        <Text style={styles.descriptionText} numberOfLines={isExpanded ? undefined : 2}>
          {item.description}
        </Text>

        {/* Address */}
        <View style={styles.addressRow}>
          <Feather name="map-pin" size={13} color="#F59019" />
          <Text style={styles.addressText} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        {/* Assigned Officer */}
        {item.officerAssigned && (
          <View style={styles.officerBox}>
            <Feather name="user-check" size={13} color="#3B82F6" />
            <Text style={styles.officerText}>
              Assigned: {item.officerAssigned}
            </Text>
          </View>
        )}

        {/* Expandable Timeline */}
        {isExpanded && (
          <View style={styles.timelineSection}>
            <Text style={styles.timelineHeader}>Resolution Timeline</Text>
            {item.timeline.map((step, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineDot} />
                  {index !== item.timeline.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStatus}>{step.status}</Text>
                  <Text style={styles.timelineDate}>{step.date}</Text>
                  <Text style={styles.timelineRemarks}>{step.remarks}</Text>
                </View>
              </View>
            ))}

            {item.resolutionRemarks && (
              <View style={styles.resolutionBox}>
                <Feather name="check-circle" size={14} color="#10B981" />
                <Text style={styles.resolutionText}>
                  Officer Closing Remarks: {item.resolutionRemarks}
                </Text>
              </View>
            )}

            <View style={styles.actionBtnRow}>
              {item.status === 'Resolved' ? (
                <TouchableOpacity
                  style={styles.reopenBtn}
                  onPress={() =>
                    Alert.alert(
                      'Reopen Ticket',
                      'Your grievance has been reopened and escalated to the Zonal Joint Commissioner for inspection.'
                    )
                  }
                >
                  <Feather name="rotate-ccw" size={14} color="#EF4444" />
                  <Text style={styles.reopenBtnText}>Reopen Ticket</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.feedbackBtn}
                onPress={() => router.push('/feedback' as any)}
              >
                <Feather name="star" size={14} color="#F59019" />
                <Text style={styles.feedbackBtnText}>Rate Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Expand Arrow */}
        <View style={styles.cardFooter}>
          <Text style={styles.viewTimelineText}>
            {isExpanded ? 'Hide Details' : 'View Tracking Timeline'}
          </Text>
          <Feather
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#64748B"
          />
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Complaints"
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.headerPlus}
            onPress={() => router.push('/new-complaint' as any)}
          >
            <Feather name="plus" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ticket number, category, or area..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabPill,
              selectedFilter === tab && styles.tabPillActive,
            ]}
            onPress={() => setSelectedFilter(tab)}
          >
            <Text
              style={[
                styles.tabPillText,
                selectedFilter === tab && styles.tabPillTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaintItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Feather name="inbox" size={40} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No Complaints Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try adjusting your search query or filter.'
                : 'You have not lodged any complaints in this status category.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyLodgeBtn}
              onPress={() => router.push('/new-complaint' as any)}
            >
              <Text style={styles.emptyLodgeText}>Lodge Grievance Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  headerPlus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    ...Shadow.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPillActive: {
    backgroundColor: '#F59019',
    borderColor: '#F59019',
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59019',
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59019',
  },
  metaDot: {
    color: '#94A3B8',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
  },
  descriptionText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  officerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
    marginTop: 4,
  },
  officerText: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '500',
  },
  timelineSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timelineHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timelineLeft: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59019',
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#FED7AA',
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 8,
  },
  timelineStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  timelineDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  timelineRemarks: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  resolutionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 6,
  },
  resolutionText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
    flex: 1,
  },
  actionBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  reopenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  reopenBtnText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  feedbackBtnText: {
    fontSize: 12,
    color: '#C86600',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
  },
  viewTimelineText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  emptyLodgeBtn: {
    backgroundColor: '#F59019',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.button,
  },
  emptyLodgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
