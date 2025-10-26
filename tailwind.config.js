/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // === CONFIGURACIÓN DE COLORES ===
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
          950: 'var(--color-primary-950)',
        },
        
        // Colores de superficie
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
          border: 'var(--color-surface-border)',
          muted: 'var(--color-surface-muted)',
        },
        
        // Colores de fondo
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          muted: 'var(--color-background-muted)',
        },
        
        // Colores de texto
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        },
        
        // Colores de estado
        success: {
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          500: 'var(--color-success)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
        },
        warning: {
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          500: 'var(--color-warning)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
        },
        error: {
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          500: 'var(--color-error)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
        },
        info: {
          50: 'var(--color-info-50)',
          100: 'var(--color-info-100)',
          500: 'var(--color-info)',
          600: 'var(--color-info-600)',
          700: 'var(--color-info-700)',
        },
        
        // Paleta extendida para rojos
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
          950: '#450a0a',
        },
        
        // Paleta extendida para grises
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
          950: '#030712',
        },
        
        // Colores adicionales para UI
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        muted: 'var(--color-muted)',
        destructive: 'var(--color-destructive)',
        popover: 'var(--color-popover)',
        card: 'var(--color-card)',
      },
      
      // === CONFIGURACIÓN DE FUENTES ===
      fontFamily: {
        // Fuente principal del sistema - ahora con General Sans
        sans: [
          'General Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],

        // General Sans como opción específica
        'general-sans': [
          'General Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        
        // Fuentes específicas del proyecto
        'gotham': [
          'Gotham', 
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          'sans-serif'
        ],
        'poppins': [
          'Poppins', 
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          'sans-serif'
        ],
        'inter': [
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          'sans-serif'
        ],
        'montserrat': [
          'Montserrat', 
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          'sans-serif'
        ],
        
        // Alias semánticos - actualizados para usar General Sans
        'display': [
          'General Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ], // Para títulos grandes y headers
        'heading': [
          'General Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ], // Para encabezados
        'body': [
          'General Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ], // Para texto del cuerpo
        'elegant': [
          'General Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ], // Para textos elegantes
        
        // Fuente monoespaciada
        'mono': [
          'ui-monospace', 
          'SFMono-Regular', 
          'Menlo', 
          'Monaco', 
          'Consolas', 
          'Liberation Mono', 
          'Courier New', 
          'monospace'
        ],
        
        // Fuentes serif (si las necesitas)
        'serif': [
          'ui-serif', 
          'Georgia', 
          'Cambria', 
          'Times New Roman', 
          'Times', 
          'serif'
        ],
      },
      
      // === CONFIGURACIÓN DE PESO DE FUENTES ===
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
        
        // Pesos específicos
        'gotham-light': '300',
        'gotham-medium': '500',
        'gotham-bold': '700',
      },
      
      // === CONFIGURACIÓN DE TAMAÑOS DE FUENTE ===
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // === CONFIGURACIÓN DE ESPACIADO ===
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // === CONFIGURACIÓN DE BREAKPOINTS ===
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        
        // Breakpoints personalizados
        'mobile': '375px',
        'tablet': '768px',
        'laptop': '1024px',
        'desktop': '1280px',
        'wide': '1440px',
      },
      
      // === CONFIGURACIÓN DE SOMBRAS ===
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
        
        // Sombras personalizadas
        'custom-sm': 'var(--shadow-sm)',
        'custom-md': 'var(--shadow-md)',
        'custom-lg': 'var(--shadow-lg)',
        'custom-xl': 'var(--shadow-xl)',
        'glow': '0 0 20px rgb(168 85 247 / 0.4)',
        'glow-lg': '0 0 40px rgb(168 85 247 / 0.6)',
      },
      
      // === CONFIGURACIÓN DE BORDER RADIUS ===
      borderRadius: {
        'none': '0',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
        
        // Radius personalizados
        'custom-sm': 'var(--radius-sm)',
        'custom-md': 'var(--radius-md)',
        'custom-lg': 'var(--radius-lg)',
        'custom-xl': 'var(--radius-xl)',
      },
      
      // === CONFIGURACIÓN DE ANIMACIONES ===
      animation: {
        // Animaciones básicas
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'fade-in-left': 'fadeInLeft 0.6s ease-out',
        'fade-in-right': 'fadeInRight 0.6s ease-out',
        'fade-in-scale': 'fadeInScale 0.4s ease-out',
        
        // Animaciones de movimiento
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        
        // Animaciones de escala
        'scale-in': 'scaleIn 0.4s ease-out',
        'scale-out': 'scaleOut 0.4s ease-out',
        
        // Animaciones continuas
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        
        // Animaciones interactivas
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        
        // Animaciones de aparición
        'appear': 'appear 0.5s ease-out',
        'disappear': 'disappear 0.5s ease-out',
        
        // Animaciones de rotación
        'rotate-slow': 'rotate 8s linear infinite',
        'rotate-reverse': 'rotateReverse 8s linear infinite',
      },
      
      // === CONFIGURACIÓN DE KEYFRAMES ===
      keyframes: {
        // Animaciones de aparición
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        
        // Animaciones de movimiento
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        
        // Animaciones de escala
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        
        // Animaciones interactivas
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(168 85 247 / 0.4)' },
          '100%': { boxShadow: '0 0 20px rgb(168 85 247 / 0.8)' },
        },
        
        // Animaciones de aparición/desaparición
        appear: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        disappear: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        
        // Animaciones de rotación
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rotateReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      
      // === CONFIGURACIÓN DE GRADIENTES ===
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%)',
        'gradient-primary-to-secondary': 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        'gradient-dark': 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        'gradient-red': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-green': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        
        // Gradientes radiales
        'radial-primary': 'radial-gradient(circle, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
        'radial-dark': 'radial-gradient(circle, #1f2937 0%, #111827 100%)',
        
        // Gradientes complejos
        'mesh-gradient': 'conic-gradient(from 180deg at 50% 50%, var(--color-primary-600) 0deg, var(--color-primary-700) 60deg, var(--color-primary-800) 120deg, var(--color-primary-600) 180deg, var(--color-primary-700) 240deg, var(--color-primary-800) 300deg, var(--color-primary-600) 360deg)',
      },
      
      // === CONFIGURACIÓN DE Z-INDEX ===
      zIndex: {
        'auto': 'auto',
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
        'max': '9999',
      },
      
      // === CONFIGURACIÓN DE TRANSICIONES ===
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
        '2000': '2000ms',
      },
      
      transitionTimingFunction: {
        'ease-in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'ease-in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'ease-in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  
  // === PLUGINS PERSONALIZADOS ===
  plugins: [
    // Plugin principal para utilidades personalizadas
    function({ addUtilities, addComponents, theme }) {
      // === UTILIDADES DE FUENTES ===
      const fontUtilities = {
        // Utilidades para General Sans
        '.font-general-sans-light': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '300',
        },
        '.font-general-sans-normal': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '400',
        },
        '.font-general-sans-medium': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '500',
        },
        '.font-general-sans-semibold': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '600',
        },
        '.font-general-sans-bold': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '700',
        },
        '.font-general-sans-extrabold': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '800',
        },

        // Utilidades para Gotham (mantener compatibilidad)
        '.font-gotham-thin': {
          'font-family': theme('fontFamily.gotham').join(', '),
          'font-weight': '100',
        },
        '.font-gotham-light': {
          'font-family': theme('fontFamily.gotham').join(', '),
          'font-weight': '300',
        },
        '.font-gotham-normal': {
          'font-family': theme('fontFamily.gotham').join(', '),
          'font-weight': '400',
        },
        '.font-gotham-medium': {
          'font-family': theme('fontFamily.gotham').join(', '),
          'font-weight': '500',
        },
        '.font-gotham-semibold': {
          'font-family': theme('fontFamily.gotham').join(', '),
          'font-weight': '600',
        },
        '.font-gotham-bold': {
          'font-family': theme('fontFamily.gotham').join(', '),
          'font-weight': '700',
        },
        '.font-gotham-extrabold': {
          'font-family': theme('fontFamily.gotham').join(', '),
          'font-weight': '800',
        },
        
        // Utilidades para Poppins
        '.font-poppins-thin': {
          'font-family': theme('fontFamily.poppins').join(', '),
          'font-weight': '100',
        },
        '.font-poppins-light': {
          'font-family': theme('fontFamily.poppins').join(', '),
          'font-weight': '300',
        },
        '.font-poppins-normal': {
          'font-family': theme('fontFamily.poppins').join(', '),
          'font-weight': '400',
        },
        '.font-poppins-medium': {
          'font-family': theme('fontFamily.poppins').join(', '),
          'font-weight': '500',
        },
        '.font-poppins-semibold': {
          'font-family': theme('fontFamily.poppins').join(', '),
          'font-weight': '600',
        },
        '.font-poppins-bold': {
          'font-family': theme('fontFamily.poppins').join(', '),
          'font-weight': '700',
        },
        '.font-poppins-extrabold': {
          'font-family': theme('fontFamily.poppins').join(', '),
          'font-weight': '800',
        },
        
        // Utilidades combinadas (familia + peso + tamaño) - actualizadas a General Sans
        '.heading-xl': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '700',
          'font-size': '3rem',
          'line-height': '1.1',
          'letter-spacing': '-0.02em',
        },
        '.heading-lg': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '600',
          'font-size': '2.25rem',
          'line-height': '1.2',
          'letter-spacing': '-0.01em',
        },
        '.heading-md': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '600',
          'font-size': '1.875rem',
          'line-height': '1.3',
        },
        '.heading-sm': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '600',
          'font-size': '1.5rem',
          'line-height': '1.4',
        },
        '.body-xl': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '400',
          'font-size': '1.25rem',
          'line-height': '1.6',
        },
        '.body-lg': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '400',
          'font-size': '1.125rem',
          'line-height': '1.6',
        },
        '.body-md': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '400',
          'font-size': '1rem',
          'line-height': '1.6',
        },
        '.body-sm': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '400',
          'font-size': '0.875rem',
          'line-height': '1.5',
        },
        '.body-xs': {
          'font-family': theme('fontFamily.general-sans').join(', '),
          'font-weight': '400',
          'font-size': '0.75rem',
          'line-height': '1.4',
        },
      };
      
      // === UTILIDADES DE GRADIENTES ===
      const gradientUtilities = {
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
        '.text-gradient-purple': {
          'background': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-blue': {
          'background': 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
        '.bg-gradient-purple': {
          'background': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        },
        '.bg-gradient-blue': {
          'background': 'linear-gradient(135deg, #3b82f6, #2563eb)',
        },
      };
      
      // === UTILIDADES DE EFECTOS GLASS ===
      const glassUtilities = {
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
        '.glass-strong': {
          'backdrop-filter': 'blur(24px)',
          'background': 'rgba(255, 255, 255, 0.15)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.glass-subtle': {
          'backdrop-filter': 'blur(8px)',
          'background': 'rgba(255, 255, 255, 0.05)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
      };
      
      // === UTILIDADES DE FLEXBOX Y GRID ===
      const layoutUtilities = {
        '.flex-center': {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.flex-between': {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'space-between',
        },
        '.flex-around': {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'space-around',
        },
        '.flex-evenly': {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'space-evenly',
        },
        '.flex-col-center': {
          'display': 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.grid-center': {
          'display': 'grid',
          'place-items': 'center',
        },
      };
      
      // === UTILIDADES DE POSICIONAMIENTO ===
      const positionUtilities = {
        '.absolute-center': {
          'position': 'absolute',
          'top': '50%',
          'left': '50%',
          'transform': 'translate(-50%, -50%)',
        },
        '.absolute-center-x': {
          'position': 'absolute',
          'left': '50%',
          'transform': 'translateX(-50%)',
        },
        '.absolute-center-y': {
          'position': 'absolute',
          'top': '50%',
          'transform': 'translateY(-50%)',
        },
        '.fixed-center': {
          'position': 'fixed',
          'top': '50%',
          'left': '50%',
          'transform': 'translate(-50%, -50%)',
        },
      };
      
      // === UTILIDADES DE SCROLL ===
      const scrollUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            'display': 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            'width': '6px',
            'height': '6px',
          },
        },
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
        },
      };
      
      // Agregar todas las utilidades
      addUtilities({
        ...fontUtilities,
        ...gradientUtilities,
        ...glassUtilities,
        ...layoutUtilities,
        ...positionUtilities,
        ...scrollUtilities,
      });
    },
    
    // Plugin para componentes base
    function({ addComponents, theme }) {
      const components = {
        // === COMPONENTES DE BOTONES ===
        '.btn': {
          'display': 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          'border-radius': theme('borderRadius.md'),
          'font-weight': theme('fontWeight.medium'),
          'transition': 'all 0.2s ease-in-out',
          'cursor': 'pointer',
          'text-decoration': 'none',
          '&:focus': {
            'outline': 'none',
            'box-shadow': `0 0 0 3px ${theme('colors.primary.500')}40`,
          },
          '&:disabled': {
            'opacity': '0.5',
            'cursor': 'not-allowed',
          },
        },
        '.btn-primary': {
          'background': `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.primary.700')})`,
          'color': 'white',
          'border': 'none',
          '&:hover:not(:disabled)': {
            'background': `linear-gradient(135deg, ${theme('colors.primary.700')}, ${theme('colors.primary.800')})`,
            'transform': 'translateY(-1px)',
            'box-shadow': theme('boxShadow.lg'),
          },
        },
        '.btn-secondary': {
          'background': theme('colors.gray.100'),
          'color': theme('colors.gray.900'),
          'border': `1px solid ${theme('colors.gray.300')}`,
          '&:hover:not(:disabled)': {
            'background': theme('colors.gray.200'),
            'transform': 'translateY(-1px)',
          },
        },
        '.btn-outline': {
          'background': 'transparent',
          'color': theme('colors.primary.600'),
          'border': `2px solid ${theme('colors.primary.600')}`,
          '&:hover:not(:disabled)': {
            'background': theme('colors.primary.600'),
            'color': 'white',
            'transform': 'translateY(-1px)',
          },
        },
        
        // === COMPONENTES DE SUPERFICIE ===
        '.surface': {
          'background-color': 'var(--color-surface)',
          'border': '1px solid var(--color-surface-border)',
          'border-radius': theme('borderRadius.lg'),
          'box-shadow': 'var(--shadow-sm)',
          'transition': 'all 0.2s ease-in-out',
        },
        '.surface-hover': {
          '&:hover': {
            'background-color': 'var(--color-surface-hover)',
            'box-shadow': 'var(--shadow-md)',
            'transform': 'translateY(-1px)',
          },
        },
        '.card': {
          'background': 'var(--color-surface)',
          'border': '1px solid var(--color-surface-border)',
          'border-radius': theme('borderRadius.lg'),
          'padding': theme('spacing.6'),
          'box-shadow': 'var(--shadow-sm)',
          'transition': 'all 0.2s ease-in-out',
        },
        '.card-hover': {
          '&:hover': {
            'box-shadow': 'var(--shadow-lg)',
            'transform': 'translateY(-2px)',
          },
        },
        
        // === COMPONENTES DE INPUTS ===
        '.input': {
          'width': '100%',
          'padding': `${theme('spacing.3')} ${theme('spacing.4')}`,
          'border': `1px solid var(--color-surface-border)`,
          'border-radius': theme('borderRadius.md'),
          'background': 'var(--color-surface)',
          'color': 'var(--color-text-primary)',
          'transition': 'all 0.2s ease-in-out',
          'font-family': theme('fontFamily.poppins').join(', '),
          '&:focus': {
            'outline': 'none',
            'border-color': theme('colors.primary.500'),
            'box-shadow': `0 0 0 3px ${theme('colors.primary.500')}20`,
          },
          '&::placeholder': {
            'color': 'var(--color-text-muted)',
          },
        },
        
        // === COMPONENTES DE TEXTO ===
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
      };
      
      addComponents(components);
    },
  ],
}