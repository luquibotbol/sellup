import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEventStore } from '@/store/eventStore';
import { categories } from '@/constants/mockData';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import CategoryCard from '@/components/CategoryCard';
import FloatingButton from '@/components/FloatingButton';
import Button from '@/components/Button';

export default function CategoriesScreen() {
  const router = useRouter();
  const { fetchEvents, isLoading, error } = useEventStore();
  
  // Fetch all events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const handleCreateEvent = () => {
    router.push('/create-event');
  };
  
  if (isLoading && !categories.length) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Button 
            title="Retry" 
            onPress={fetchEvents} 
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryCard
            id={item.id}
            name={item.name}
            image={item.image}
            route={item.route}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={fetchEvents}
      />
      
      <View style={styles.floatingButtonContainer}>
        <FloatingButton onPress={handleCreateEvent} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    width: 120,
  },
});