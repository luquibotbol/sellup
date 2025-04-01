import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Lock, Moon, Shield, HelpCircle, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import Button from '@/components/Button';

export default function SettingsScreen() {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState({
    newMessages: true,
    newListings: true,
    transactionUpdates: true,
    marketingEmails: false,
  });
  
  const [darkMode, setDarkMode] = useState(true);
  
  const toggleSetting = (setting: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };
  
  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        alert('Account deletion request submitted. You will receive a confirmation email.');
      }
    } else {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              Alert.alert('Account deletion request submitted. You will receive a confirmation email.');
            },
            style: 'destructive',
          },
        ]
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>New Messages</Text>
            <Switch
              value={notifications.newMessages}
              onValueChange={() => toggleSetting('newMessages')}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.text}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>New Listings</Text>
            <Switch
              value={notifications.newListings}
              onValueChange={() => toggleSetting('newListings')}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.text}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Transaction Updates</Text>
            <Switch
              value={notifications.transactionUpdates}
              onValueChange={() => toggleSetting('transactionUpdates')}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.text}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Marketing Emails</Text>
            <Switch
              value={notifications.marketingEmails}
              onValueChange={() => toggleSetting('marketingEmails')}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.text}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Moon size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.text}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>
          
          <View style={styles.settingButton}>
            <Text style={styles.settingLabel}>Change Password</Text>
          </View>
          
          <View style={styles.settingButton}>
            <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Privacy</Text>
          </View>
          
          <View style={styles.settingButton}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          
          <View style={styles.settingButton}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          
          <View style={styles.settingButton}>
            <Text style={styles.settingLabel}>Help Center</Text>
          </View>
          
          <View style={styles.settingButton}>
            <Text style={styles.settingLabel}>Contact Support</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          
          <View style={styles.settingButton}>
            <Text style={styles.settingLabel}>Version 1.0.0</Text>
          </View>
        </View>
        
        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          variant="outline"
          style={styles.deleteButton}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    color: Colors.text,
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 8,
    marginBottom: 32,
    backgroundColor: 'rgba(255, 96, 96, 0.1)',
    borderColor: Colors.error,
  },
});