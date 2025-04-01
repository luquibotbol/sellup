#!/bin/bash

# Install Firebase core packages
npx expo install firebase

# Install Expo's utility library for Firebase
npx expo install @react-native-firebase/app

# Install Firebase Authentication libraries
npx expo install expo-auth-session expo-crypto

# Generate TypeScript declarations for Firebase
echo "Generating TypeScript declarations"
npm install --save-dev @types/firebase

# Success message
echo "Firebase packages installed successfully!"
echo "Remember to configure your Firebase credentials in sellup/firebase/config.ts" 