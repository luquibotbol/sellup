import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, MapPin, Tag } from 'lucide-react-native';
import { useEventStore } from '@/store/eventStore';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import Button from '@/components/Button';
import FloatingButton from '@/components/FloatingButton';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEventById } = useEventStore();
  
  const event = getEventById(id);
  
  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
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
  
  const handleContactSeller = () => {
    const message = `Hi, I'm interested in your listing "${event.name}" on Sellup.`;
    const url = Platform.select({
      ios: `whatsapp://send?phone=${event.seller.contact}&text=${encodeURIComponent(message)}`,
      android: `whatsapp://send?phone=${event.seller.contact}&text=${encodeURIComponent(message)}`,
      web: `https://web.whatsapp.com/send?phone=${event.seller.contact}&text=${encodeURIComponent(message)}`,
    });
    
    Linking.canOpenURL(url!)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url!);
        } else {
          // Fallback for web or if WhatsApp is not installed
          if (Platform.OS === 'web') {
            window.open(`https://wa.me/${event.seller.contact}?text=${encodeURIComponent(message)}`);
          } else {
            alert('WhatsApp is not installed on your device');
          }
        }
      })
      .catch((err) => console.error('An error occurred', err));
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
          
          <Button
            title="Contact Seller"
            onPress={handleContactSeller}
            style={styles.contactButton}
          />
        </View>
      </ScrollView>
      
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
  },
});