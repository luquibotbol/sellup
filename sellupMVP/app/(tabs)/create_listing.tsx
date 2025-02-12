// app/create-listing.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CreateListingScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState<'sell' | 'ask'>('sell');

  const handleCreate = () => {
    // TODO: Submit the listing to your backend
    router.back(); // navigate back after creation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Listing</Text>

      <TextInput
        style={styles.input}
        placeholder="Insert title"
        placeholderTextColor="#AAAAAA"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Insert price"
        placeholderTextColor="#AAAAAA"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'sell' && styles.activeButton]}
          onPress={() => setMode('sell')}
        >
          <Text style={styles.toggleText}>Add to Selling</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'ask' && styles.activeButton]}
          onPress={() => setMode('ask')}
        >
          <Text style={styles.toggleText}>Add to Asking</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#8FFF4B',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  toggleButton: {
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#8FFF4B',
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#8FFF4B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
