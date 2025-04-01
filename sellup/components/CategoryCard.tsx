import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  route: string;
}

export default function CategoryCard({ id, name, image, route }: CategoryCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(route);
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]} 
      onPress={handlePress}
    >
      <Image 
        source={{ uri: image }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      <View style={styles.overlay} />
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: Colors.card,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  name: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});