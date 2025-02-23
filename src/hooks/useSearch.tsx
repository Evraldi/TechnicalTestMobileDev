import { useState, useCallback, useMemo } from 'react';
import { Post } from '../types';

type SearchState = {
  results: Post[];
  loading: boolean;
  error: string | null;
};

export const useSearch = () => {
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
  });

  const searchPosts = useCallback(async (query: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setState({ results: data, loading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? 
        err.message.replace('Failed to fetch', 'Network error') : 
        'Failed to search posts';
        
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  return useMemo(() => ({
    ...state,
    searchPosts,
  }), [state, searchPosts]);
};