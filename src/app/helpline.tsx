import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { HELPLINE_DATA, HelplineItem } from '@/data/helplineData';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function HelplineScreen() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'MCF', 'Emergency', 'Safety', 'Utility'];

  const handleCall = (number: string, title: string) => {
    const url = `tel:${number.replace(/[^0-9]/g, '')}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Phone Call', `Dialing ${number} for ${title}`);
      }
    });
  };

  const filteredHotlines = HELPLINE_DATA.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'headset':
        return <Feather name="headphones" size={24} color="#F59019" />;
      case 'shield-alert':
        return <Feather name="shield" size={24} color="#3B82F6" />;
      case 'flame':
        return <Ionicons name="flame" size={24} color="#EF4444" />;
      case 'ambulance':
        return <MaterialCommunityIcons name="ambulance" size={24} color="#DC2626" />;
      case 'heart-handshake':
        return <MaterialCommunityIcons name="hand-heart" size={24} color="#EC4899" />;
      case 'baby':
        return <MaterialCommunityIcons name="baby-carriage" size={24} color="#8B5CF6" />;
      case 'alert-triangle':
        return <Feather name="alert-triangle" size={24} color="#F59E0B" />;
      case 'zap':
        return <Feather name="zap" size={24} color="#F59019" />;
      case 'users':
        return <Feather name="users" size={24} color="#059669" />;
      default:
        return <Feather name="phone" size={24} color="#F59019" />;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Helpline 24*7" showBack />

      {/* Filter Categories */}
      <View style={styles.categoryRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.noticeBanner}>
          <Feather name="info" size={18} color="#F59019" />
          <Text style={styles.noticeText}>
            Direct toll-free and rapid response numbers for Faridabad municipal services and emergency assistance.
          </Text>
        </View>

        <View style={styles.hotlinesList}>
          {filteredHotlines.map((item) => (
            <CustomCard key={item.id} style={styles.hotlineCard}>
              <View style={styles.topRow}>
                <View style={styles.iconCircle}>
                  {renderIcon(item.icon)}
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.hotlineTitle}>
                    {language === 'hi' ? item.hindiTitle : item.title}
                  </Text>
                  <View style={styles.hoursBadge}>
                    <Text style={styles.hoursText}>⏰ {item.hours}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.descriptionText}>{item.description}</Text>

              <View style={styles.phoneAndCallRow}>
                <View>
                  <Text style={styles.phoneLabel}>Helpline Number</Text>
                  <Text style={styles.phoneNumber}>{item.number}</Text>
                  {item.altNumber && (
                    <Text style={styles.altPhone}>Alt: {item.altNumber}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(item.number, item.title)}
                  activeOpacity={0.8}
                >
                  <Feather name="phone-call" size={16} color="#FFFFFF" />
                  <Text style={styles.callButtonText}>CALL NOW</Text>
                </TouchableOpacity>
              </View>
            </CustomCard>
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
  categoryRow: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  categoryChipActive: {
    backgroundColor: '#F59019',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    borderRadius: Radius.card,
    gap: 10,
    marginBottom: 14,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#9A3412',
    lineHeight: 17,
  },
  hotlinesList: {
    gap: 12,
  },
  hotlineCard: {
    padding: 16,
  },
  topRow: {
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
  infoCol: {
    flex: 1,
  },
  hotlineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  hoursBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  hoursText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  descriptionText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  phoneAndCallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  phoneLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  altPhone: {
    fontSize: 11,
    color: '#64748B',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.button,
    gap: 6,
    ...Shadow.sm,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
