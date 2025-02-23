import React, { useState } from 'react';
import { 
  View, 
  ActivityIndicator,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Animated, {FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text as Typography } from '../components/Typography';

export const AuthScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { theme } = useTheme();

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const success = isLogin 
        ? await login(username, password)
        : await register(username, password);
      
      if (!success) {
        throw new Error(`Gagal ${isLogin ? 'Login' : 'Registrasi'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Terjadi kesalahan yang tidak diketahui');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Variabel dinamis untuk dark/light mode
  const gradientColors = theme === 'light' 
    ? ['#f8f9fa', '#e9ecef'] as const 
    : ['#121212', '#2c3e50'] as const;

  const formContainerBg = theme === 'light' 
    ? 'rgba(255,255,255,0.9)' 
    : 'rgba(30,30,30,0.9)';

  const socialButtonBg = theme === 'light'
    ? 'rgba(255,255,255,0.9)'
    : 'rgba(30,30,30,0.9)';

  const textColor = theme === 'light' ? '#2c3e50' : '#ffffff';
  const placeholderColor = theme === 'light' ? '#95a5a6' : '#7f8c8d';
  const inputBgColor = theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(30,30,30,0.9)';

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <Animated.View 
        entering={FadeInUp.duration(1000).springify()}
        style={styles.logoContainer}
      >
        <Image
          source={require('../../foto/hitler.jpg')}
          style={styles.logo}
        />
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(800).springify()}
        style={[styles.formContainer, { backgroundColor: formContainerBg }]}
      >
        <Typography h3 style={[styles.title, { color: textColor }]}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Typography>

        {/* Username Input */}
        <Input
          placeholder="Username"
          placeholderTextColor={placeholderColor}
          inputStyle={{
            backgroundColor: inputBgColor,
            color: textColor,
          }}
          leftIcon={
            <Ionicons 
              name="person-outline" 
              size={20} 
              color={placeholderColor}
            />
          }
          value={username}
          onChangeText={setUsername}
        />

        {/* Password Input */}
        <Input
          placeholder="Password"
          placeholderTextColor={placeholderColor}
          inputStyle={{
            backgroundColor: inputBgColor,
            color: textColor,
          }}
          secureTextEntry
          leftIcon={
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color={placeholderColor}
            />
          }
          value={password}
          onChangeText={setPassword}
        />

        {/* Auth Button */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <TouchableOpacity
            style={styles.authButton}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography h4 color="#fff">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Typography>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Toggle Auth Mode */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)}>
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Typography caption color={placeholderColor}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Typography>
            <Typography caption color="#1abc9c" style={styles.toggleText}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Typography>
          </TouchableOpacity>
        </Animated.View>

        {/* Social Login */}
        <Animated.View 
          entering={FadeInDown.delay(1000).duration(600)}
          style={styles.socialContainer}
        >
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: placeholderColor }]} />
            <Typography caption color={placeholderColor} style={styles.dividerText}>
              Or continue with
            </Typography>
            <View style={[styles.dividerLine, { backgroundColor: placeholderColor }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: socialButtonBg }]}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: socialButtonBg }]}>
              <Ionicons name="logo-apple" size={24} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: socialButtonBg }]}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  formContainer: {
    borderRadius: 20,
    padding: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  authButton: {
    backgroundColor: '#1abc9c',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#16a085',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  toggleText: {
    marginLeft: 5,
    fontWeight: '600',
  },
  socialContainer: {
    marginTop: 30,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    padding: 15,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export default AuthScreen;
