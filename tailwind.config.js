/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Colores primarios usando variables CSS
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        // Colores de superficie
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
          border: 'var(--color-surface-border)',
        },
        // Colores de fondo
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
        },
        // Colores de texto
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
        },
        // Colores de acento
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        
        // Paleta adicional para rojos, grises y blancos
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Rojo principal
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827', // Negro principal
        }
      },
      boxShadow: {
        'custom-sm': 'var(--shadow-sm)',
        'custom-md': 'var(--shadow-md)',
        'custom-lg': 'var(--shadow-lg)',
        'custom-xl': 'var(--shadow-xl)',
      },
      borderRadius: {
        'custom-sm': 'var(--radius-sm)',
        'custom-md': 'var(--radius-md)',
        'custom-lg': 'var(--radius-lg)',
        'custom-xl': 'var(--radius-xl)',
      },
      fontFamily: {
        // Fuentes principales
        'gotham': ['Gotham', 'Inter', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        
        // Mantener las existentes
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Gotham', 'Inter', 'system-ui', 'sans-serif'], // Gotham para displays
        elegant: ['Poppins', 'Inter', 'system-ui', 'sans-serif'], // Poppins para textos elegantes
        
        // Alias adicionales
        'heading': ['Gotham', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-scale': 'fadeInScale 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Animaciones adicionales
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        'gradient-dark': 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      },
    },
  },
  plugins: [
    // Plugin personalizado para utilidades adicionales
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-gradient': {
          'background': `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.primary.700')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-red': {
          'background': 'linear-gradient(135deg, #dc2626, #b91c1c)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-gradient-primary': {
          'background': `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.primary.700')})`,
        },
        '.bg-gradient-primary-hover': {
          'background': `linear-gradient(135deg, ${theme('colors.primary.700')}, ${theme('colors.primary.800')})`,
        },
        '.bg-gradient-red': {
          'background': 'linear-gradient(135deg, #dc2626, #b91c1c)',
        },
        '.glass': {
          'backdrop-filter': 'blur(16px)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(16px)',
          'background': 'rgba(0, 0, 0, 0.2)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        // Utilidades para fuentes
        '.font-gotham-light': {
          'font-family': 'Gotham, Inter, system-ui, sans-serif',
          'font-weight': '300',
        },
        '.font-gotham-medium': {
          'font-family': 'Gotham, Inter, system-ui, sans-serif',
          'font-weight': '500',
        },
        '.font-gotham-bold': {
          'font-family': 'Gotham, Inter, system-ui, sans-serif',
          'font-weight': '700',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
}