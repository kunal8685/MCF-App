import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Radius, Shadow } from '@/constants/theme';

interface CustomCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  activeOpacity?: number;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  children,
  style,
  onPress,
  activeOpacity = 0.7,
}) => {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={[styles.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.card,
    padding: 16,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});
