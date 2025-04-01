import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import EventCard from '@/components/EventCard';
import Button from '@/components/Button';
import FloatingButton from '@/components/FloatingButton';

export default function MyBuyListingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, isLoading, error, fetchEvents } = useEventStore();
  
  // Filter events to show only buy listings from the current user
  const myBuyListings = events.filter(
    event => event.type === 'buy' && event.seller.id === user?.id
  );
  
  const handleCreateListing = () => {
    router.push({
      pathname: '/create-event',
      params: { type: 'buy' },
    });
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  if (isLoading && !myBuyListings.length) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading your buy listings...</Text>
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
      
      <View style={styles.header}>
        <Text style={styles.title}>My Buy Listings</Text>
      </View>
      
      {myBuyListings.length > 0 ? (
        <FlatList
          data={myBuyListings}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={fetchEvents}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Buy Listings Yet</Text>
          <Text style={styles.emptyText}>
            Create a buy listing to let others know what you're looking for.
          </Text>
          <Button
            title="Create Buy Listing"
            onPress={handleCreateListing}
            style={styles.createButton}
          />
        </View>
      )}
      
      <View style={styles.floatingButtonContainer}>
        <FloatingButton onPress={handleCreateListing} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    width: 200,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
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