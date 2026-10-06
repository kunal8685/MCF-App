import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Radius, Shadow } from '@/constants/theme';

interface WeatherData {
  temp: number;
  condition: string;
  icon: keyof typeof Ionicons.glyphMap;
  locationName: string;
}

interface AqiData {
  aqi: number;
  pm25: number;
  status: string;
  color: string;
  bgColor: string;
}

const DEFAULT_WEATHER: WeatherData = {
  temp: 29,
  condition: 'Clear Sky',
  icon: 'sunny',
  locationName: 'Faridabad, HR',
};

const DEFAULT_AQI: AqiData = {
  aqi: 142,
  pm25: 45,
  status: 'Moderate',
  color: '#D97706',
  bgColor: '#FEF3C7',
};

function getWeatherDetails(code: number): { condition: string; icon: keyof typeof Ionicons.glyphMap } {
  if (code === 0) return { condition: 'Clear Sky', icon: 'sunny' };
  if (code === 1 || code === 2) return { condition: 'Partly Cloudy', icon: 'partly-sunny' };
  if (code === 3) return { condition: 'Overcast', icon: 'cloudy' };
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: 'cloud' };
  if (code >= 51 && code <= 67) return { condition: 'Rain', icon: 'rainy' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: 'snow' };
  if (code >= 80 && code <= 82) return { condition: 'Showers', icon: 'rainy' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: 'thunderstorm' };
  return { condition: 'Clear', icon: 'sunny' };
}

function getAqiDetails(aqi: number): { status: string; color: string; bgColor: string } {
  if (aqi <= 50) return { status: 'Good', color: '#16A34A', bgColor: '#DCFCE7' };
  if (aqi <= 100) return { status: 'Moderate', color: '#D97706', bgColor: '#FEF3C7' };
  if (aqi <= 150) return { status: 'Sensitive', color: '#EA580C', bgColor: '#FFEDD5' };
  if (aqi <= 200) return { status: 'Unhealthy', color: '#DC2626', bgColor: '#FEE2E2' };
  if (aqi <= 300) return { status: 'Very Poor', color: '#9333EA', bgColor: '#F3E8FF' };
  return { status: 'Hazardous', color: '#7F1D1D', bgColor: '#FFE4E6' };
}

export const WeatherAQIWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [aqi, setAqi] = useState<AqiData>(DEFAULT_AQI);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveWeatherAndAQI() {
      let lat = 28.4089;
      let lon = 77.3178;
      let locName = 'Faridabad, HR';

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          lat = loc.coords.latitude;
          lon = loc.coords.longitude;

          try {
            const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
            if (geo && geo.length > 0) {
              const g = geo[0];
              const city = g.city || g.subregion || g.district || 'Faridabad';
              const state = g.region ? (g.region.length > 2 ? g.region.substring(0, 2).toUpperCase() : g.region) : 'HR';
              locName = `${city}, ${state}`;
            }
          } catch {
            // keep default name on reverse geocode error
          }
        }
      } catch (e) {
        console.warn('Weather location detection fallback:', e);
      }

      try {
        const [weatherRes, aqiRes] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
          ),
          fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`
          ),
        ]);

        if (weatherRes.ok) {
          const weatherJson = await weatherRes.json();
          if (weatherJson?.current && isMounted) {
            const tempVal = Math.round(weatherJson.current.temperature_2m);
            const wDetails = getWeatherDetails(weatherJson.current.weather_code);
            setWeather({
              temp: tempVal,
              condition: wDetails.condition,
              icon: wDetails.icon,
              locationName: locName,
            });
          }
        }

        if (aqiRes.ok) {
          const aqiJson = await aqiRes.json();
          if (aqiJson?.current && isMounted) {
            const aqiVal = Math.round(aqiJson.current.us_aqi ?? 100);
            const pm25Val = Math.round(aqiJson.current.pm2_5 ?? 35);
            const aDetails = getAqiDetails(aqiVal);
            setAqi({
              aqi: aqiVal,
              pm25: pm25Val,
              status: aDetails.status,
              color: aDetails.color,
              bgColor: aDetails.bgColor,
            });
          }
        }
      } catch (err) {
        console.warn('Weather & AQI fetch notice:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLiveWeatherAndAQI();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Weather Card */}
      <View style={[styles.subCard, styles.weatherCard]}>
        <View style={styles.topRow}>
          <View>
            <View style={styles.tempRow}>
              <Text style={styles.tempText}>{weather.temp}°C</Text>
              {loading && <ActivityIndicator size="small" color="#F59019" style={styles.loader} />}
            </View>
            <Text style={styles.conditionText} numberOfLines={1}>
              {weather.condition}
            </Text>
          </View>
          <View style={styles.weatherIconBg}>
            <Ionicons name={weather.icon} size={24} color="#F59019" />
          </View>
        </View>
        <View style={styles.bottomRow}>
          <Feather name="map-pin" size={12} color="#64748B" />
          <Text style={styles.locationText} numberOfLines={1}>
            {weather.locationName}
          </Text>
        </View>
      </View>

      {/* AQI Card */}
      <View style={[styles.subCard, styles.aqiCard, { borderLeftColor: aqi.color }]}>
        <View style={styles.topRow}>
          <View>
            <View style={styles.aqiBadgeRow}>
              <Text style={[styles.aqiLabel, { color: aqi.color }]}>AQI</Text>
              <Text style={styles.aqiValue}>{aqi.aqi}</Text>
            </View>
            <Text style={[styles.aqiStatus, { color: aqi.color }]}>{aqi.status}</Text>
          </View>
          <View style={[styles.aqiIndicator, { backgroundColor: aqi.bgColor }]}>
            <Feather name="wind" size={22} color={aqi.color} />
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View style={[styles.dot, { backgroundColor: aqi.color }]} />
          <Text style={styles.aqiSubText} numberOfLines={1}>
            PM2.5 {aqi.pm25} µg/m³
          </Text>
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
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tempText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  loader: {
    transform: [{ scale: 0.75 }],
  },
  conditionText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
    maxWidth: 100,
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
    maxWidth: 110,
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
    maxWidth: 120,
  },
});
