import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import { useSearch } from '../hooks/useSearch';
import { useTheme } from '../contexts/ThemeContext';
import { Post, RootStackParamList } from '../types';
import { SharedElement } from 'react-navigation-shared-element';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { 
  FadeIn, 
  FadeInRight, 
  Layout,
  SlideInDown,
  ZoomIn
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text as Typography } from '../components/Typography';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Post>);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const { results, loading, error, searchPosts } = useSearch();
  const { theme } = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  

  const handleItemPress = useCallback((item: Post) => {
    navigation.navigate('Detail', { data: item });
  }, [navigation]);

  const debouncedSearch = useCallback(() => {
    if (query.trim().length > 0) {
      searchPosts(query);
    }
  }, [query, searchPosts]);

  useEffect(() => {
    const timer = setTimeout(debouncedSearch, 500);
    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  const renderItem = useCallback(({ item, index }: { item: Post; index: number }) => (
    <AnimatedTouchable
      entering={FadeInRight.delay(index * 50).springify()}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.9}
      style={[
        styles.item,
        theme === 'light' ? styles.lightItem : styles.darkItem
      ]}
    >
      <SharedElement id={`item.${item.id}.image`}>
        <Image
          source={{ uri: `https://source.unsplash.com/random/800x600?tech,${item.id}` }}
          style={styles.coverImage}
        />
      </SharedElement>
      
      <View style={styles.content}>
        <SharedElement id={`item.${item.id}.title`}>
          <Typography h4 style={styles.title} color={theme === 'light' ? '#2c3e50' : '#ecf0f1'}>
            {item.title}
          </Typography>
        </SharedElement>
        
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
          <View style={styles.statsContainer}>
            <Ionicons name="chatbubble-outline" size={14} color="#95a5a6" />
            <Typography caption color="#95a5a6" style={styles.statText}>
              {Math.floor(Math.random() * 50)} comments
            </Typography>
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  ), [theme, handleItemPress]);

  return (
    <View style={[
      styles.container,
      theme === 'light' ? styles.lightContainer : styles.darkContainer
    ]}>
      <Animated.View 
        entering={SlideInDown.springify()}
        style={[styles.searchContainer, theme === 'light' ? styles.lightSearch : styles.darkSearch]}
      >
        <Ionicons 
          name="search" 
          size={20} 
          color={theme === 'light' ? '#95a5a6' : '#7f8c8d'} 
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            { color: theme === 'light' ? '#2c3e50' : '#ffffff' }
          ]}
          placeholder="Search knowledge..."
          placeholderTextColor={theme === 'light' ? '#95a5a6' : '#7f8c8d'}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {loading && (
          <ActivityIndicator 
            size="small" 
            color="#1abc9c" 
            style={styles.loadingIndicator}
          />
        )}
      </Animated.View>

      {error ? (
        <Animated.View 
          entering={ZoomIn.springify()}
          style={styles.errorContainer}
        >
          <Ionicons name="warning" size={48} color="#e74c3c" />
          <Typography h4 style={styles.errorText}>Search Failed</Typography>
          <Typography body2 color="#95a5a6" style={styles.errorSubtext}>
            {error}
          </Typography>
        </Animated.View>
      ) : results.length === 0 && query.length > 0 ? (
        <Animated.View 
          entering={FadeIn.springify()}
          style={styles.emptyContainer}
        >
          <Ionicons name="search" size={64} color="#bdc3c7" />
          <Typography h4 style={styles.emptyText}>No Results Found</Typography>
          <Typography body2 color="#95a5a6" style={styles.emptySubtext}>
            We couldn't find any matches for "{query}"
          </Typography>
        </Animated.View>
      ) : (
        <AnimatedFlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  lightSearch: {
    backgroundColor: '#ffffff',
  },
  darkSearch: {
    backgroundColor: '#1e1e1e',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  loadingIndicator: {
    marginLeft: 12,
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
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginVertical: 16,
    color: '#e74c3c',
  },
  errorSubtext: {
    textAlign: 'center',
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

export default SearchScreen;