import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Apple, Mail } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import SocialButton from '@/components/SocialButton';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signInWithProvider, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isReady, setIsReady] = useState(false);
  
  // Set isReady after a short delay to ensure Root Layout is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Only navigate after component is ready
  useEffect(() => {
    if (isAuthenticated && isReady) {
      router.replace('/categories');
    }
  }, [isAuthenticated, router, isReady]);
  
  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  const handleSignIn = async () => {
    clearError();
    
    if (validateForm()) {
      await signIn(email, password);
    }
  };
  
  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    clearError();
    await signInWithProvider(provider);
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Sellup</Text>
          <Text style={styles.tagline}>Buy and sell tickets easily</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={emailError}
          />
          
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={passwordError}
          />
          
          <Button
            title="Sign In"
            onPress={handleSignIn}
            isLoading={isLoading}
            style={styles.signInButton}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <SocialButton
            title="Continue with Apple"
            icon={<Apple size={20} color={Colors.text} />}
            onPress={() => handleSocialSignIn('apple')}
          />
          
          <SocialButton
            title="Continue with Email"
            icon={<Mail size={20} color={Colors.text} />}
            onPress={() => handleSocialSignIn('google')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 48,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.text,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 96, 96, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
  },
  signInButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    paddingHorizontal: 16,
  },
});