import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { ComplaintStatus } from '@/data/complaintsData';

interface BadgeProps {
  status: ComplaintStatus | string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'active':
        return {
          bg: '#ECFDF5',
          text: '#059669',
          border: '#A7F3D0',
        };
      case 'in progress':
      case 'assigned':
        return {
          bg: '#EFF6FF',
          text: '#2563EB',
          border: '#BFDBFE',
        };
      case 'pending':
        return {
          bg: '#FFFBEB',
          text: '#D97706',
          border: '#FDE68A',
        };
      case 'rejected':
      case 'closed':
        return {
          bg: '#FEF2F2',
          text: '#DC2626',
          border: '#FECACA',
        };
      default:
        return {
          bg: '#F1F5F9',
          text: '#475569',
          border: '#CBD5E1',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Text style={[styles.text, { color: style.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
