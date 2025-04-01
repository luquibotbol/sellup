import React from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { categories } from '@/constants/mockData';
import Colors from '@/constants/colors';
import NavBar from '@/components/NavBar';
import CategoryCard from '@/components/CategoryCard';
import FloatingButton from '@/components/FloatingButton';

export default function CategoriesScreen() {
  const router = useRouter();
  
  const handleCreateEvent = () => {
    router.push('/create-event');
  };
  
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
});