import React from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useFavorites } from '../contexts/FavoriteContext';
import { useTheme } from '../contexts/ThemeContext';
import { Post } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Text as Typography } from '../components/Typography';
import Animated, { 
  FadeInRight, 
  Layout,
  SlideInDown
} from 'react-native-reanimated';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Post>);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FavoritesScreen = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { theme } = useTheme();

  const renderItem = ({ item, index }: { item: Post; index: number }) => (
    <AnimatedTouchable
      entering={FadeInRight.delay(index * 50).springify()}
      style={[
        styles.item,
        theme === 'light' ? styles.lightItem : styles.darkItem
      ]}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: `https://source.unsplash.com/random/800x600?tech,${item.id}` }}
        style={styles.coverImage}
      />
      
      <View style={styles.content}>
        <Typography h4 style={styles.title} color={theme === 'light' ? '#2c3e50' : '#ecf0f1'}>
          {item.title}
        </Typography>
        
        <Typography body2 color={theme === 'light' ? '#7f8c8d' : '#95a5a6'} style={styles.excerpt}>
          {item.body.slice(0, 80)}...
        </Typography>

        <View style={styles.metaContainer}>
          <View style={styles.authorContainer}>
            <Image
              source={{ uri: `https://i.pravatar.cc/40?u=${item.userId}` }}
              style={styles.avatar}
            />
            <Typography caption color={theme === 'light' ? '#7f8c8d' : '#95a5a6'}>
              User #{item.userId}
            </Typography>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => removeFavorite(item.id)}
          >
            <Ionicons 
              name="heart" 
              size={24} 
              color="#e74c3c" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedTouchable>
  );

  return (
    <View style={[
      styles.container,
      theme === 'light' ? styles.lightContainer : styles.darkContainer
    ]}>
      <Animated.View 
        entering={SlideInDown.springify()}
        style={styles.header}
      >
        <Typography h2 style={styles.headerTitle} color={theme === 'light' ? '#2c3e50' : '#ecf0f1'}>
          Favorites
        </Typography>
        <Typography body2 color={theme === 'light' ? '#7f8c8d' : '#95a5a6'}>
          {favorites.length} saved items
        </Typography>
      </Animated.View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={64} color="#bdc3c7" />
          <Typography h4 style={styles.emptyText}>No Favorites Yet</Typography>
          <Typography body2 color="#95a5a6" style={styles.emptySubtext}>
            Start saving your favorite posts!
          </Typography>
        </View>
      ) : (
        <AnimatedFlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          layout={Layout.springify()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingHorizontal: 16
  },
  lightContainer: { 
    backgroundColor: '#f8f9fa' 
  },
  darkContainer: { 
    backgroundColor: '#121212' 
  },
  header: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 16,
  },
  headerTitle: {
    marginBottom: 4,
  },
  listContent: { 
    paddingBottom: 32 
  },
  item: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lightItem: { 
    backgroundColor: '#ffffff' 
  },
  darkItem: { 
    backgroundColor: '#1e1e1e' 
  },
  coverImage: {
    height: 25,
    width: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
    lineHeight: 24,
  },
  excerpt: {
    lineHeight: 20,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginVertical: 16,
    color: '#2c3e50',
  },
  emptySubtext: {
    textAlign: 'center',
  },
});

export default FavoritesScreen;