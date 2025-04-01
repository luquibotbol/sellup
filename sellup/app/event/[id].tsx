import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Linking, Platform, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, MapPin, Tag, CheckCircle, XCircle, Clock } from 'lucide-react-native';
import { useEventStore } from '@/store/eventStore';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import Button from '@/components/Button';
import FloatingButton from '@/components/FloatingButton';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEventById, updateEventStatus, isLoading, error } = useEventStore();
  const { user } = useAuthStore();
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const event = getEventById(id);
  const isOwner = event?.seller.id === user?.id;
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading event details...</Text>
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
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleContactSeller = async () => {
    setIsLoadingContact(true);
    
    try {
      const message = `Hi, I'm interested in your listing "${event.name}" on Sellup.`;
      
      // Simulate contacting seller
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (Platform.OS === 'web') {
        alert(`Contact info: ${event.seller.contact}

In a real app, this would open WhatsApp or messaging.`);
      } else {
        Alert.alert(
          'Contact Seller',
          `Contact info: ${event.seller.contact}

In a real app, this would open WhatsApp or messaging.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error contacting seller:', error);
      if (Platform.OS === 'web') {
        alert('Failed to contact seller. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to contact seller. Please try again.');
      }
    } finally {
      setIsLoadingContact(false);
    }
  };
  
  const handleUpdateStatus = async (status: 'active' | 'completed' | 'cancelled' | 'pending') => {
    setIsUpdatingStatus(true);
    
    try {
      await updateEventStatus(event.id, status);
      
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
      setIsUpdatingStatus(false);
    }
  };
  
  const handleBuy = () => {
    router.push({
      pathname: '/create-event',
      params: { type: 'buy' },
    });
  };
  
  const handleSell = () => {
    router.push({
      pathname: '/create-event',
      params: { type: 'sell' },
    });
  };
  
  const getStatusBadge = () => {
    if (!event.status || event.status === 'active') return null;
    
    let icon;
    let statusStyle;
    
    switch (event.status) {
      case 'completed':
        icon = <CheckCircle size={16} color={Colors.success} />;
        statusStyle = styles.completedStatus;
        break;
      case 'cancelled':
        icon = <XCircle size={16} color={Colors.error} />;
        statusStyle = styles.cancelledStatus;
        break;
      case 'pending':
        icon = <Clock size={16} color={Colors.accent} />;
        statusStyle = styles.pendingStatus;
        break;
      default:
        return null;
    }
    
    return (
      <View style={[styles.statusBadge, statusStyle]}>
        {icon}
        <Text style={[
          styles.statusText,
          event.status === 'completed' ? styles.completedText : 
          event.status === 'cancelled' ? styles.cancelledText : 
          styles.pendingText
        ]}>
          {event.status.toUpperCase()}
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: event.image }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        
        <View style={styles.content}>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{event.type.toUpperCase()}</Text>
          </View>
          
          {getStatusBadge()}
          
          <Text style={styles.name}>{event.name}</Text>
          
          <View style={styles.infoRow}>
            <Calendar size={20} color={Colors.accent} />
            <Text style={styles.infoText}>{formatDate(event.date)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={20} color={Colors.accent} />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Tag size={20} color={Colors.accent} />
            <Text style={styles.infoText}>${event.price.toFixed(2)}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
          
          {event.additionalInfo ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <Text style={styles.description}>{event.additionalInfo}</Text>
            </View>
          ) : null}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <Text style={styles.sellerName}>{event.seller.name}</Text>
          </View>
          
          {isOwner ? (
            <View style={styles.ownerActions}>
              <Text style={styles.ownerTitle}>Manage Your Listing</Text>
              
              {(!event.status || event.status === 'active' || event.status === 'pending') && (
                <Button
                  title="Mark as Completed"
                  onPress={() => handleUpdateStatus('completed')}
                  isLoading={isUpdatingStatus}
                  style={styles.statusButton}
                  variant="outline"
                />
              )}
              
              {(!event.status || event.status === 'active') && (
                <Button
                  title="Mark as Pending"
                  onPress={() => handleUpdateStatus('pending')}
                  isLoading={isUpdatingStatus}
                  style={styles.statusButton}
                  variant="outline"
                />
              )}
              
              {(!event.status || event.status === 'active' || event.status === 'pending') && (
                <Button
                  title="Cancel Listing"
                  onPress={() => handleUpdateStatus('cancelled')}
                  isLoading={isUpdatingStatus}
                  style={styles.statusButton}
                  variant="outline"
                />
              )}
              
              {(event.status === 'cancelled' || event.status === 'completed') && (
                <Button
                  title="Reactivate Listing"
                  onPress={() => handleUpdateStatus('active')}
                  isLoading={isUpdatingStatus}
                  style={styles.statusButton}
                />
              )}
            </View>
          ) : (
            <Button
              title={isLoadingContact ? "Contacting..." : "Contact Seller"}
              onPress={handleContactSeller}
              isLoading={isLoadingContact}
              style={styles.contactButton}
            />
          )}
        </View>
      </ScrollView>
      
      {!isOwner && (
        <View style={styles.floatingButtonsContainer}>
          <FloatingButton
            onPress={handleBuy}
            label="Buy"
            style={styles.buyButton}
          />
          <FloatingButton
            onPress={handleSell}
            label="Sell"
            style={styles.sellButton}
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
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  typeText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  completedStatus: {
    backgroundColor: 'rgba(96, 255, 142, 0.2)',
  },
  cancelledStatus: {
    backgroundColor: 'rgba(255, 96, 96, 0.2)',
  },
  pendingStatus: {
    backgroundColor: 'rgba(255, 200, 96, 0.2)',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  completedText: {
    color: Colors.success,
  },
  cancelledText: {
    color: Colors.error,
  },
  pendingText: {
    color: Colors.accent,
  },
  name: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: Colors.text,
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  sellerName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactButton: {
    marginTop: 24,
  },
  ownerActions: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ownerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusButton: {
    marginBottom: 12,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  buyButton: {
    backgroundColor: Colors.accent,
  },
  sellButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: Colors.error,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 120,
  },
});