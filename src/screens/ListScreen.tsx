import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  RefreshControl,
  Platform,
  LayoutAnimation,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { usePosts } from '../hooks/usePosts';
import { Post, RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../components/Typography';
import { useCommentCount } from '../hooks/useCommentCount';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Post>);

const ListItem = React.memo(({ item }: { item: Post }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Detail'>>();
  const { theme } = useTheme();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { count: commentCount } = useCommentCount(item.id);

  return (
    <Animated.View 
      entering={FadeInRight.duration(500)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { data: item })}
        style={[
          styles.item, 
          theme === 'light' ? styles.lightItem : styles.darkItem
        ]}
      >
        <Image
          source={{ uri: `https://source.unsplash.com/random/800x600?tech,${item.id}` }}
          style={styles.coverImage}
        />
        
        <View style={styles.contentWrapper}>
          <View style={styles.metaContainer}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.avatar}
            />
            <View>
              <Text subtitle2 color={theme === 'light' ? '#7f8c8d' : '#95a5a6'}>
                John Doe
              </Text>
              <Text caption color={theme === 'light' ? '#bdc3c7' : '#7f8c8d'}>
                2 hours ago
              </Text>
            </View>
          </View>

          <Text 
            h3 
            style={styles.title}
            color={theme === 'light' ? '#2c3e50' : '#ecf0f1'}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color="#95a5a6" />
              <Text caption color="#95a5a6" style={styles.statText}>
                {commentCount} comments
              </Text>
          </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color="#95a5a6" />
              <Text caption color="#95a5a6" style={styles.statText}>
                {Math.floor(Math.random() * 8)} min read
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => 
            isFavorite(item.id) 
              ? removeFavorite(item.id)
              : addFavorite(item)
          }
        >
          <Ionicons 
            name={isFavorite(item.id) ? 'heart' : 'heart-outline'} 
            size={24} 
            color="#e74c3c" 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
});

const SkeletonLoader = () => (
  <View style={styles.skeletonItem}>
    <View style={styles.skeletonImage} />
    <View style={styles.skeletonContent}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '60%' }]} />
      <View style={[styles.skeletonLine, { width: '40%' }]} />
    </View>
  </View>
);

export default function ListScreen() {
  const { theme } = useTheme();
  const { data, loading, error, fetchPosts, loadMore } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }, [data]);

  if (error) {
    return (
      <View style={[
        styles.centerContainer,
        theme === 'light' ? styles.lightContainer : styles.darkContainer
      ]}>
        <Image
          source={require('../../assets/error.png')}
          style={styles.errorIllustration}
        />
        <Text h3 style={styles.errorText}>{error}</Text>
        <Text body1 style={styles.errorSubtext}>Please check your connection</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchPosts()}
        >
          <Text h4 color="#fff">Try Again</Text>
          <Ionicons name="reload" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[
      styles.container, 
      theme === 'light' ? styles.lightContainer : styles.darkContainer
    ]}>
      {loading && !data.length ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <SkeletonLoader />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <AnimatedFlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ListItem item={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchPosts}
              colors={['#1abc9c']}
              tintColor="#1abc9c"
              progressBackgroundColor={theme === 'light' ? '#fff' : '#2c3e50'}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator 
                size="large" 
                color="#1abc9c" 
                style={styles.loadingFooter}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightContainer: { backgroundColor: '#f8f9fa' },
  darkContainer: { backgroundColor: '#121212' },
  listContent: { padding: 16 },
  item: {
    borderRadius: 16,
    marginVertical: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  lightItem: { backgroundColor: '#ffffff' },
  darkItem: { backgroundColor: '#1e1e1e' },
  coverImage: {
    height: 10,
    width: '100%',
    resizeMode: 'cover',
  },
  contentWrapper: {
    padding: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  title: {
    marginBottom: 16,
    lineHeight: 28,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIllustration: {
    width: 240,
    height: 240,
    marginBottom: 32,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    textAlign: 'center',
    color: '#95a5a6',
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1abc9c',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  skeletonItem: {
    borderRadius: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  skeletonImage: {
    height: 200,
    backgroundColor: '#dfe6e9',
  },
  skeletonContent: {
    padding: 20,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#dfe6e9',
    borderRadius: 4,
    marginBottom: 12,
    width: '80%',
  },
  loadingFooter: {
    paddingVertical: 32,
  },
});