import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface FloatingButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  label?: string;
  style?: object;
}

export default function FloatingButton({ 
  onPress, 
  icon, 
  label, 
  style 
}: FloatingButtonProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        label ? styles.withLabel : styles.circular,
        style,
      ]} 
      onPress={onPress}
    >
      {icon || <Plus size={24} color={Colors.background} />}
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  circular: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  withLabel: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});