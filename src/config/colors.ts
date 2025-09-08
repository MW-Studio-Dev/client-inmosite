// config/colors.ts
export interface ColorConfig {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: string;
  accentHover: string;
  success: string;
  warning: string;
  error: string;
}

// Configuración por defecto (púrpura)
export const defaultColors: ColorConfig = {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  accent: '#10b981',
  accentHover: '#059669',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Tema azul alternativo
export const blueTheme: ColorConfig = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  accent: '#10b981',
  accentHover: '#059669',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Tema verde alternativo
export const greenTheme: ColorConfig = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  accent: '#3b82f6',
  accentHover: '#2563eb',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Tema naranja alternativo
export const orangeTheme: ColorConfig = {
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  accent: '#10b981',
  accentHover: '#059669',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Función para aplicar tema dinámicamente
export const applyColorTheme = (colorConfig: ColorConfig) => {
  const root = document.documentElement;
  
  // Aplicar colores primarios - ESTO ES LO IMPORTANTE
  Object.entries(colorConfig.primary).forEach(([key, value]) => {
    root.style.setProperty(`--color-primary-${key}`, value);
  });
  
  // Aplicar otros colores
  root.style.setProperty('--color-accent', colorConfig.accent);
  root.style.setProperty('--color-accent-hover', colorConfig.accentHover);
  root.style.setProperty('--color-success', colorConfig.success);
  root.style.setProperty('--color-warning', colorConfig.warning);
  root.style.setProperty('--color-error', colorConfig.error);
  
  // Forzar actualización de los gradientes personalizados
  root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${colorConfig.primary[600]}, ${colorConfig.primary[700]})`);
  root.style.setProperty('--gradient-primary-hover', `linear-gradient(135deg, ${colorConfig.primary[700]}, ${colorConfig.primary[800]})`);
};

// Hook para cambiar tema de colores
export const useColorTheme = () => {
  const changeColorTheme = (theme: 'default' | 'blue' | 'green' | 'orange') => {
    let colorConfig: ColorConfig;
    
    switch (theme) {
      case 'blue':
        colorConfig = blueTheme;
        break;
      case 'green':
        colorConfig = greenTheme;
        break;
      case 'orange':
        colorConfig = orangeTheme;
        break;
      default:
        colorConfig = defaultColors;
    }
    
    applyColorTheme(colorConfig);
    localStorage.setItem('colorTheme', theme);
    
    // Forzar re-render para asegurar que los cambios se apliquen
    const event = new CustomEvent('colorThemeChanged', { detail: { theme, colorConfig } });
    window.dispatchEvent(event);
  };
  
  const initializeColorTheme = () => {
    const savedColorTheme = localStorage.getItem('colorTheme') as 'default' | 'blue' | 'green' | 'orange' || 'default';
    changeColorTheme(savedColorTheme);
  };
  
  return {
    changeColorTheme,
    initializeColorTheme,
  };
};