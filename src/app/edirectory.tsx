import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { EDIRECTORY_DATA, Officer } from '@/data/edirectoryData';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function EDirectoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', 'Administration', 'Engineering', 'Sanitation', 'Health'];

  const filteredOfficers = EDIRECTORY_DATA.filter((officer) => {
    const matchesDept = selectedDept === 'All' ? true : officer.department === selectedDept;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      officer.name.toLowerCase().includes(query) ||
      officer.designation.toLowerCase().includes(query) ||
      officer.department.toLowerCase().includes(query) ||
      officer.zone.toLowerCase().includes(query) ||
      officer.phone.includes(query);

    return matchesDept && matchesSearch;
  });

  const handleCall = (phone: string, name: string) => {
    const url = `tel:${phone.replace(/[^0-9]/g, '')}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Phone Call', `Dialing ${phone} for ${name}`);
      }
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  const renderOfficerItem = ({ item }: { item: Officer }) => (
    <CustomCard style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{item.name[4] || 'O'}</Text>
        </View>
        <View style={styles.officerDetailsCol}>
          <Text style={styles.officerName}>{item.name}</Text>
          <Text style={styles.officerDesignation}>{item.designation}</Text>

          <View style={styles.badgesRow}>
            <View style={styles.deptBadge}>
              <Text style={styles.deptBadgeText}>{item.department}</Text>
            </View>
            <View style={styles.zoneBadge}>
              <Text style={styles.zoneBadgeText}>{item.zone}</Text>
            </View>
          </View>
        </View>
      </View>

      {item.officeAddress && (
        <View style={styles.addressRow}>
          <Feather name="map-pin" size={13} color="#64748B" />
          <Text style={styles.addressText} numberOfLines={1}>
            {item.officeAddress}
          </Text>
        </View>
      )}

      <View style={styles.cardBottomRow}>
        <View style={styles.phoneWrapper}>
          <Feather name="phone" size={13} color="#F59019" />
          <Text style={styles.phoneText}>+91 {item.phone}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.emailBtn}
            onPress={() => handleEmail(item.email)}
          >
            <Feather name="mail" size={15} color="#3B82F6" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => handleCall(item.phone, item.name)}
          >
            <Feather name="phone-call" size={15} color="#FFFFFF" />
            <Text style={styles.callBtnText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomCard>
  );

  return (
    <View style={styles.container}>
      <Header title="E-Directory" showBack />

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search officer by name, designation, zone..."
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

      {/* Department Tabs */}
      <View style={styles.deptTabsRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={departments}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.deptScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.deptChip,
                selectedDept === item && styles.deptChipActive,
              ]}
              onPress={() => setSelectedDept(item)}
            >
              <Text
                style={[
                  styles.deptChipText,
                  selectedDept === item && styles.deptChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Officers List */}
      <FlatList
        data={filteredOfficers}
        keyExtractor={(item) => item.id}
        renderItem={renderOfficerItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="user-x" size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Officers Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with another name, phone number, or department.
            </Text>
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
  deptTabsRow: {
    paddingVertical: 10,
  },
  deptScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  deptChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deptChipActive: {
    backgroundColor: '#F59019',
    borderColor: '#F59019',
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  deptChipTextActive: {
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
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F59019',
  },
  officerDetailsCol: {
    flex: 1,
  },
  officerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  officerDesignation: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  deptBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  deptBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  zoneBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  zoneBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.button,
    gap: 6,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});
