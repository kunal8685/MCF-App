import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GOVT_CONFIG } from '@/constants/config';

interface GovernmentHeaderBadgeProps {
  showSubtitle?: boolean;
}

export const GovernmentHeaderBadge: React.FC<GovernmentHeaderBadgeProps> = ({
  showSubtitle = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <View style={styles.flagStripeContainer}>
          <View style={[styles.flagStripe, { backgroundColor: '#FF9933' }]} />
          <View style={[styles.flagStripe, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.flagStripe, { backgroundColor: '#138808' }]} />
        </View>
        <Text style={styles.govtText}>{GOVT_CONFIG.STATE_GOVT}</Text>
      </View>
      {showSubtitle && (
        <Text style={styles.deptText}>
          {GOVT_CONFIG.DEPARTMENT}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
    gap: 6,
  },
  flagStripeContainer: {
    width: 14,
    height: 9,
    borderRadius: 1.5,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
  },
  flagStripe: {
    flex: 1,
  },
  govtText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.5,
  },
  deptText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});
