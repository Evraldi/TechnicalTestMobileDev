import 'react-native-gesture-handler';
import 'react-native-shared-element';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { FavoritesProvider } from './src/contexts/FavoriteContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { RootStackParamList, Post } from './src/types';
import { lightTheme, darkTheme } from './src/config/theme';
import {
  ListScreen,
  DetailScreen,
  ProfileScreen,
  FavoritesScreen,
  SearchScreen,
  AuthScreen
} from './src/screens';

const MainStack = createSharedElementStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </ThemeProvider>
  </AuthProvider>
);

const MainTabs = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: currentTheme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: currentTheme.colors.card,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          paddingBottom: 2
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'list',
            Search: 'search',
            Favorites: 'heart',
            Profile: 'person'
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={ListScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const NavigationStack = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: currentTheme.colors.background },
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        }),
      }}
    >
      {isAuthenticated ? (
        <>
          <MainStack.Screen name="MainTabs" component={MainTabs} />
          <MainStack.Screen
            name="Detail"
            component={DetailScreen}
            sharedElements={(route) => [
              `item.${route.params.data.id}.title`
            ]}
            options={{
              cardStyle: { backgroundColor: 'transparent' },
              gestureEnabled: false,
            }}
          />
        </>
      ) : (
        <MainStack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            animationTypeForReplace: 'pop',
            cardStyle: { backgroundColor: currentTheme.colors.background }
          }}
        />
      )}
    </MainStack.Navigator>
  );
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer theme={lightTheme}>
        <NavigationStack />
      </NavigationContainer>
    </AppProvider>
  );
}