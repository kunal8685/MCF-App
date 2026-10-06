import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import {
  fetchCitizenComplaintsApi,
  CitizenComplaintItem,
} from '@/services/grievanceApi';
import { Radius, Shadow } from '@/constants/theme';

type FilterTab = 'All' | 'Pending' | 'In Progress' | 'Resolved';

export default function MyComplaintsScreen() {
  const router = useRouter();

  const [complaints, setComplaints] = useState<CitizenComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('All');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const filterTabs: FilterTab[] = ['All', 'Pending', 'In Progress', 'Resolved'];

  const getStatusParam = (tab: FilterTab): string | undefined => {
    switch (tab) {
      case 'Pending':
        return 'pending';
      case 'In Progress':
        return 'inprogress';
      case 'Resolved':
        return 'closed';
      default:
        return undefined;
    }
  };

  const loadComplaints = useCallback(
    async (isPullToRefresh = false, pageToLoad = 1) => {
      if (isPullToRefresh) {
        setRefreshing(true);
      } else if (pageToLoad > 1) {
        setLoadingMore(true);
      }
      setErrorMessage('');

      try {
        const statusParam = getStatusParam(selectedFilter);
        const res = await fetchCitizenComplaintsApi({
          status: statusParam,
          search: searchQuery.trim() || undefined,
          page: pageToLoad,
          page_size: 15,
        });

        const newItems = res.complaints || [];
        if (pageToLoad === 1) {
          setComplaints(newItems);
        } else {
          setComplaints((prev) => [...prev, ...newItems]);
        }

        setCurrentPage(pageToLoad);
        setHasNextPage(Boolean(res.pagination?.has_next));
        setTotalRecords(
          res.pagination?.total_records ??
            (pageToLoad === 1 ? newItems.length : complaints.length + newItems.length)
        );
      } catch (err: any) {
        console.warn('Error fetching citizen complaints:', err?.message);
        setErrorMessage(err?.message || 'Could not load complaints from server.');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [selectedFilter, searchQuery, complaints.length]
  );

  useEffect(() => {
    let isActive = true;
    const fetchInitial = async () => {
      if (!isActive) return;
      await loadComplaints(false, 1);
    };
    fetchInitial();
    return () => {
      isActive = false;
    };
  }, [loadComplaints]);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasNextPage) {
      loadComplaints(false, currentPage + 1);
    }
  };

  const toggleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeStyle = (statusLabel?: string, rawStatus?: any) => {
    const s = (statusLabel || String(rawStatus || '')).toLowerCase();
    if (s.includes('close') || s.includes('resolve') || s === '5') {
      return { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC', label: 'Resolved' };
    }
    if (s.includes('progress') || s.includes('assign') || s.includes('inspect') || s === '2') {
      return { bg: '#EFF6FF', text: '#2563EB', border: '#93C5FD', label: 'In Progress' };
    }
    return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', label: statusLabel || 'Pending' };
  };

  const handleCallOfficer = (phone?: string) => {
    if (!phone) {
      Alert.alert('Contact Not Available', 'Officer contact details will be updated once assigned.');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const renderComplaintItem = ({ item }: { item: CitizenComplaintItem }) => {
    const raw = item.GmdaComplaint || {};
    const compId = raw.id;
    const isExpanded = expandedId === compId;

    const ticketNo = raw.complaint_no_auto || (compId ? `#${compId}` : 'MCF Ticket');
    const categoryName = item.complaint_type_name || 'Civic Grievance';
    const subtypeName = item.sub_type_name || '';
    const description = raw.complaint_description || 'No description provided';
    const address = raw.address_landmark || 'Faridabad';
    const wardName = item.ward_name || (item.ward ? `Ward ${item.ward}` : '');
    const dateFormatted = formatDate(raw.created_at);
    const badge = getStatusBadgeStyle(item.status_label, raw.status);
    const images: string[] = Array.isArray(item.images_list) && item.images_list.length > 0
      ? item.images_list
      : (Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : (raw.img_url ? String(raw.img_url).split(',').map((s: string) => s.trim()).filter(Boolean) : []));

    return (
      <CustomCard style={styles.card} onPress={() => toggleExpand(compId)}>
        {/* Header: Category & Status */}
        <View style={styles.cardHeader}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryDot} />
            <Text style={styles.categoryTitle} numberOfLines={1}>
              {categoryName}
            </Text>
          </View>
          <View style={[styles.badgeContainer, { backgroundColor: badge.bg, borderColor: badge.border }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        {subtypeName ? (
          <Text style={styles.subtypeText}>{subtypeName}</Text>
        ) : null}

        {/* Ticket ID & Date */}
        <View style={styles.metaRow}>
          <Text style={styles.ticketNumber}>{ticketNo}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.dateText}>{dateFormatted}</Text>
          {raw.severity ? (
            <>
              <Text style={styles.metaDot}>•</Text>
              <Text
                style={[
                  styles.severityPill,
                  raw.severity === 'major' ? styles.severityMajor : styles.severityMinor,
                ]}
              >
                {raw.severity.toUpperCase()}
              </Text>
            </>
          ) : null}
        </View>

        {/* Description */}
        <Text style={styles.descriptionText} numberOfLines={isExpanded ? undefined : 2}>
          {description}
        </Text>

        {/* Address */}
        <View style={styles.addressRow}>
          <Feather name="map-pin" size={13} color="#F59019" />
          <Text style={styles.addressText} numberOfLines={1}>
            {address} {wardName ? `(${wardName})` : ''}
          </Text>
        </View>

        {/* Assigned Officer (if assigned) */}
        {item.inspection_officer_name ? (
          <View style={styles.officerBox}>
            <Feather name="user-check" size={13} color="#3B82F6" />
            <Text style={styles.officerText}>
              Inspection Officer: {item.inspection_officer_name}
            </Text>
            {item.inspection_officer_phone ? (
              <TouchableOpacity
                style={styles.officerCallBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  handleCallOfficer(item.inspection_officer_phone);
                }}
              >
                <Feather name="phone-call" size={12} color="#16A34A" />
                <Text style={styles.officerCallText}>Call</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {/* Expanded View */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            <View style={styles.divider} />

            <Text style={styles.expandedTitle}>Tracking Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference No:</Text>
              <Text style={styles.detailVal}>{ticketNo}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Department:</Text>
              <Text style={styles.detailVal}>{item.department_name || 'Municipal Corporation Faridabad'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Registered On:</Text>
              <Text style={styles.detailVal}>{raw.created_at ? new Date(raw.created_at).toLocaleString() : 'N/A'}</Text>
            </View>

            {subtypeName ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Sub-Category:</Text>
                <Text style={styles.detailVal}>{subtypeName}</Text>
              </View>
            ) : null}

            {item.ward_name || raw.ward ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ward / Zone:</Text>
                <Text style={styles.detailVal}>
                  {item.ward_name || `Ward ${raw.ward}`} {item.zone ? `(${item.zone})` : ''}
                </Text>
              </View>
            ) : null}

            {raw.first_name || raw.contact_number ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Citizen Details:</Text>
                <Text style={styles.detailVal}>
                  {raw.first_name || 'Citizen'} {raw.contact_number ? `(${raw.contact_number})` : ''}
                </Text>
              </View>
            ) : null}

            {item.closed_by_name ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Resolved By:</Text>
                <Text style={styles.detailVal}>
                  {item.closed_by_name} {item.closed_by_phone ? `(${item.closed_by_phone})` : ''}
                </Text>
              </View>
            ) : null}

            {item.sla_breached ? (
              <View style={styles.slaBreachedBadge}>
                <Feather name="alert-circle" size={13} color="#DC2626" />
                <Text style={styles.slaBreachedText}>SLA Escalated to Senior Executive Engineer</Text>
              </View>
            ) : (
              <View style={styles.slaOnTrackBadge}>
                <Feather name="check" size={13} color="#16A34A" />
                <Text style={styles.slaOnTrackText}>Resolution in progress under SLA</Text>
              </View>
            )}

            {/* Attached Photo Evidence */}
            {images.length > 0 && (
              <View style={styles.photoContainer}>
                <Text style={styles.detailLabel}>Attached Evidence ({images.length}):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
                  {images.map((imgUri, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.photoThumbWrapper}
                      onPress={() => {
                        if (imgUri && (imgUri.startsWith('http') || imgUri.startsWith('file'))) {
                          Linking.openURL(imgUri).catch(() => {});
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: imgUri }} style={styles.photoThumb} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Resolved Photo */}
            {item.resolved_photo ? (
              <View style={styles.photoContainer}>
                <Text style={styles.detailLabel}>Resolution Proof Photo:</Text>
                <TouchableOpacity
                  style={styles.photoThumbWrapper}
                  onPress={() => {
                    if (item.resolved_photo && item.resolved_photo.startsWith('http')) {
                      Linking.openURL(item.resolved_photo).catch(() => {});
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.resolved_photo }} style={styles.photoThumb} />
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.actionBtnRow}>
              {badge.label === 'Resolved' ? (
                <TouchableOpacity
                  style={styles.reopenBtn}
                  onPress={() =>
                    Alert.alert(
                      'Reopen Ticket',
                      'Your grievance has been submitted for re-investigation by the Zonal Officer.'
                    )
                  }
                >
                  <Feather name="rotate-ccw" size={13} color="#DC2626" />
                  <Text style={styles.reopenBtnText}>Reopen Ticket</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.feedbackBtn}
                onPress={() => router.push('/feedback' as any)}
              >
                <Feather name="star" size={13} color="#F59019" />
                <Text style={styles.feedbackBtnText}>Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Footer Expand Arrow */}
        <View style={styles.cardFooter}>
          <Text style={styles.viewTimelineText}>
            {isExpanded ? 'Hide Details' : 'View Full Details & Status'}
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
            activeOpacity={0.8}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search complaint number, category, or area..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => loadComplaints(false, 1)}
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
            style={[styles.tabPill, selectedFilter === tab && styles.tabPillActive]}
            onPress={() => setSelectedFilter(tab)}
            activeOpacity={0.7}
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

      {/* Content / List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59019" />
          <Text style={styles.loadingText}>Fetching your grievances from MCF server...</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item, idx) => String(item.GmdaComplaint?.id || idx)}
          renderItem={renderComplaintItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadComplaints(true, 1)}
              colors={['#F59019']}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMoreWrapper}>
                <ActivityIndicator size="small" color="#F59019" />
                <Text style={styles.loadingMoreText}>Loading more complaints...</Text>
              </View>
            ) : totalRecords > 0 ? (
              <View style={styles.totalRecordsFooter}>
                <Text style={styles.totalRecordsText}>
                  Showing {complaints.length} of {totalRecords} grievances
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Feather name="inbox" size={40} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Complaints Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? 'No matching complaints found for your search.'
                  : errorMessage
                  ? errorMessage
                  : 'You have not registered any grievances under this filter.'}
              </Text>
              <TouchableOpacity
                style={styles.emptyLodgeBtn}
                onPress={() => router.push('/new-complaint' as any)}
                activeOpacity={0.85}
              >
                <Feather name="plus-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.emptyLodgeText}>Lodge Grievance Now</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerPlus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 6,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59019',
    marginRight: 6,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtypeText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  badgeContainer: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59019',
  },
  metaDot: {
    marginHorizontal: 6,
    color: '#94A3B8',
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
  },
  severityPill: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  severityMajor: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  severityMinor: {
    backgroundColor: '#E0F2FE',
    color: '#0284C7',
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
    marginBottom: 6,
  },
  addressText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
    flex: 1,
  },
  officerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  officerText: {
    fontSize: 12,
    color: '#1E40AF',
    marginLeft: 6,
    flex: 1,
    fontWeight: '500',
  },
  officerCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  officerCallText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    marginLeft: 4,
  },
  expandedSection: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  expandedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  slaBreachedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  slaBreachedText: {
    fontSize: 11,
    color: '#B91C1C',
    marginLeft: 6,
    fontWeight: '600',
  },
  slaOnTrackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  slaOnTrackText: {
    fontSize: 11,
    color: '#15803D',
    marginLeft: 6,
    fontWeight: '600',
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  reopenBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  reopenBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 4,
  },
  feedbackBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
  },
  feedbackBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C2410C',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  viewTimelineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyLodgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59019',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    ...Shadow.sm,
  },
  emptyLodgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoContainer: {
    marginTop: 10,
  },
  photoRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  photoThumbWrapper: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingMoreWrapper: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  totalRecordsFooter: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  totalRecordsText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
