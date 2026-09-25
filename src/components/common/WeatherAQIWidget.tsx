import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Radius, Shadow } from '@/constants/theme';

export const WeatherAQIWidget: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Weather Card */}
      <View style={[styles.subCard, styles.weatherCard]}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.tempText}>29°C</Text>
            <Text style={styles.conditionText}>Clouds</Text>
          </View>
          <View style={styles.weatherIconBg}>
            <Ionicons name="cloudy" size={26} color="#F59019" />
          </View>
        </View>
        <View style={styles.bottomRow}>
          <Feather name="map-pin" size={12} color="#64748B" />
          <Text style={styles.locationText}>Faridabad, HR</Text>
        </View>
      </View>

      {/* AQI Card */}
      <View style={[styles.subCard, styles.aqiCard]}>
        <View style={styles.topRow}>
          <View>
            <View style={styles.aqiBadgeRow}>
              <Text style={styles.aqiLabel}>AQI</Text>
              <Text style={styles.aqiValue}>142</Text>
            </View>
            <Text style={styles.aqiStatus}>Moderate</Text>
          </View>
          <View style={[styles.aqiIndicator, { backgroundColor: '#FEF3C7' }]}>
            <Feather name="wind" size={24} color="#D97706" />
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.dot} />
          <Text style={styles.aqiSubText}>PM2.5 • Good Air Care</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  subCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 14,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  weatherCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59019',
  },
  aqiCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tempText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  conditionText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  weatherIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  aqiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  aqiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  aqiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  aqiStatus: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
    marginTop: 2,
  },
  aqiIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  aqiSubText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
