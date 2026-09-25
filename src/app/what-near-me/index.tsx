import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { NEAR_ME_CATEGORIES, CategoryInfo, NearMeCategory } from '@/data/nearMeData';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, Radius, Shadow } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function WhatNearMeIndexScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const renderIcon = (cat: NearMeCategory) => {
    switch (cat) {
      case 'atm':
        return <Ionicons name="card" size={32} color="#F59019" />;
      case 'bus':
        return <Ionicons name="bus" size={32} color="#3B82F6" />;
      case 'community':
        return <Ionicons name="business" size={32} color="#10B981" />;
      case 'hospital':
        return <Ionicons name="medkit" size={32} color="#EF4444" />;
      case 'metro':
        return <Ionicons name="subway" size={32} color="#8B5CF6" />;
      case 'police':
        return <Ionicons name="shield" size={32} color="#0284C7" />;
      case 'toilet':
        return <Ionicons name="water" size={32} color="#0D9488" />;
      default:
        return <Feather name="map-pin" size={32} color="#F59019" />;
    }
  };

  const getBgColor = (cat: NearMeCategory) => {
    switch (cat) {
      case 'atm':
        return '#FFF7ED';
      case 'bus':
        return '#EFF6FF';
      case 'community':
        return '#F0FDF4';
      case 'hospital':
        return '#FEF2F2';
      case 'metro':
        return '#FAF5FF';
      case 'police':
        return '#E0F2FE';
      case 'toilet':
        return '#F0FDFA';
      default:
        return '#FFF7ED';
    }
  };

  const filteredCategories = NEAR_ME_CATEGORIES.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.hindiTitle.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <Header title="What Near Me" showBack />

      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search civic facilities (ATM, Metro, Hospital)..."
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBanner}>
          <Feather name="compass" size={24} color="#F59019" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Faridabad Civic Amenities</Text>
            <Text style={styles.heroSubtitle}>
              Find verified municipal toilets, transport hubs, banks & emergency care closest to your location.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Select Amenity Category</Text>

        <View style={styles.gridContainer}>
          {filteredCategories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/what-near-me/${item.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: getBgColor(item.id) }]}>
                {renderIcon(item.id)}
              </View>
              <Text style={styles.categoryTitle}>
                {language === 'hi' ? item.hindiTitle : item.title}
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{item.count} Locations</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: Radius.card,
    padding: 14,
    gap: 12,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C86600',
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 6,
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});
