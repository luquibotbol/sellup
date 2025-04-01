import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';

interface HistoryItem {
  id: string;
  type: 'buy' | 'sell';
  status: 'completed' | 'cancelled' | 'pending';
  title: string;
  date: string;
  price: number;
  counterparty: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'sell'>('all');
  
  // Mock history data
  const historyItems: HistoryItem[] = [
    {
      id: 'h1',
      type: 'sell',
      status: 'completed',
      title: 'Summer Night Party Ticket',
      date: '2023-06-10T14:30:00',
      price: 45.99,
      counterparty: 'John Smith',
    },
    {
      id: 'h2',
      type: 'buy',
      status: 'completed',
      title: 'Rock Concert VIP Pass',
      date: '2023-05-22T09:15:00',
      price: 120.00,
      counterparty: 'Emma Johnson',
    },
    {
      id: 'h3',
      type: 'sell',
      status: 'cancelled',
      title: 'Designer Jacket',
      date: '2023-04-15T16:45:00',
      price: 350.00,
      counterparty: 'Michael Brown',
    },
    {
      id: 'h4',
      type: 'buy',
      status: 'pending',
      title: 'iPhone 13 Pro',
      date: '2023-06-18T11:20:00',
      price: 899.99,
      counterparty: 'Sarah Wilson',
    },
  ];
  
  // Filter history items based on active tab
  const filteredItems = historyItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
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
  
  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.historyItem,
        pressed && styles.historyItemPressed,
      ]}
      onPress={() => {}}
    >
      <View style={styles.historyItemHeader}>
        <View style={styles.historyItemType}>
          <Text style={[
            styles.historyItemTypeText,
            item.type === 'buy' ? styles.buyText : styles.sellText,
          ]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.historyItemStatus}>
          {getStatusIcon(item.status)}
          <Text style={[
            styles.historyItemStatusText,
            item.status === 'completed' ? styles.completedText : 
            item.status === 'cancelled' ? styles.cancelledText : 
            styles.pendingText,
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.historyItemTitle}>{item.title}</Text>
      
      <View style={styles.historyItemDetails}>
        <View style={styles.historyItemDetail}>
          <Calendar size={14} color={Colors.textSecondary} />
          <Text style={styles.historyItemDetailText}>{formatDate(item.date)}</Text>
        </View>
        
        <Text style={styles.historyItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      
      <Text style={styles.historyItemCounterparty}>
        {item.type === 'buy' ? 'Bought from: ' : 'Sold to: '}{item.counterparty}
      </Text>
    </Pressable>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'all' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'all' && styles.activeTabText,
          ]}>
            All
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            activeTab === 'buy' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('buy')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'buy' && styles.activeTabText,
          ]}>
            Buy
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            activeTab === 'sell' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('sell')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'sell' && styles.activeTabText,
          ]}>
            Sell
          </Text>
        </Pressable>
      </View>
      
      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transaction history found</Text>
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
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  activeTabText: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyItemPressed: {
    opacity: 0.8,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyItemType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.background,
  },
  historyItemTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  buyText: {
    color: '#60a0ff', // Blue for buy
  },
  sellText: {
    color: Colors.accent, // Green for sell
  },
  historyItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemStatusText: {
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
  historyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  historyItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemDetailText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginLeft: 4,
  },
  historyItemPrice: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyItemCounterparty: {
    color: Colors.textSecondary,
    fontSize: 14,
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