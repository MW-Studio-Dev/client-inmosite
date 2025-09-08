// hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Detectar tema inicial
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setThemeState(initialTheme);
    setMounted(true);
  }, []);

  // Aplicar tema al documento - ESTO ES LO CLAVE
  // Solo necesita ejecutarse una vez globalmente y afecta toda la app
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remover clases existentes
    root.classList.remove('dark');
    root.removeAttribute('data-theme');
    
    // Aplicar nuevo tema
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
    
    // Optional: Dispatch custom event para otros listeners
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme, isDark: theme === 'dark' } 
    }));
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
    mounted,
  };
};