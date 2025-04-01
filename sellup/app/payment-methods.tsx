import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import Button from '@/components/Button';
import FloatingButton from '@/components/FloatingButton';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'venmo' | 'cashapp';
  name: string;
  isDefault: boolean;
  details: string;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      isDefault: true,
      details: 'Expires 12/25',
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      isDefault: false,
      details: user?.email || 'user@example.com',
    },
    {
      id: '3',
      type: 'venmo',
      name: 'Venmo',
      isDefault: false,
      details: '@alexjohnson',
    },
  ]);
  
  const handleAddPaymentMethod = () => {
    router.push('/add-payment-method');
  };
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };
  
  const handleDeletePaymentMethod = (id: string) => {
    const methodToDelete = paymentMethods.find(method => method.id === id);
    
    if (methodToDelete?.isDefault) {
      if (Platform.OS === 'web') {
        alert('You cannot delete your default payment method. Please set another method as default first.');
      } else {
        Alert.alert(
          'Cannot Delete',
          'You cannot delete your default payment method. Please set another method as default first.'
        );
      }
      return;
    }
    
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this payment method?')) {
        setPaymentMethods(methods => methods.filter(method => method.id !== id));
      }
    } else {
      Alert.alert(
        'Delete Payment Method',
        'Are you sure you want to delete this payment method?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              setPaymentMethods(methods => methods.filter(method => method.id !== id));
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
        <Text style={styles.title}>Payment Methods</Text>
        
        {paymentMethods.map(method => (
          <View key={method.id} style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodHeader}>
              <CreditCard size={24} color={Colors.accent} />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                <Text style={styles.paymentMethodDetails}>{method.details}</Text>
              </View>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
            </View>
            
            <View style={styles.paymentMethodActions}>
              {!method.isDefault && (
                <Pressable 
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.actionButtonPressed,
                  ]}
                  onPress={() => handleSetDefault(method.id)}
                >
                  <CheckCircle size={16} color={Colors.accent} />
                  <Text style={styles.actionButtonText}>Set as Default</Text>
                </Pressable>
              )}
              
              <Pressable 
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.deleteButton,
                  pressed && styles.actionButtonPressed,
                ]}
                onPress={() => handleDeletePaymentMethod(method.id)}
              >
                <Trash2 size={16} color={Colors.error} />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
        
        {paymentMethods.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payment methods added yet</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.floatingButtonContainer}>
        <FloatingButton 
          onPress={handleAddPaymentMethod}
          icon={<Plus size={24} color={Colors.background} />}
        />
      </View>
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
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  paymentMethodCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethodDetails: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  defaultBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentMethodActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: Colors.text,
    fontSize: 14,
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 96, 96, 0.1)',
  },
  deleteButtonText: {
    color: Colors.error,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});