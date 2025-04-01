import React from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { useEventStore } from '@/store/eventStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import EventCard from '@/components/EventCard';

export default function PartiesScreen() {
  const { events } = useEventStore();
  const partyEvents = events.filter(event => event.category === 'Parties');
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      {partyEvents.length > 0 ? (
        <FlatList
          data={partyEvents}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
});