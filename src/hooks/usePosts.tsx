// hooks/usePosts.ts
import { useState, useCallback, useMemo, useRef } from 'react';
import { Post } from '../types';

type PostsState = {
  data: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
};

type Pagination = {
  page: number;
  limit: number;
};

export const usePosts = () => {
  const [state, setState] = useState<PostsState>({
    data: [],
    loading: false,
    error: null,
    hasMore: true,
  });

  const pagination = useRef<Pagination>({ page: 1, limit: 20 });
  const isMounted = useRef(true);

  const fetchPosts = useCallback(async (refresh = false) => {
    try {
      if (!isMounted.current) return;

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        data: refresh ? [] : prev.data,
      }));

      if (refresh) {
        pagination.current.page = 1;
      }

      const params = new URLSearchParams({
        _page: pagination.current.page.toString(),
        _limit: pagination.current.limit.toString(),
      });

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?${params}`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const newData = await response.json();
      const hasMore = newData.length === pagination.current.limit;

      setState(prev => ({
        data: refresh ? newData : [...prev.data, ...newData],
        loading: false,
        error: null,
        hasMore,
      }));

      if (hasMore) {
        pagination.current.page++;
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? 
          err.message.replace('Failed to fetch', 'Network error') : 
          'Failed to load posts';
        
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      }
    }
  }, []);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loading) {
      fetchPosts();
    }
  }, [state.hasMore, state.loading, fetchPosts]);

  const cleanup = useCallback(() => {
    isMounted.current = false;
  }, []);

  return useMemo(() => ({
    ...state,
    fetchPosts,
    loadMore,
    cleanup,
  }), [state, fetchPosts, loadMore, cleanup]);
};