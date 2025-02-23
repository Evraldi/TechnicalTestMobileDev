// components/Typography.tsx
import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { ThemeType } from '../types';
import { useTheme } from '../contexts/ThemeContext';

type TypographyProps = TextProps & {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  subtitle1?: boolean;
  subtitle2?: boolean;
  body1?: boolean;
  body2?: boolean;
  caption?: boolean;
  color?: string;
  bold?: boolean;
  center?: boolean;
};

export const Text = ({
  h1,
  h2,
  h3,
  h4,
  subtitle1,
  subtitle2,
  body1,
  body2,
  caption,
  color,
  bold,
  center,
  style,
  ...props
}: TypographyProps) => {
  const { theme } = useTheme();
  const textColor = color || (theme === 'light' ? '#2c3e50' : '#ffffff');

  const styles = StyleSheet.create({
    h1: {
      fontSize: 32,
      fontWeight: '800',
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },    
    subtitle1: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    bold: {
      fontWeight: '700',
    },
    center: {
      textAlign: 'center',
    },
  });

  const textStyles = [
    h1 && styles.h1,
    h2 && styles.h2,
    h3 && styles.h3,
    h4 && styles.h4,
    subtitle1 && styles.subtitle1,
    subtitle2 && styles.subtitle2,
    body1 && styles.body1,
    body2 && styles.body2,
    caption && styles.caption,
    bold && styles.bold,
    center && styles.center,
    { color: textColor },
    style,
  ];
  
  return <RNText style={textStyles} {...props} />;
};