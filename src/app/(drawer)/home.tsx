import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { DrawerModal } from '@/components/common/DrawerModal';
import { WeatherAQIWidget } from '@/components/common/WeatherAQIWidget';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Radius, Shadow } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Layout constants — kept in one place so grid spacing stays perfectly
// consistent regardless of screen width.
const SCREEN_PADDING = 16;
const GRID_GAP = 12;
const GRID_COLUMNS = 3;
const GRID_ITEM_WIDTH =
  (width - SCREEN_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

interface GridItem {
  id: string;
  titleKey: string;
  defaultTitle: string;
  hindiTitle: string;
  route: string;
  iconName: any;
  iconFamily: 'Feather' | 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  bgColor: string;
  iconColor: string;
}

const DASHBOARD_TILES: GridItem[] = [
  {
    id: '1',
    titleKey: 'mcfInfo',
    defaultTitle: 'MCF Info',
    hindiTitle: 'एमसीएफ जानकारी',
    route: '/mcf-info',
    iconName: 'information-circle',
    iconFamily: 'Ionicons',
    bgColor: '#FFF7ED',
    iconColor: '#F59019',
  },
  {
    id: '2',
    titleKey: 'connectMcf',
    defaultTitle: 'Connect With MCF',
    hindiTitle: 'एमसीएफ से जुड़ें',
    route: '/connect-mcf',
    iconName: 'share-social',
    iconFamily: 'Ionicons',
    bgColor: '#EFF6FF',
    iconColor: '#3B82F6',
  },
  {
    id: '3',
    titleKey: 'complaintsRedressal',
    defaultTitle: 'Complaints Redressal',
    hindiTitle: 'शिकायत निवारण',
    route: '/complaints-redressal',
    iconName: 'file-text',
    iconFamily: 'Feather',
    bgColor: '#FEF2F2',
    iconColor: '#EF4444',
  },
  {
    id: '4',
    titleKey: 'helpline',
    defaultTitle: 'Helpline 24*7',
    hindiTitle: 'हेल्पलाइन 24*7',
    route: '/helpline',
    iconName: 'phone-call',
    iconFamily: 'Feather',
    bgColor: '#F0FDF4',
    iconColor: '#10B981',
  },
  {
    id: '5',
    titleKey: 'whatNearMe',
    defaultTitle: 'What Near Me',
    hindiTitle: 'मेरे पास क्या है',
    route: '/what-near-me',
    iconName: 'map-pin',
    iconFamily: 'Feather',
    bgColor: '#FAF5FF',
    iconColor: '#8B5CF6',
  },
  {
    id: '6',
    titleKey: 'pensionerPortal',
    defaultTitle: 'Pensioner Portal',
    hindiTitle: 'पेंशनभोगी पोर्टल',
    route: '/pensioner-portal',
    iconName: 'users',
    iconFamily: 'Feather',
    bgColor: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: '7',
    titleKey: 'allCitizenServices',
    defaultTitle: 'All Citizen Services',
    hindiTitle: 'सभी नागरिक सेवाएं',
    route: '/citizen-services',
    iconName: 'grid',
    iconFamily: 'Feather',
    bgColor: '#ECFEFF',
    iconColor: '#06B6D4',
  },
  {
    id: '8',
    titleKey: 'waterSewage',
    defaultTitle: 'Water & Sewage Complaints',
    hindiTitle: 'पानी और सीवेज शिकायतें',
    route: '/water-sewage',
    iconName: 'water',
    iconFamily: 'Ionicons',
    bgColor: '#E0F2FE',
    iconColor: '#0284C7',
  },
  {
    id: '9',
    titleKey: 'eDirectory',
    defaultTitle: 'E-Directory',
    hindiTitle: 'ई-डायरेक्टरी',
    route: '/edirectory',
    iconName: 'book-open',
    iconFamily: 'Feather',
    bgColor: '#FDF2F8',
    iconColor: '#EC4899',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const renderIcon = (item: GridItem) => {
    switch (item.iconFamily) {
      case 'Ionicons':
        return <Ionicons name={item.iconName} size={26} color={item.iconColor} />;
      case 'MaterialCommunityIcons':
        return (
          <MaterialCommunityIcons
            name={item.iconName}
            size={26}
            color={item.iconColor}
          />
        );
      case 'FontAwesome5':
        return <FontAwesome5 name={item.iconName} size={24} color={item.iconColor} />;
      case 'Feather':
      default:
        return <Feather name={item.iconName} size={26} color={item.iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        onMenuPress={() => setDrawerVisible(true)}
        title="MCF CITIZEN"
        subtitle="Municipal Corporation Faridabad"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Weather & AQI */}
        <View style={styles.sectionBlock}>
          <WeatherAQIWidget />
        </View>

        {/* Promotional Banner */}
        <View style={styles.sectionBlock}>
          <View style={styles.bannerCard}>
            <View style={styles.bannerTopRow}>
              <View style={styles.bannerTag}>
                <Text style={styles.bannerTagText}>SWACHH FARIDABAD</Text>
              </View>
              <View style={styles.bannerWardPill}>
                <Feather name="map-pin" size={11} color="#94A3B8" />
                <Text style={styles.bannerWard}>{user.ward || 'Ward 14'}</Text>
              </View>
            </View>

            <Text style={styles.bannerTitle}>Keep Our City Clean & Green</Text>
            <Text style={styles.bannerSubtitle}>
              Report overflowing garbage, broken lights, or water issues instantly.
            </Text>

            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => router.push('/new-complaint' as any)}
              activeOpacity={0.8}
            >
              <Feather name="plus-circle" size={16} color="#F59019" />
              <Text style={styles.bannerBtnText}>Lodge Grievance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'hi' ? 'नागरिक सेवाएं' : 'Citizen Dashboard'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {language === 'hi' ? '9 मुख्य जन सुविधाएं' : 'Quick Access Services'}
          </Text>
        </View>

        {/* 3x3 Service Grid */}
        <View style={styles.sectionBlock}>
          <View style={styles.gridContainer}>
            {DASHBOARD_TILES.map((tile) => (
              <TouchableOpacity
                key={tile.id}
                style={styles.gridTile}
                onPress={() => router.push(tile.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: tile.bgColor }]}>
                  {renderIcon(tile)}
                </View>
                <Text style={styles.tileTitle} numberOfLines={2}>
                  {language === 'hi' ? tile.hindiTitle : tile.defaultTitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Hotline Strip */}
        <View style={styles.sectionBlock}>
          <View style={styles.emergencyStrip}>
            <View style={styles.stripIconWrap}>
              <Ionicons name="call" size={18} color="#F59019" />
            </View>

            <View style={styles.stripTextWrap}>
              <Text style={styles.stripTitle}>MCF Control Room 24x7</Text>
              <Text style={styles.stripPhone}>1800-180-2013 / 0129-2415549</Text>
            </View>

            <TouchableOpacity
              style={styles.callStripBtn}
              onPress={() => router.push('/helpline' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.callStripBtnText}>View All</Text>
              <Feather name="chevron-right" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/new-complaint' as any)}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Drawer */}
      <DrawerModal visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Shared horizontal rhythm wrapper — every section below the header
  // aligns to the same left/right margin and vertical spacing.
  sectionBlock: {
    paddingHorizontal: SCREEN_PADDING,
    marginTop: 14,
  },

  // ---------- Banner ----------
  bannerCard: {
    backgroundColor: '#1E293B',
    borderRadius: Radius.card,
    paddingVertical: 20,
    paddingHorizontal: 18,
    ...Shadow.md,
    overflow: 'hidden',
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bannerTag: {
    backgroundColor: '#F59019',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  bannerTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bannerWardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bannerWard: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 24,
  },
  bannerSubtitle: {
    fontSize: 12.5,
    color: '#CBD5E1',
    lineHeight: 19,
    marginBottom: 16,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    gap: 7,
  },
  bannerBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F59019',
  },

  // ---------- Section header ----------
  sectionHeader: {
    paddingHorizontal: SCREEN_PADDING,
    marginTop: 22,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  // ---------- Grid ----------
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: GRID_GAP,
    columnGap: GRID_GAP,
  },
  gridTile: {
    width: GRID_ITEM_WIDTH,
    minHeight: 122,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tileTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 16,
  },

  // ---------- Emergency strip ----------
  emergencyStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: '#FED7AA',
    ...Shadow.sm,
  },
  stripIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stripTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  stripTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  stripPhone: {
    fontSize: 11,
    color: '#F59019',
    fontWeight: '600',
  },
  callStripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59019',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 3,
    marginLeft: 10,
  },
  callStripBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  // ---------- FAB ----------
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F59019',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.lg,
    elevation: 8,
  },
});