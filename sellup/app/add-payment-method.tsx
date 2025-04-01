import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [makeDefault, setMakeDefault] = useState(true);
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    };
    
    let isValid = true;
    
    // Card number validation (16 digits, spaces allowed)
    const cardNumberClean = cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Card number is required';
      isValid = false;
    } else if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      isValid = false;
    }
    
    // Card name validation
    if (!cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
      isValid = false;
    }
    
    // Expiry date validation (MM/YY format)
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
      isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
      isValid = false;
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
        isValid = false;
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
        isValid = false;
      }
    }
    
    // CVV validation (3 or 4 digits)
    if (!cvv) {
      newErrors.cvv = 'CVV is required';
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleAddCard = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (Platform.OS === 'web') {
        alert('Payment method added successfully!');
      } else {
        Alert.alert('Success', 'Your payment method has been added successfully!');
      }
      
      router.back();
    } catch (error: any) {
      if (Platform.OS === 'web') {
        alert(`Failed to add payment method: ${error.message}`);
      } else {
        Alert.alert('Error', `Failed to add payment method: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = [];
    
    for (let i = 0; i < cleaned.length; i += 4) {
      chunks.push(cleaned.substring(i, i + 4));
    }
    
    return chunks.join(' ');
  };
  
  const handleCardNumberChange = (text: string) => {
    // Remove non-digit characters
    const digitsOnly = text.replace(/\D/g, '');
    
    // Limit to 16 digits
    const truncated = digitsOnly.substring(0, 16);
    
    // Format with spaces
    setCardNumber(formatCardNumber(truncated));
  };
  
  const handleExpiryDateChange = (text: string) => {
    // Remove non-digit and non-slash characters
    const cleaned = text.replace(/[^\d\/]/g, '');
    
    // Format as MM/YY
    if (cleaned.length <= 2) {
      setExpiryDate(cleaned);
    } else if (cleaned.length === 3) {
      if (cleaned.includes('/')) {
        setExpiryDate(cleaned);
      } else {
        setExpiryDate(`${cleaned.substring(0, 2)}/${cleaned.substring(2)}`);
      }
    } else {
      const parts = cleaned.split('/');
      if (parts.length === 1) {
        setExpiryDate(`${parts[0].substring(0, 2)}/${parts[0].substring(2, 4)}`);
      } else {
        setExpiryDate(`${parts[0].substring(0, 2)}/${parts[1].substring(0, 2)}`);
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add Payment Method</Text>
        
        <View style={styles.cardPreview}>
          <View style={styles.cardHeader}>
            <CreditCard size={24} color={Colors.text} />
            <Text style={styles.cardType}>Credit/Debit Card</Text>
          </View>
          
          <View style={styles.cardNumberPreview}>
            <Text style={styles.cardNumberText}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>
          </View>
          
          <View style={styles.cardDetails}>
            <View style={styles.cardDetailItem}>
              <Text style={styles.cardDetailLabel}>Name</Text>
              <Text style={styles.cardDetailValue}>
                {cardName || 'Your Name'}
              </Text>
            </View>
            
            <View style={styles.cardDetailItem}>
              <Text style={styles.cardDetailLabel}>Expires</Text>
              <Text style={styles.cardDetailValue}>
                {expiryDate || 'MM/YY'}
              </Text>
            </View>
          </View>
        </View>
        
        <InputField
          label="Card Number"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          error={errors.cardNumber}
        />
        
        <InputField
          label="Name on Card"
          value={cardName}
          onChangeText={setCardName}
          placeholder="John Doe"
          error={errors.cardName}
        />
        
        <View style={styles.row}>
          <View style={styles.halfField}>
            <InputField
              label="Expiry Date"
              value={expiryDate}
              onChangeText={handleExpiryDateChange}
              placeholder="MM/YY"
              keyboardType="numeric"
              error={errors.expiryDate}
            />
          </View>
          
          <View style={styles.halfField}>
            <InputField
              label="CVV"
              value={cvv}
              onChangeText={setCvv}
              placeholder="123"
              keyboardType="numeric"
              error={errors.cvv}
            />
          </View>
        </View>
        
        <Button
          title="Add Card"
          onPress={handleAddCard}
          isLoading={isLoading}
          style={styles.addButton}
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
  cardPreview: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardType: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardNumberPreview: {
    marginBottom: 16,
  },
  cardNumberText: {
    color: Colors.text,
    fontSize: 20,
    letterSpacing: 2,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetailItem: {},
  cardDetailLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  cardDetailValue: {
    color: Colors.text,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  addButton: {
    marginTop: 24,
  },
});