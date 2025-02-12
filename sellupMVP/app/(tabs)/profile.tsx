// app/profile.tsx
import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Lucas Babtol</Text>
      <Text style={styles.stats}>35 sold • 74 items • 2 requests</Text>

      <Text style={styles.subTitle}>Categories</Text>
      <Link href="/categories/parties" style={styles.link}>
        parties
      </Link>
      <Link href="/categories/phones" style={styles.link}>
        phones
      </Link>
      <Link href="/categories/concerts" style={styles.link}>
        concerts
      </Link>

      <Text
        style={[styles.link, { marginTop: 40 }]}
        onPress={() => router.back()}
      >
        Go Back
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  stats: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
    fontWeight: '600',
  },
  link: {
    fontSize: 16,
    color: '#8FFF4B',
    marginVertical: 4,
  },
});
