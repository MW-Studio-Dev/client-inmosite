'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, WebsiteConfig } from '@/types/theme';
import {
  defaultThemes,
  defaultWebsiteConfig,
  applyTheme,
  saveTheme,
  loadTheme,
  saveWebsiteConfig,
  loadWebsiteConfig,
} from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  config: WebsiteConfig;
  setTheme: (theme: Theme) => void;
  updateConfig: (config: Partial<WebsiteConfig>) => void;
  resetToDefaults: () => void;
  availableThemes: Theme[];
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultThemes[0]);
  const [config, setConfigState] = useState<WebsiteConfig>(defaultWebsiteConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [availableThemes] = useState<Theme[]>(defaultThemes);

  // Initialize theme and config from localStorage
  useEffect(() => {
    const savedTheme = loadTheme();
    const savedConfig = loadWebsiteConfig();

    if (savedTheme) {
      setThemeState(savedTheme);
    }

    if (savedConfig) {
      setConfigState(savedConfig);
    } else if (savedTheme) {
      // Update default config with saved theme
      setConfigState(prev => ({ ...prev, theme: savedTheme }));
    }

    setIsLoading(false);
  }, []);

  // Apply theme to DOM whenever theme changes
  useEffect(() => {
    if (!isLoading) {
      applyTheme(theme);
    }
  }, [theme, isLoading]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    
    // Update config with new theme
    const updatedConfig = { ...config, theme: newTheme };
    setConfigState(updatedConfig);
    saveWebsiteConfig(updatedConfig);
  };

  const updateConfig = (updates: Partial<WebsiteConfig>) => {
    const updatedConfig = { ...config, ...updates };
    setConfigState(updatedConfig);
    saveWebsiteConfig(updatedConfig);
    
    // If theme is updated in config, apply it
    if (updates.theme && updates.theme !== theme) {
      setThemeState(updates.theme);
      saveTheme(updates.theme);
    }
  };

  const resetToDefaults = () => {
    const defaultTheme = defaultThemes[0];
    const resetConfig = { ...defaultWebsiteConfig, theme: defaultTheme };
    
    setThemeState(defaultTheme);
    setConfigState(resetConfig);
    saveTheme(defaultTheme);
    saveWebsiteConfig(resetConfig);
  };

  const value: ThemeContextType = {
    theme,
    config,
    setTheme,
    updateConfig,
    resetToDefaults,
    availableThemes,
    isLoading,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}