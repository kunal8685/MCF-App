import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Feather, Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { Colors, Radius, Shadow } from '@/constants/theme';

interface SocialChannel {
  id: string;
  name: string;
  handle: string;
  description: string;
  iconName: any;
  iconFamily: 'Ionicons' | 'FontAwesome' | 'FontAwesome5' | 'Feather';
  iconColor: string;
  bgColor: string;
  url: string;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: '1',
    name: 'X (Formerly Twitter)',
    handle: '@MCF_Faridabad',
    description: 'Get real-time updates, traffic alerts, and commissioner announcements.',
    iconName: 'twitter',
    iconFamily: 'FontAwesome',
    iconColor: '#1DA1F2',
    bgColor: '#E0F2FE',
    url: 'https://twitter.com/MCF_Faridabad',
  },
  {
    id: '2',
    name: 'Facebook',
    handle: 'MCFaridabadOfficial',
    description: 'Live citizen council meetings, development project highlights, and press releases.',
    iconName: 'facebook',
    iconFamily: 'FontAwesome',
    iconColor: '#1877F2',
    bgColor: '#DBEAFE',
    url: 'https://facebook.com/MCFaridabadOfficial',
  },
  {
    id: '3',
    name: 'Instagram',
    handle: '@mcf_faridabad',
    description: 'Photo highlights of Swachh Faridabad, parks, lake restoration, and civic activities.',
    iconName: 'instagram',
    iconFamily: 'FontAwesome',
    iconColor: '#E1306C',
    bgColor: '#FCE7F3',
    url: 'https://instagram.com/mcf_faridabad',
  },
  {
    id: '4',
    name: 'YouTube',
    handle: 'Municipal Corporation Faridabad',
    description: 'Documentaries on Faridabad infrastructure, waste processing plants, and citizen guides.',
    iconName: 'youtube-play',
    iconFamily: 'FontAwesome',
    iconColor: '#FF0000',
    bgColor: '#FEE2E2',
    url: 'https://youtube.com',
  },
  {
    id: '5',
    name: 'WhatsApp Citizen Desk',
    handle: '+91 98188 99001',
    description: 'Chatbot assistance for bill enquiries, grievance status, and municipal forms.',
    iconName: 'whatsapp',
    iconFamily: 'FontAwesome',
    iconColor: '#25D366',
    bgColor: '#DCFCE7',
    url: 'https://wa.me/919818899001',
  },
  {
    id: '6',
    name: 'Official Citizen Web Portal',
    handle: 'www.mcfaridabad.org',
    description: 'Central portal for all online statutory municipal services and citizen interactions.',
    iconName: 'globe',
    iconFamily: 'Feather',
    iconColor: '#F59019',
    bgColor: '#FFF7ED',
    url: 'https://www.mcfaridabad.org',
  },
];

export default function ConnectMcfScreen() {
  const handleOpen = (url: string, name: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Cannot Open Link', `Opening ${name} in browser.`);
        Linking.openURL(url).catch(() => {});
      }
    });
  };

  const renderIcon = (channel: SocialChannel) => {
    switch (channel.iconFamily) {
      case 'FontAwesome':
        return <FontAwesome name={channel.iconName} size={24} color={channel.iconColor} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={channel.iconName} size={24} color={channel.iconColor} />;
      case 'Ionicons':
        return <Ionicons name={channel.iconName} size={24} color={channel.iconColor} />;
      default:
        return <Feather name={channel.iconName} size={24} color={channel.iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Connect With MCF" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard}>
          <Text style={styles.introHeading}>Stay Connected With Your City</Text>
          <Text style={styles.introText}>
            Follow official Municipal Corporation Faridabad channels for verified announcements, emergency alerts, cleanliness drives, and public hearings.
          </Text>
        </View>

        <View style={styles.channelsList}>
          {SOCIAL_CHANNELS.map((item) => (
            <CustomCard
              key={item.id}
              style={styles.card}
              onPress={() => handleOpen(item.url, item.name)}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconBg, { backgroundColor: item.bgColor }]}>
                  {renderIcon(item)}
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.channelName}>{item.name}</Text>
                  <Text style={styles.channelHandle}>{item.handle}</Text>
                  <Text style={styles.channelDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <View style={styles.arrowBg}>
                  <Feather name="arrow-up-right" size={18} color="#64748B" />
                </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 18,
    marginBottom: 16,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderLeftWidth: 4,
    borderLeftColor: '#F59019',
  },
  introHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  introText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },
  channelsList: {
    gap: 12,
  },
  card: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoCol: {
    flex: 1,
  },
  channelName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  channelHandle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59019',
    marginTop: 1,
  },
  channelDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  arrowBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
