import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const db = SQLite.openDatabaseSync('auth.db');

  useEffect(() => {
    db.execAsync('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT);')
      .then(() => console.log('Database initialized'))
      .catch((error: Error) => console.error('DB init error:', error.message));
  }, []);

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await db.runAsync(
        'INSERT INTO users (username, password) VALUES (?, ?);',
        [username, password]
      );
      return result.changes > 0;
    } catch (error) {
      console.error('Registration error:', (error as Error).message);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await db.getAllAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM users WHERE username = ? AND password = ?;',
        [username, password]
      );

      const isAuthentic = result.length > 0 && result[0].count > 0;
      if (isAuthentic) setIsAuthenticated(true);
      return isAuthentic;
    } catch (error) {
      console.error('Login error:', (error as Error).message);
      return false;
    }
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
