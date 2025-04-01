import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import Colors from '@/constants/colors';

interface SocialButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  style?: object;
}

export default function SocialButton({
  title,
  icon,
  onPress,
  style,
}: SocialButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    marginRight: 12,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
  },
});