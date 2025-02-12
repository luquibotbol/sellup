// app/index.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.container}>
      {/* Top rectangle (header background) */}
      <View style={styles.topRectangle} />

      {/* Header screenshot image */}
      <Image
        source={require('../../assets/images/logo.png')} // update the asset path accordingly
        style={styles.screenshot}
        resizeMode="cover"
      />

      {/* Profile icon image */}
      <Image
        source={require('../../assets/images/react-logo.png')} // update with your profile icon asset
        style={styles.profileIcon}
        resizeMode="cover"
      />

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>search categories</Text>
      </View>

      {/* Category Card Example: A Black Card with "parties" */}
      <View style={styles.categoryCard}>
        <Text style={styles.categoryText}>parties</Text>
      </View>

      {/* Floating Action Button for "asks" */}
      <View style={styles.fabLeft}>
        <Text style={styles.fabText}>asks</Text>
      </View>

      {/* Floating Action Button for "selling" */}
      <View style={styles.fabRight}>
        <Text style={styles.fabText}>selling</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 393,
    height: 852,
    backgroundColor: '#777777',
  },
  topRectangle: {
    position: 'absolute',
    width: 393,
    height: 95,
    left: 0,
    top: 0,
    backgroundColor: '#777777',
  },
  screenshot: {
    position: 'absolute',
    width: 135,
    height: 60,
    left: 130,
    top: 32,
    borderRadius: 10,
  },
  profileIcon: {
    position: 'absolute',
    width: 60,
    height: 60,
    left: 313,
    top: 32,
    borderRadius: 30,
  },
  searchBar: {
    position: 'absolute',
    left: 80,
    top: 127,
    width: 239,
    height: 40,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 9999, // creates a pill shape
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  categoryCard: {
    position: 'absolute',
    left: 21,
    top: 181,
    width: 351,
    height: 124,
    backgroundColor: '#000000',
    borderRadius: 16,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  categoryText: {
    fontFamily: 'League Spartan', // ensure this font is loaded or replace with a default font
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fabLeft: {
    position: 'absolute',
    width: 60,
    height: 60,
    left: 22,
    top: 769,
    backgroundColor: '#000000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS and elevation for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 8,
  },
  fabRight: {
    position: 'absolute',
    width: 60,
    height: 60,
    left: 311,
    top: 770,
    backgroundColor: '#000000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 8,
  },
  fabText: {
    fontFamily: 'League Spartan',
    fontSize: 14,
    fontWeight: '700',
    color: '#C1FF72',
  },
});

