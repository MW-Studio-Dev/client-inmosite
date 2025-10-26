// Theme Management System
import { Theme, ThemeColors, WebsiteConfig } from '@/types/theme';

export const defaultThemes: Theme[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    colors: {
      primary: '#3B82F6', // Blue-500
      secondary: '#1E40AF', // Blue-800
      accent: '#F59E0B', // Amber-500
    },
    isDark: false,
  },
  {
    id: 'elegant-emerald',
    name: 'Elegant Emerald',
    colors: {
      primary: '#10B981', // Emerald-500
      secondary: '#047857', // Emerald-700
      accent: '#EF4444', // Red-500
    },
    isDark: false,
  },
  {
    id: 'professional-gray',
    name: 'Professional Gray',
    colors: {
      primary: '#6B7280', // Gray-500
      secondary: '#374151', // Gray-700
      accent: '#8B5CF6', // Violet-500
    },
    isDark: false,
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    colors: {
      primary: '#D97706', // Amber-600
      secondary: '#92400E', // Amber-700
      accent: '#1F2937', // Gray-800
    },
    isDark: false,
  },
  {
    id: 'dark-modern',
    name: 'Dark Modern',
    colors: {
      primary: '#3B82F6', // Blue-500
      secondary: '#1E40AF', // Blue-800
      accent: '#F59E0B', // Amber-500
    },
    isDark: true,
  },
];

export const defaultWebsiteConfig: WebsiteConfig = {
  theme: defaultThemes[0],
  logo: {
    url: '/logo.png',
    alt: 'Real Estate Logo',
  },
  navigation: [
    { id: '1', label: 'Home', href: '#home' },
    { id: '2', label: 'Properties', href: '#properties' },
    { id: '3', label: 'Projects', href: '#projects' },
    { id: '4', label: 'About', href: '#about' },
    { id: '5', label: 'Contact', href: '#contact' },
  ],
  hero: {
    title: 'Find Your Dream Property',
    subtitle: 'Discover the perfect home or investment opportunity with our premium real estate selection.',
    backgroundImage: '/hero-bg.jpg',
    overlayOpacity: 0.6,
    ctaText: 'Browse Properties',
    ctaLink: '#properties',
  },
  about: {
    title: 'About Our Company',
    description: 'With over 15 years of experience in the real estate market, we have helped thousands of families find their perfect home. Our team of expert agents is committed to providing exceptional service and ensuring your real estate journey is smooth and successful.',
    image: '/about-image.jpg',
    stats: [
      { id: '1', value: 15, label: 'Years of Experience', suffix: '+' },
      { id: '2', value: 2500, label: 'Properties Sold', suffix: '+' },
      { id: '3', value: 98, label: 'Client Satisfaction', suffix: '%' },
      { id: '4', value: 50, label: 'Expert Agents', suffix: '+' },
    ],
  },
  contact: {
    address: '123 Real Estate Ave, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@realestate.com',
    whatsapp: '+1555123456',
    mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1510579767645',
  },
  social: {
    facebook: 'https://facebook.com/realestate',
    instagram: 'https://instagram.com/realestate',
    linkedin: 'https://linkedin.com/company/realestate',
    twitter: 'https://twitter.com/realestate',
    youtube: 'https://youtube.com/@realestate',
    tiktok: 'https://tiktok.com/@realestate',
  },
  features: {
    showDevelopmentProjects: true,
    showAboutUs: true,
    showStats: true,
    enableWhatsApp: true,
    enableMap: true,
  },
};

// Helper functions for color manipulation
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function generateColorShades(baseColor: string): Record<string, string> {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return {};

  const shades: Record<string, string> = {};
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  steps.forEach((step, index) => {
    const factor = index < 5 ? (5 - index) * 0.15 : (index - 4) * 0.15;
    const isLighter = index < 5;
    
    const r = Math.round(isLighter ? rgb.r + (255 - rgb.r) * factor : rgb.r * (1 - factor));
    const g = Math.round(isLighter ? rgb.g + (255 - rgb.g) * factor : rgb.g * (1 - factor));
    const b = Math.round(isLighter ? rgb.b + (255 - rgb.b) * factor : rgb.b * (1 - factor));
    
    shades[step] = `rgb(${Math.max(0, Math.min(255, r))}, ${Math.max(0, Math.min(255, g))}, ${Math.max(0, Math.min(255, b))})`;
  });
  
  return shades;
}

// Apply theme to CSS custom properties
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  
  // Generate color shades
  const primaryShades = generateColorShades(theme.colors.primary);
  const secondaryShades = generateColorShades(theme.colors.secondary);
  const accentShades = generateColorShades(theme.colors.accent);
  
  // Apply primary colors
  Object.entries(primaryShades).forEach(([shade, color]) => {
    root.style.setProperty(`--color-primary-${shade}`, color);
  });
  
  // Apply secondary colors
  Object.entries(secondaryShades).forEach(([shade, color]) => {
    root.style.setProperty(`--color-secondary-${shade}`, color);
  });
  
  // Apply accent colors
  Object.entries(accentShades).forEach(([shade, color]) => {
    root.style.setProperty(`--color-accent-${shade}`, color);
  });
  
  // Apply base theme colors
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  
  // Apply dark/light mode specific colors
  if (theme.isDark) {
    root.style.setProperty('--color-background', '#0F172A');
    root.style.setProperty('--color-background-secondary', '#1E293B');
    root.style.setProperty('--color-background-tertiary', '#334155');
    root.style.setProperty('--color-surface', '#1E293B');
    root.style.setProperty('--color-surface-hover', '#334155');
    root.style.setProperty('--color-surface-border', '#475569');
    root.style.setProperty('--color-text-primary', '#F8FAFC');
    root.style.setProperty('--color-text-secondary', '#E2E8F0');
    root.style.setProperty('--color-text-tertiary', '#CBD5E1');
    root.style.setProperty('--color-text-muted', '#94A3B8');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.style.setProperty('--color-background', '#FFFFFF');
    root.style.setProperty('--color-background-secondary', '#F8FAFC');
    root.style.setProperty('--color-background-tertiary', '#F1F5F9');
    root.style.setProperty('--color-surface', '#FFFFFF');
    root.style.setProperty('--color-surface-hover', '#F8FAFC');
    root.style.setProperty('--color-surface-border', '#E2E8F0');
    root.style.setProperty('--color-text-primary', '#0F172A');
    root.style.setProperty('--color-text-secondary', '#334155');
    root.style.setProperty('--color-text-tertiary', '#64748B');
    root.style.setProperty('--color-text-muted', '#94A3B8');
    root.setAttribute('data-theme', 'light');
  }
  
  // Additional utility colors
  root.style.setProperty('--color-success', '#10B981');
  root.style.setProperty('--color-warning', '#F59E0B');
  root.style.setProperty('--color-error', '#EF4444');
  
  // Shadow definitions
  root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)');
  root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');
  root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)');
  root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)');
  
  // Border radius
  root.style.setProperty('--radius-sm', '4px');
  root.style.setProperty('--radius-md', '8px');
  root.style.setProperty('--radius-lg', '12px');
  root.style.setProperty('--radius-xl', '16px');
}

// Local storage helpers
export function saveTheme(theme: Theme): void {
  localStorage.setItem('website-theme', JSON.stringify(theme));
}

export function loadTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('website-theme');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveWebsiteConfig(config: WebsiteConfig): void {
  localStorage.setItem('website-config', JSON.stringify(config));
}

export function loadWebsiteConfig(): WebsiteConfig | null {
  try {
    const stored = localStorage.getItem('website-config');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Theme validation
export function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

export function createCustomTheme(
  name: string,
  colors: ThemeColors,
  isDark: boolean = false
): Theme {
  return {
    id: `custom-${Date.now()}`,
    name,
    colors,
    isDark,
  };
}