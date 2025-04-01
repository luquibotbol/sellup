import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { useEventStore } from '@/store/eventStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import EventCard from '@/components/EventCard';
import Button from '@/components/Button';

export default function PartiesScreen() {
  const { fetchEventsByCategory, getEventsByCategory, isLoading, error } = useEventStore();
  
  useEffect(() => {
    fetchEventsByCategory('Parties');
  }, []);
  
  const partyEvents = getEventsByCategory('Parties');
  
  if (isLoading && !partyEvents.length) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading events...</Text>
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
            onPress={() => fetchEventsByCategory('Parties')} 
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      {partyEvents.length > 0 ? (
        <FlatList
          data={partyEvents}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={() => fetchEventsByCategory('Parties')}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No party events found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
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