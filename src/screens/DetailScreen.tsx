import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  Layout
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Comment, RootStackParamList } from '../types';
import { RouteProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from '../components/Typography';
import { useComments } from '../hooks/useComments';

type DetailScreenProps = {
  route: RouteProp<RootStackParamList, 'Detail'>;
};

const DetailScreen = ({ route }: DetailScreenProps) => {
  const { data: post } = route.params;
  const { theme } = useTheme();
  const { comments, loading, currentPage, fetchComments } = useComments(post.id);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComments(1).then(() => setRefreshing(false));
  };

  const handleEndReached = () => {
    if (!loading) {
      fetchComments(currentPage + 1);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        theme === 'light' ? styles.lightContainer : styles.darkContainer
      ]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme === 'light' ? '#1abc9c' : '#fff'}
        />
      }
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          handleEndReached();
        }
      }}
    >
      {/* Header with Shared Element Transition */}
      <SharedElement id={`item.${post.id}.header`}>
        <Animated.View 
          style={styles.header}
          entering={FadeIn.delay(200)}
          layout={Layout.springify()}
        >
          <Image
            source={{ uri: `https://source.unsplash.com/random/800x600?tech,${post.id}` }}
            style={styles.coverImage}
          />
          <View style={styles.headerContent}>
            <Text 
              style={styles.categoryTag}
              color={theme === 'light' ? '#1abc9c' : '#fff'}
            >
              Technology
            </Text>
            <SharedElement id={`item.${post.id}.title`}>
              <Text 
                h1
                style={styles.title}
                color={theme === 'light' ? '#2c3e50' : '#fff'}
              >
                {post.title}
              </Text>
            </SharedElement>
          </View>
        </Animated.View>
      </SharedElement>

      {/* Author Info Section */}
      <Animated.View 
        style={styles.authorContainer}
        entering={FadeInDown.delay(300).springify()}
      >
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <Text 
            subtitle1 
            color={theme === 'light' ? '#2c3e50' : '#fff'}
          >
            John Doe
          </Text>
          <Text 
            caption 
            color={theme === 'light' ? '#7f8c8d' : '#bdc3c7'}
          >
            Senior Tech Writer • 5 min read
          </Text>
        </View>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Icon 
            name="bookmark-outline" 
            size={24} 
            color={theme === 'light' ? '#2c3e50' : '#fff'}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Article Content */}
      <Animated.Text
        style={[
          styles.body,
          { color: theme === 'light' ? '#34495e' : '#bdc3c7' }
        ]}
        entering={FadeInUp.delay(400).springify()}
      >
        {post.body.repeat(3)}
      </Animated.Text>

      {/* Comments Section */}
      <Animated.View 
        style={styles.sectionHeader}
        entering={SlideInLeft.delay(500)}
      >
        <Text h2 color={theme === 'light' ? '#2c3e50' : '#fff'}>
          {comments.length} Comments
        </Text>
        <View style={styles.sortButton}>
          <Text caption color="#1abc9c">
            Latest
          </Text>
          <Icon name="arrow-drop-down" size={16} color="#1abc9c" />
        </View>
      </Animated.View>

      {/* Comments List */}
      {comments.map((comment, index) => (
        <Animated.View 
          key={comment.id.toString()}
          style={[
            styles.commentCard,
            { backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e' }
          ]}
          entering={FadeInDown.delay(600 + index * 50).springify()}
        >
          <Image
            source={{ uri: `https://i.pravatar.cc/100?u=${comment.email}` }}
            style={styles.commentAvatar}
          />
          <View style={styles.commentContent}>
            <Text 
              subtitle2 
              color={theme === 'light' ? '#2c3e50' : '#fff'}
            >
              {comment.name}
            </Text>
            <Text 
              body2 
              color={theme === 'light' ? '#7f8c8d' : '#bdc3c7'}
              style={styles.commentBody}
            >
              {comment.body}
            </Text>
            <View style={styles.commentActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="thumb-up" size={16} color="#7f8c8d" />
                <Text caption color="#7f8c8d" style={styles.actionText}>
                  42
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="reply" size={16} color="#7f8c8d" />
                <Text caption color="#7f8c8d" style={styles.actionText}>
                  Reply
                </Text>
              </TouchableOpacity>
              <Text caption color="#7f8c8d">
                2h ago
              </Text>
            </View>
          </View>
        </Animated.View>
      ))}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1abc9c" />
        </View>
      )}
    </ScrollView>
  );
};

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
  const paddingToBottom = 50;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

(DetailScreen as React.FC<any> & { 
  sharedElements?: (route: RouteProp<RootStackParamList, 'Detail'>) => string[] 
}).sharedElements = (route) => {
  const { data } = route.params;
  return [
    `item.${data.id}.title`,
    `item.${data.id}.header`
  ];
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightContainer: { backgroundColor: '#f8f9fa' },
  darkContainer: { backgroundColor: '#121212' },
  content: { paddingBottom: 40 },
  header: {
    marginBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  coverImage: {
    height: 280,
    width: '100%',
    resizeMode: 'cover',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    lineHeight: 38,
    marginBottom: 0,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  authorInfo: {
    flex: 1,
  },
  bookmarkButton: {
    padding: 8,
  },
  body: {
    fontSize: 17,
    lineHeight: 28,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentBody: {
    marginVertical: 8,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
});

export default DetailScreen;
