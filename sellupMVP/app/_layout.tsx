// app/_layout.tsx
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

export default function Layout() {
  // Example: Load custom fonts if desired
  const [fontsLoaded] = useFonts({
     "LeagueSpartan": require('../assets/fonts/LeagueSpartan-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Provide global config for your stack (e.g., hide headers, theming)
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1C1C1C' }, // example dark background
      }}
    />
  );
}
