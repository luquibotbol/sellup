import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Switch, Text, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { categories } from '@/constants/mockData';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

export default function CreateEventScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: 'buy' | 'sell' }>();
  const { user } = useAuthStore();
  const { addEvent, isLoading, error } = useEventStore();
  
  const [type, setType] = useState<'buy' | 'sell'>(params.type || 'sell');
  const [name, setName] = useState('');
  const [date, setDate] = useState('2023-07-15'); // Pre-filled for demo, YYYY-MM-DD format
  const [time, setTime] = useState('20:00'); // Pre-filled for demo, HH:MM format
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Parties');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const [errors, setErrors] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    price: '',
  });
  
  useEffect(() => {
    if (params.type) {
      setType(params.type);
    }
  }, [params.type]);
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      date: '',
      time: '',
      location: '',
      description: '',
      price: '',
    };
    
    let isValid = true;
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!date.trim()) {
      newErrors.date = 'Date is required';
      isValid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      newErrors.date = 'Date format should be YYYY-MM-DD';
      isValid = false;
    }
    
    // Time is optional, but if provided, validate format
    if (time && !/^\d{2}:\d{2}$/.test(time)) {
      newErrors.time = 'Time format should be HH:MM';
      isValid = false;
    }
    
    if (!location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (!price.trim()) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // Combine date and time for the API
      // If time is not provided, use 00:00 as default
      const dateTimeString = `${date}T${time || '00:00'}:00`;
      
      await addEvent({
        name,
        category,
        date: dateTimeString,
        location,
        description,
        price: parseFloat(price),
        image,
        additionalInfo,
        seller: {
          id: user?.id || 'unknown',
          name: user?.name || 'Anonymous',
          contact: '+1234567890', // In a real app, this would come from the user profile
        },
        type,
      });
      
      // Show success message
      if (Platform.OS === 'web') {
        alert('Listing created successfully!');
      } else {
        Alert.alert('Success', 'Your listing has been created successfully!');
      }
      
      router.replace('/categories');
    } catch (error: any) {
      // Show error message
      if (Platform.OS === 'web') {
        alert(`Failed to create listing: ${error.message}`);
      } else {
        Alert.alert('Error', `Failed to create listing: ${error.message}`);
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create {type === 'buy' ? 'Buy' : 'Sell'} Listing</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.typeContainer}>
            <Text style={styles.typeLabel}>Listing Type:</Text>
            <View style={styles.typeToggle}>
              <Text style={[styles.typeText, type === 'buy' ? styles.activeType : null]}>Buy</Text>
              <Switch
                value={type === 'sell'}
                onValueChange={(value) => setType(value ? 'sell' : 'buy')}
                trackColor={{ false: Colors.card, true: Colors.accent }}
                thumbColor={Colors.text}
              />
              <Text style={[styles.typeText, type === 'sell' ? styles.activeType : null]}>Sell</Text>
            </View>
          </View>
          
          <InputField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter listing name"
            error={errors.name}
          />
          
          <View style={styles.row}>
            <View style={styles.dateField}>
              <InputField
                label="Date (YYYY-MM-DD) *"
                value={date}
                onChangeText={setDate}
                placeholder="e.g., 2023-07-15"
                error={errors.date}
              />
            </View>
            
            <View style={styles.timeField}>
              <InputField
                label="Time (HH:MM) (Optional)"
                value={time}
                onChangeText={setTime}
                placeholder="e.g., 20:00"
                error={errors.time}
              />
            </View>
          </View>
          
          <InputField
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location"
            error={errors.location}
          />
          
          <InputField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your listing"
            multiline
            error={errors.description}
          />
          
          <View style={styles.selectContainer}>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    category === cat.name && styles.selectedCategoryChip,
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text 
                    style={[
                      styles.categoryChipText,
                      category === cat.name && styles.selectedCategoryChipText,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <InputField
            label="Price ($)"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
            error={errors.price}
          />
          
          <InputField
            label="Additional Information (Optional)"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            placeholder="Any additional details"
            multiline
          />
          
          <Button
            title="Create Listing"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 96, 96, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeLabel: {
    color: Colors.text,
    fontSize: 16,
  },
  typeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    color: Colors.textSecondary,
    marginHorizontal: 8,
  },
  activeType: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
  selectContainer: {
    marginBottom: 16,
  },
  label: {
    color: Colors.text,
    marginBottom: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryChip: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryChipText: {
    color: Colors.text,
  },
  selectedCategoryChipText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateField: {
    width: '58%',
  },
  timeField: {
    width: '38%',
  },
});