import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

// Example category data
const categories = [
  {
    name: 'parties',
    image: require('../../assets/images/parties1.png'),
  },
  {
    name: 'phones',
    image: require('../../assets/images/phones.png'),
  },
  {
    name: 'mens clothing',
    image: require('../../assets/images/mensclothing.png'),
  },
  {
    name: 'concerts',
    image: require('../../assets/images/concert.png'),
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.headerContainer}>
        {/* Logo */}
        <Image
          source={require('../../assets/images/logo.png')} // Replace with your "sellup" logo
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Profile Icon */}
        <Image
          source={require('../../assets/images/profileicon.png')}
          style={styles.profileIcon}
          resizeMode="cover"
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>search categories</Text>
      </View>

      {/* Scrollable Category Cards */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat, index) => (
          <View style={styles.categoryCard} key={index}>
            {/* Left side (black box with text) */}
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryTitle}>{cat.name}</Text>
            </View>

            {/* Right side (image) */}
            <Image source={cat.image} style={styles.categoryImage} />
          </View>
        ))}
      </ScrollView>

      {/* Bottom Buttons (FAB-like) */}
      <TouchableOpacity style={[styles.fab, styles.fabLeft]}>
        <Text style={styles.fabText}>asks</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.fab, styles.fabRight]}>
        <Text style={styles.fabText}>selling</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#777777', // Overall gray background
  },
  /* ----------------
   *  TOP HEADER
   * ---------------- */
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  logo: {
    width: 120,
    height: 50,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  /* ----------------
   *  SEARCH BAR
   * ---------------- */
  searchBar: {
    backgroundColor: '#000000',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  searchText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  /* ----------------
   *  SCROLL AREA
   * ---------------- */
  scrollArea: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 100, // extra space so FABs don't cover the last card
  },
  /* ----------------
   *  CATEGORY CARDS
   * ---------------- */
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    // Shadow (iOS) & elevation (Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  categoryTextContainer: {
    width: SCREEN_WIDTH * 0.4, // 40% of screen width
    padding: 16,
    justifyContent: 'center',
  },
  categoryTitle: {
    // Replace with your custom font if desired
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  categoryImage: {
    width: SCREEN_WIDTH * 0.6, // 60% of screen width
    height: 120, // or adjust as needed
    resizeMode: 'cover',
  },
  /* ----------------
   *  BOTTOM FABs
   * ---------------- */
  fab: {
    position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: '#000000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    // Shadow / elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabLeft: {
    left: 20,
  },
  fabRight: {
    right: 20,
  },
  fabText: {
    color: '#C1FF72',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
