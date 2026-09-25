import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function McfInfoScreen() {
  const [activeTab, setActiveTab] = useState<'about' | 'website' | 'news'>('about');

  const openWebsite = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Header title="MCF Info" showBack />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'about' && styles.activeTabItem]}
          onPress={() => setActiveTab('about')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'about' && styles.activeTabText,
            ]}
          >
            About MCF
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'website' && styles.activeTabItem]}
          onPress={() => setActiveTab('website')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'website' && styles.activeTabText,
            ]}
          >
            Official Website
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'news' && styles.activeTabItem]}
          onPress={() => setActiveTab('news')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'news' && styles.activeTabText,
            ]}
          >
            What's New
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            <View style={styles.heroCard}>
              <Image
                source={require('@/../assets/images/logo.png')}
                style={styles.heroLogo}
                resizeMode="contain"
              />
              <Text style={styles.heroTitle}>Municipal Corporation Faridabad</Text>
              <Text style={styles.heroSubtitle}>
                Serving over 1.8 Million Citizens across 40 Wards & 3 Zones
              </Text>
            </View>

            <CustomCard style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="business" size={22} color="#F59019" />
                <Text style={styles.cardHeaderTitle}>Our Mission & Vision</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                Municipal Corporation Faridabad (MCF) is committed to transforming Faridabad into a clean, green, sustainable, and smart industrial metropolis. We manage urban planning, sanitation, solid waste management, drinking water distribution, street lighting, public health, and infrastructure development.
              </Text>
            </CustomCard>

            <CustomCard style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="map" size={22} color="#F59019" />
                <Text style={styles.cardHeaderTitle}>Administrative Zones</Text>
              </View>
              <View style={styles.zoneItem}>
                <Text style={styles.zoneName}>1. NIT Zone (New Industrial Town)</Text>
                <Text style={styles.zoneDesc}>Wards 1 to 14 • BK Chowk Zonal Office</Text>
              </View>
              <View style={styles.zoneDivider} />
              <View style={styles.zoneItem}>
                <Text style={styles.zoneName}>2. Old Faridabad Zone</Text>
                <Text style={styles.zoneDesc}>Wards 15 to 27 • Old Faridabad Zonal Office</Text>
              </View>
              <View style={styles.zoneDivider} />
              <View style={styles.zoneItem}>
                <Text style={styles.zoneName}>3. Ballabgarh Zone</Text>
                <Text style={styles.zoneDesc}>Wards 28 to 40 • Ballabgarh Zonal Office</Text>
              </View>
            </CustomCard>

            <CustomCard style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="location" size={22} color="#F59019" />
                <Text style={styles.cardHeaderTitle}>Headquarters Contact</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                MCF Headquarters, Near BK Chowk, NIT Faridabad, Haryana - 121001
              </Text>
              <Text style={[styles.bodyParagraph, { marginTop: 6, color: '#F59019', fontWeight: '600' }]}>
                Phone: 0129-2415549 • Email: commissioner@mcfaridabad.org
              </Text>
            </CustomCard>
          </View>
        )}

        {activeTab === 'website' && (
          <View style={styles.tabContent}>
            <CustomCard style={styles.webCard}>
              <View style={styles.webIconBg}>
                <Feather name="globe" size={32} color="#F59019" />
              </View>
              <Text style={styles.webCardTitle}>MCF Official Portal</Text>
              <Text style={styles.webCardDesc}>
                Access comprehensive municipal citizen services, property tax payments, e-tenders, town planning notices, and RTI records.
              </Text>
              <TouchableOpacity
                style={styles.openWebBtn}
                onPress={() => openWebsite('https://www.mcfaridabad.org')}
                activeOpacity={0.8}
              >
                <Text style={styles.openWebBtnText}>Visit www.mcfaridabad.org</Text>
                <Feather name="external-link" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </CustomCard>

            <CustomCard style={styles.infoCard}>
              <Text style={styles.quickLinksTitle}>Useful Quick Links</Text>
              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => openWebsite('https://ulbharyana.gov.in')}
              >
                <Feather name="chevron-right" size={18} color="#F59019" />
                <Text style={styles.linkRowText}>Directorate of Urban Local Bodies, Haryana</Text>
              </TouchableOpacity>
              <View style={styles.zoneDivider} />
              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => openWebsite('https://saralharyana.gov.in')}
              >
                <Feather name="chevron-right" size={18} color="#F59019" />
                <Text style={styles.linkRowText}>Antyodaya SARAL Haryana Portal</Text>
              </TouchableOpacity>
              <View style={styles.zoneDivider} />
              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => openWebsite('https://swachhbharatmission.gov.in')}
              >
                <Feather name="chevron-right" size={18} color="#F59019" />
                <Text style={styles.linkRowText}>Swachh Bharat Urban Portal</Text>
              </TouchableOpacity>
            </CustomCard>
          </View>
        )}

        {activeTab === 'news' && (
          <View style={styles.tabContent}>
            <CustomCard style={styles.newsCard}>
              <View style={styles.newsBadgeRow}>
                <View style={[styles.newsTag, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.newsTagText, { color: '#059669' }]}>NOTICE</Text>
                </View>
                <Text style={styles.newsDate}>25 Sep 2026</Text>
              </View>
              <Text style={styles.newsTitle}>
                Property Tax Rebate 10% Extension Announced
              </Text>
              <Text style={styles.newsSnippet}>
                MCF Faridabad announces 10% rebate for online advance property tax payments made for Financial Year 2026-27. Pay through Citizen Services before 31st Oct.
              </Text>
            </CustomCard>

            <CustomCard style={styles.newsCard}>
              <View style={styles.newsBadgeRow}>
                <View style={[styles.newsTag, { backgroundColor: '#EFF6FF' }]}>
                  <Text style={[styles.newsTagText, { color: '#2563EB' }]}>CAMPAIGN</Text>
                </View>
                <Text style={styles.newsDate}>22 Sep 2026</Text>
              </View>
              <Text style={styles.newsTitle}>
                Mega Desilting & Sewer Cleaning Drive Across NIT & Ballabgarh
              </Text>
              <Text style={styles.newsSnippet}>
                Municipal engineering teams deploy super-sucker machines to desilt trunk sewer lines in Sectors 11, 15, and 21 to prevent monsoon water-logging.
              </Text>
            </CustomCard>

            <CustomCard style={styles.newsCard}>
              <View style={styles.newsBadgeRow}>
                <View style={[styles.newsTag, { backgroundColor: '#FFFBEB' }]}>
                  <Text style={[styles.newsTagText, { color: '#D97706' }]}>SWACHHTA</Text>
                </View>
                <Text style={styles.newsDate}>18 Sep 2026</Text>
              </View>
              <Text style={styles.newsTitle}>
                Door-to-Door Segregated Garbage Collection Awareness
              </Text>
              <Text style={styles.newsSnippet}>
                Citizens are requested to segregate Wet (Green Bin) and Dry (Blue Bin) waste. Strict zero tolerance on single-use plastics under MCF bylaws.
              </Text>
            </CustomCard>
          </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#F59019',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#F59019',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 14,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 20,
    alignItems: 'center',
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  heroLogo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  infoCard: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  bodyParagraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  zoneItem: {
    paddingVertical: 6,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  zoneDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  zoneDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  webCard: {
    alignItems: 'center',
    padding: 24,
  },
  webIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  webCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  webCardDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 10,
  },
  openWebBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59019',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radius.button,
    gap: 8,
    marginTop: 8,
  },
  openWebBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickLinksTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  linkRowText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  newsCard: {
    padding: 16,
  },
  newsBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newsTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  newsDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  newsSnippet: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
});
