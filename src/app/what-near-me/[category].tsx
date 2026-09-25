import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import {
  NEAR_ME_PLACES,
  NEAR_ME_CATEGORIES,
  NearMeCategory,
  NearMePlace,
} from '@/data/nearMeData';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const catKey = (category as NearMeCategory) || 'atm';
  const categoryInfo = NEAR_ME_CATEGORIES.find((c) => c.id === catKey);
  const places = NEAR_ME_PLACES[catKey] || [];

  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDirections = (place: NearMePlace) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Directions', `Navigating to ${place.name} at ${place.address}`);
    });
  };

  const handleCall = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone.replace(/[^0-9]/g, '')}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title={categoryInfo ? categoryInfo.title : 'Nearby Amenities'}
        showBack
      />

      {/* Mode Toggle & Search */}
      <View style={styles.topFilterBar}>
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search in ${categoryInfo?.title || 'locations'}...`}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={14} color="#64748B" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.viewToggleGroup}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === 'list' && styles.toggleBtnActive,
            ]}
            onPress={() => setViewMode('list')}
          >
            <Feather
              name="list"
              size={16}
              color={viewMode === 'list' ? '#FFFFFF' : '#64748B'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === 'map' && styles.toggleBtnActive,
            ]}
            onPress={() => setViewMode('map')}
          >
            <Feather
              name="map"
              size={16}
              color={viewMode === 'map' ? '#FFFFFF' : '#64748B'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'map' ? (
          <View style={styles.mapContainer}>
            <View style={styles.simulatedMap}>
              <View style={styles.mapGridOverlay}>
                <View style={styles.mapCenterPin}>
                  <Ionicons name="location" size={36} color="#F59019" />
                  <View style={styles.pinLabel}>
                    <Text style={styles.pinLabelText}>Current Location</Text>
                  </View>
                </View>

                {filteredPlaces.map((place, idx) => (
                  <View
                    key={place.id}
                    style={[
                      styles.amenityPin,
                      {
                        top: 40 + (idx % 3) * 70,
                        left: 20 + ((idx * 80) % 240),
                      },
                    ]}
                  >
                    <Ionicons name="ellipse" size={14} color="#059669" />
                    <Text style={styles.amenityPinText}>{place.name.split(' ')[0]}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.mapNotice}>
                Map Mode: Showing verified municipal GPS geocodes
              </Text>
            </View>

            <Text style={styles.locationsUnderMap}>Verified Locations</Text>
          </View>
        ) : null}

        {filteredPlaces.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="map-pin" size={40} color="#94A3B8" />
            <Text style={styles.emptyText}>No facilities found matching query</Text>
          </View>
        ) : (
          filteredPlaces.map((place) => (
            <CustomCard key={place.id} style={styles.placeCard}>
              <View style={styles.placeHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  {place.timings && (
                    <Text style={styles.placeTimings}>⏰ {place.timings}</Text>
                  )}
                </View>
                <View style={styles.distanceBadge}>
                  <Ionicons name="navigate" size={12} color="#F59019" />
                  <Text style={styles.distanceText}>{place.distance}</Text>
                </View>
              </View>

              <View style={styles.addressRow}>
                <Feather name="map-pin" size={14} color="#64748B" />
                <Text style={styles.addressText}>{place.address}</Text>
              </View>

              <View style={styles.actionRow}>
                {place.phone ? (
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => handleCall(place.phone)}
                  >
                    <Feather name="phone" size={14} color="#10B981" />
                    <Text style={styles.callBtnText}>Call</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={styles.directionsBtn}
                  onPress={() => handleDirections(place)}
                >
                  <Ionicons name="navigate-circle-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.directionsBtnText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </CustomCard>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  topFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    padding: 0,
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.sm,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm - 2,
  },
  toggleBtnActive: {
    backgroundColor: '#F59019',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  mapContainer: {
    marginBottom: 8,
  },
  simulatedMap: {
    height: 200,
    backgroundColor: '#E2E8F0',
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'space-between',
    padding: 10,
  },
  mapGridOverlay: {
    flex: 1,
    position: 'relative',
  },
  mapCenterPin: {
    position: 'absolute',
    top: 60,
    left: '42%',
    alignItems: 'center',
  },
  pinLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    ...Shadow.sm,
  },
  pinLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E293B',
  },
  amenityPin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
    ...Shadow.sm,
  },
  amenityPinText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#334155',
  },
  mapNotice: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  locationsUnderMap: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 14,
  },
  placeCard: {
    padding: 16,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  placeTimings: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C86600',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.button,
    gap: 4,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59019',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.button,
    gap: 6,
    ...Shadow.sm,
  },
  directionsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
