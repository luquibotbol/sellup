import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Switch, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
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
  const { addEvent } = useEventStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<'buy' | 'sell'>(params.type || 'sell');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Parties');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const [errors, setErrors] = useState({
    name: '',
    date: '',
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
    } else if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(date)) {
      newErrors.date = 'Date format should be YYYY-MM-DDTHH:MM:SS';
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
  
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      addEvent({
        name,
        category,
        date,
        location,
        description,
        price: parseFloat(price),
        image,
        additionalInfo,
        seller: {
          id: user?.id || 'unknown',
          name: user?.name || 'Anonymous',
          contact: '+1234567890', // Mock contact
        },
        type,
      });
      
      setIsLoading(false);
      router.replace('/categories');
    }, 1000);
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
          <InputField
            label="Date (YYYY-MM-DDTHH:MM:SS)"
            value={date}
            onChangeText={setDate}
            placeholder="e.g., 2023-07-15T20:00:00"
            error={errors.date}
          />
          
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
});