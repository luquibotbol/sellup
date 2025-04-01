import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useEventStore, Event } from '@/store/eventStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import Button from '@/components/Button';

export default function ManageListingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, fetchEvents, updateEventStatus, isLoading, error } = useEventStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Filter events to show only listings from the current user
  const userListings = events.filter(
    event => event.seller.id === user?.id
  );
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const handleUpdateStatus = async (id: string, status: 'active' | 'completed' | 'cancelled' | 'pending') => {
    setUpdatingId(id);
    
    try {
      await updateEventStatus(id, status);
      
      if (Platform.OS === 'web') {
        alert(`Listing status updated to ${status}`);
      } else {
        Alert.alert('Success', `Listing status updated to ${status}`);
      }
    } catch (error: any) {
      if (Platform.OS === 'web') {
        alert(`Failed to update status: ${error.message}`);
      } else {
        Alert.alert('Error', `Failed to update status: ${error.message}`);
      }
    } finally {
      setUpdatingId(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const renderListingItem = ({ item }: { item: Event }) => (
    <View style={styles.listingItem}>
      <View style={styles.listingHeader}>
        <Text style={styles.listingTitle}>{item.name}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'completed' ? styles.completedBadge : 
          item.status === 'cancelled' ? styles.cancelledBadge : 
          item.status === 'pending' ? styles.pendingBadge :
          styles.activeBadge
        ]}>
          <Text style={styles.statusText}>
            {item.status ? item.status.toUpperCase() : 'ACTIVE'}
          </Text>
        </View>
      </View>
      
      <View style={styles.listingDetails}>
        <Text style={styles.listingType}>{item.type.toUpperCase()} • {item.category}</Text>
        <Text style={styles.listingPrice}>${item.price.toFixed(2)}</Text>
      </View>
      
      <Text style={styles.listingDate}>Created: {formatDate(item.date)}</Text>
      
      <View style={styles.actionButtons}>
        {(!item.status || item.status === 'active' || item.status === 'pending') && (
          <Button
            title="Mark Completed"
            onPress={() => handleUpdateStatus(item.id, 'completed')}
            variant="outline"
            isLoading={updatingId === item.id}
            disabled={updatingId !== null}
            style={[styles.actionButton, styles.completedButton]}
          />
        )}
        
        {(!item.status || item.status === 'active') && (
          <Button
            title="Mark Pending"
            onPress={() => handleUpdateStatus(item.id, 'pending')}
            variant="outline"
            isLoading={updatingId === item.id}
            disabled={updatingId !== null}
            style={[styles.actionButton, styles.pendingButton]}
          />
        )}
        
        {(!item.status || item.status === 'active' || item.status === 'pending') && (
          <Button
            title="Cancel Listing"
            onPress={() => handleUpdateStatus(item.id, 'cancelled')}
            variant="outline"
            isLoading={updatingId === item.id}
            disabled={updatingId !== null}
            style={[styles.actionButton, styles.cancelButton]}
          />
        )}
        
        {(item.status === 'cancelled' || item.status === 'completed') && (
          <Button
            title="Reactivate"
            onPress={() => handleUpdateStatus(item.id, 'active')}
            variant="outline"
            isLoading={updatingId === item.id}
            disabled={updatingId !== null}
            style={[styles.actionButton, styles.reactivateButton]}
          />
        )}
        
        <Button
          title="View Details"
          onPress={() => router.push(`/event/${item.id}`)}
          variant="secondary"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
  
  if (isLoading && !userListings.length) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading your listings...</Text>
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
        <Text style={styles.title}>Manage Listings</Text>
        <Text style={styles.subtitle}>Update the status of your listings as transactions occur</Text>
      </View>
      
      {userListings.length > 0 ? (
        <FlatList
          data={userListings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={fetchEvents}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Listings Yet</Text>
          <Text style={styles.emptyText}>
            You haven't created any listings yet. Create a listing to get started.
          </Text>
          <Button
            title="Create Listing"
            onPress={() => router.push('/create-event')}
            style={styles.createButton}
          />
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: 16,
  },
  listingItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: 'rgba(142, 255, 96, 0.2)',
  },
  completedBadge: {
    backgroundColor: 'rgba(96, 255, 142, 0.2)',
  },
  cancelledBadge: {
    backgroundColor: 'rgba(255, 96, 96, 0.2)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 200, 96, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
  },
  listingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  listingType: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  listingDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: '48%',
    marginBottom: 8,
  },
  completedButton: {
    borderColor: Colors.success,
  },
  cancelButton: {
    borderColor: Colors.error,
  },
  pendingButton: {
    borderColor: Colors.accent,
  },
  reactivateButton: {
    borderColor: Colors.accent,
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
});