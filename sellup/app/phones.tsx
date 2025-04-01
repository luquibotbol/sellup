import React from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { useEventStore } from '@/store/eventStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import EventCard from '@/components/EventCard';

export default function PhonesScreen() {
  const { events } = useEventStore();
  const phoneEvents = events.filter(event => event.category === 'Phones');
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      {phoneEvents.length > 0 ? (
        <FlatList
          data={phoneEvents}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No phone listings found</Text>
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
});