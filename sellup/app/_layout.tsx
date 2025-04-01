import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
import { ErrorBoundary } from './error-boundary';
import Colors from '@/constants/colors';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Colors.background} 
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="categories"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="parties"
          options={{
            title: 'Parties',
            headerBackTitle: 'Categories',
          }}
        />
        <Stack.Screen
          name="concerts"
          options={{
            title: 'Concerts',
            headerBackTitle: 'Categories',
          }}
        />
        <Stack.Screen
          name="sports"
          options={{
            title: 'Sports',
            headerBackTitle: 'Categories',
          }}
        />
        <Stack.Screen
          name="theater"
          options={{
            title: 'Theater',
            headerBackTitle: 'Categories',
          }}
        />
        <Stack.Screen
          name="phones"
          options={{
            title: 'Phones',
            headerBackTitle: 'Categories',
          }}
        />
        <Stack.Screen
          name="mens-clothing"
          options={{
            title: "Men's Clothing",
            headerBackTitle: 'Categories',
          }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{
            title: 'Event Details',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="create-event"
          options={{
            title: 'Create Listing',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}