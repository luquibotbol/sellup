import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Tag, CheckCircle, XCircle, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Event } from '@/store/eventStore';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/event/${event.id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusIcon = () => {
    if (!event.status || event.status === 'active') return null;
    
    switch (event.status) {
      case 'completed':
        return <CheckCircle size={16} color={Colors.success} />;
      case 'cancelled':
        return <XCircle size={16} color={Colors.error} />;
      case 'pending':
        return <Clock size={16} color={Colors.accent} />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    if (!event.status || event.status === 'active') return null;
    
    return (
      <Text style={[
        styles.statusText,
        event.status === 'completed' ? styles.completedText : 
        event.status === 'cancelled' ? styles.cancelledText : 
        styles.pendingText
      ]}>
        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      </Text>
    );
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]} 
      onPress={handlePress}
    >
      <Image 
        source={{ uri: event.image }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      <View style={styles.content}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{event.type.toUpperCase()}</Text>
        </View>
        
        {event.status && event.status !== 'active' && (
          <View style={styles.statusContainer}>
            {getStatusIcon()}
            {getStatusText()}
          </View>
        )}
        
        <Text style={styles.name}>{event.name}</Text>
        
        <View style={styles.infoRow}>
          <Calendar size={16} color={Colors.accent} />
          <Text style={styles.infoText}>{formatDate(event.date)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.accent} />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Tag size={16} color={Colors.accent} />
          <Text style={styles.infoText}>${event.price.toFixed(2)}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: Colors.card,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  typeTag: {
    position: 'absolute',
    top: -20,
    right: 16,
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: Colors.text,
    marginLeft: 8,
    fontSize: 14,
  },
  description: {
    color: Colors.textSecondary,
    marginTop: 8,
    fontSize: 14,
  },
});