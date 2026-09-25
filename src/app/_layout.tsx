import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ComplaintsProvider } from '@/context/ComplaintsContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LanguageProvider>
          <ComplaintsProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F7F7FB' },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(auth)/register" />
              <Stack.Screen name="(drawer)/home" />
              <Stack.Screen name="mcf-info" />
              <Stack.Screen name="connect-mcf" />
              <Stack.Screen name="complaints-redressal" />
              <Stack.Screen name="new-complaint" />
              <Stack.Screen name="my-complaints" />
              <Stack.Screen name="helpline" />
              <Stack.Screen name="what-near-me/index" />
              <Stack.Screen name="what-near-me/[category]" />
              <Stack.Screen name="pensioner-portal" />
              <Stack.Screen name="citizen-services" />
              <Stack.Screen name="water-sewage" />
              <Stack.Screen name="edirectory" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="faqs" />
              <Stack.Screen name="feedback" />
              <Stack.Screen name="notifications" />
            </Stack>
          </ComplaintsProvider>
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
