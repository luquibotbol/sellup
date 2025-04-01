import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';

export default function NavBar() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const handleProfilePress = () => {
    router.push('/profile');
  };
  
  const handleLogoPress = () => {
    router.push('/categories');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Pressable onPress={handleLogoPress}>
          <Text style={styles.logo}>Sellup</Text>
        </Pressable>
      </View>
      
      <Pressable onPress={handleProfilePress} style={styles.profileButton}>
        {user?.profileImage ? (
          <Image 
            source={{ uri: user.profileImage }} 
            style={styles.profileImage} 
          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  profileButton: {
    position: 'absolute',
    right: 16,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  profilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePlaceholderText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});