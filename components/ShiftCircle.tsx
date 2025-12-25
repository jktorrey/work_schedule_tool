import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const ShiftCircle = ({ shift, colors, large }: { shift: string; colors: string[]; large?: boolean }) => (
  <LinearGradient colors={colors} style={large ? localStyles.circleLarge : localStyles.circle}>
    <Text style={large ? localStyles.circleTextLarge : localStyles.circleText}>{shift}</Text>
  </LinearGradient>
);

const localStyles = StyleSheet.create({
  circle: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center' },
  circleLarge: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  circleText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  circleTextLarge: { color: '#FFF', fontSize: 24, fontWeight: '700' },
});

