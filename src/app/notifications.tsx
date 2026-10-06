import { CustomCard } from '@/components/common/CustomCard';
import { Header } from '@/components/common/Header';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'complaint' | 'alert' | 'service';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // {
  //   id: 'n-1',
  //   title: 'Complaint Dispatched to Field Team',
  //   message: 'Ticket MCF-2026-8941 (Garbage Collection) assigned to Ward 14 Sanitation unit. Vehicle on route.',
  //   time: '2 hours ago',
  //   type: 'complaint',
  //   read: false,
  // },
  // {
  //   id: 'n-2',
  //   title: 'Property Tax 10% Early Bird Rebate',
  //   message: 'Avail 10% rebate by paying property tax online before 31st October via Citizen Services portal.',
  //   time: 'Yesterday, 04:30 PM',
  //   type: 'service',
  //   read: false,
  // },
  // {
  //   id: 'n-3',
  //   title: 'Water Works Maintenance Scheduled',
  //   message: 'Booster pump maintenance in Sector 15 & 16 tomorrow morning from 10:00 AM to 1:00 PM. Storage advised.',
  //   time: '23 Sep 2026',
  //   type: 'alert',
  //   read: true,
  // },
  // {
  //   id: 'n-4',
  //   title: 'Street Light Fault Resolved',
  //   message: 'Ticket MCF-2026-8420 has been inspected and resolved. LED driver replaced by lineman team.',
  //   time: '21 Sep 2026',
  //   type: 'complaint',
  //   read: true,
  // },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Remove all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setNotifications([]) },
    ]);
  };

  const renderIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'complaint':
        return <Feather name="file-text" size={20} color="#F59019" />;
      case 'alert':
        return <Ionicons name="warning" size={20} color="#EF4444" />;
      case 'service':
      default:
        return <Ionicons name="sparkles" size={20} color="#3B82F6" />;
    }
  };

  const getBgColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'complaint':
        return '#FFF7ED';
      case 'alert':
        return '#FEF2F2';
      case 'service':
      default:
        return '#EFF6FF';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        showBack
        rightAction={
          notifications.length > 0 ? (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text style={styles.markReadText}>Read All</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CustomCard
            style={[
              styles.card,
              !item.read && styles.unreadCard,
            ]}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconCircle, { backgroundColor: getBgColor(item.type) }]}>
                {renderIcon(item.type)}
              </View>
              <View style={styles.contentCol}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, !item.read && styles.unreadTitle]}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={styles.dot} />}
                </View>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          </CustomCard>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>
              You are all caught up with your grievance updates and city notices.
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
  markReadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  card: {
    padding: 14,
  },
  unreadCard: {
    borderColor: '#FED7AA',
    borderLeftWidth: 3.5,
    borderLeftColor: '#F59019',
    backgroundColor: '#FFFFFF',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#1E293B',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59019',
    marginLeft: 6,
  },
  message: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  time: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});
