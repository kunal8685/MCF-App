import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

export default function IndexScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user && user.isLoggedIn) {
          router.replace('/(drawer)/home' as any);
        } else {
          router.replace('/(auth)/login' as any);
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      <View style={styles.centerCard}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>नगर निगम फरीदाबाद</Text>
        <Text style={styles.subTitle}>MUNICIPAL CORPORATION FARIDABAD</Text>
        <Text style={styles.tagline}>CITIZEN SERVICES PORTAL</Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#F59019" />
          <Text style={styles.loadingText}>Initializing Services...</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Government of Haryana</Text>
        <Text style={styles.footerSubText}>Smart City Faridabad Initiative</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  centerCard: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#FED7AA',
    elevation: 4,
    shadowColor: '#F59019',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logo: {
    width: 110,
    height: 110,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F59019',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 2,
    marginTop: 6,
    textAlign: 'center',
  },
  loaderContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  footerSubText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
