import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, User, Settings, Heart, ShoppingBag, Clock } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import Button from '@/components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  
  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to sign out?')) {
        signOut();
        router.replace('/');
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Out',
            onPress: () => {
              signOut();
              router.replace('/');
            },
          },
        ]
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          {user?.profileImage ? (
            <Image 
              source={{ uri: user.profileImage }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <User size={40} color={Colors.background} />
            </View>
          )}
          
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.menuItem}>
            <User size={20} color={Colors.accent} />
            <Text style={styles.menuItemText}>Personal Information</Text>
          </View>
          
          <View style={styles.menuItem}>
            <Settings size={20} color={Colors.accent} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          
          <View style={styles.menuItem}>
            <ShoppingBag size={20} color={Colors.accent} />
            <Text style={styles.menuItemText}>My Buy Listings</Text>
          </View>
          
          <View style={styles.menuItem}>
            <Heart size={20} color={Colors.accent} />
            <Text style={styles.menuItemText}>My Sell Listings</Text>
          </View>
          
          <View style={styles.menuItem}>
            <Clock size={20} color={Colors.accent} />
            <Text style={styles.menuItemText}>History</Text>
          </View>
        </View>
        
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemText: {
    color: Colors.text,
    fontSize: 16,
    marginLeft: 12,
  },
  signOutButton: {
    marginTop: 24,
  },
});