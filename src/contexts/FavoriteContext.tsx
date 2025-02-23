import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Post } from '../types';

type FavoritesContextValue = {
  favorites: Post[];
  addFavorite: (post: Post) => void;
  removeFavorite: (postId: number) => void;
  isFavorite: (postId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue>({} as FavoritesContextValue);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Post[]>([]);

  const addFavorite = useCallback((post: Post) => {
    setFavorites(prev => [...prev, post]);
  }, []);

  const removeFavorite = useCallback((postId: number) => {
    setFavorites(prev => prev.filter(p => p.id !== postId));
  }, []);

  const isFavorite = useCallback((postId: number) => {
    return favorites.some(p => p.id === postId);
  }, [favorites]);

  const value = useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  }), [favorites, addFavorite, removeFavorite, isFavorite]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};