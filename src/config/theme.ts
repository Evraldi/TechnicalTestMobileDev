import { DefaultTheme } from '@react-navigation/native';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1abc9c',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textSecondary: '#95a5a6',
    border: '#e9ecef',
    notification: '#e74c3c',
  },
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1abc9c',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#7f8c8d', 
    border: '#2e2e2e',
    notification: '#e74c3c',
  },
};