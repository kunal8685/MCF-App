import { Linking, Alert } from 'react-native';

export const callPhoneNumber = async (phoneNumber: string, contactTitle?: string) => {
  const sanitized = phoneNumber.replace(/[^0-9]/g, '');
  const url = `tel:${sanitized}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Phone Call', `Dialing ${phoneNumber}${contactTitle ? ` (${contactTitle})` : ''}`);
    }
  } catch (error) {
    Alert.alert('Phone Call', `Dialing ${phoneNumber}`);
  }
};

export const openNavigationMap = async (latitude: number, longitude: number, label?: string) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Map Navigation', `Navigating to ${label || 'location'}: ${latitude}, ${longitude}`);
  }
};

export const openExternalUrl = async (url: string, title?: string) => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('External Link', `Opening ${title || url} in browser.`);
  }
};
