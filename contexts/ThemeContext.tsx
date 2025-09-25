import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { themes, Theme } from '../themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeKey: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeKey, setThemeKey] = useState<string>('dark');

  useEffect(() => {
    const currentTheme = themes[themeKey];
    if (currentTheme) {
      const root = document.documentElement;

      Object.entries(currentTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
      
      if (currentTheme.fontFamily) {
        root.style.setProperty('--font-family', currentTheme.fontFamily);
      } else {
        // Reset to default if theme doesn't specify one
        root.style.removeProperty('--font-family');
      }
    }
  }, [themeKey]);

  const setTheme = (key: string) => {
    if (themes[key]) {
      setThemeKey(key);
    }
  };

  const contextValue = {
    theme: themes[themeKey],
    setTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
