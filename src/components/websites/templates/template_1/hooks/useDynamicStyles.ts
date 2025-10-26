import { useEffect } from 'react';
import { TemplateConfig } from '../types';
import { getAdaptiveTextColor } from '../utils/colorUtils';

export const useDynamicStyles = (config: TemplateConfig) => {
  // Generar colores adaptativos basados en la configuración
  const adaptiveColors = {
    primaryText: getAdaptiveTextColor(config.colors.primary),
    accentText: getAdaptiveTextColor(config.colors.accent), 
    backgroundText: getAdaptiveTextColor(config.colors.background),
    surfaceText: getAdaptiveTextColor(config.colors.surface)
  };

  // Generar estilos dinámicos
  const dynamicStyles = {
    fontFamily: config.typography.fontFamily,
    primaryColor: config.colors.primary,
    primaryDark: config.colors.primaryDark,
    primaryLight: config.colors.primaryLight,
    accentColor: config.colors.accent,
    backgroundColor: config.colors.background,
    surfaceColor: config.colors.surface,
    textColor: config.colors.text,
    textLightColor: config.colors.textLight
  };

  // Inyectar estilos dinámicos
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :root {
        --primary-color: ${dynamicStyles.primaryColor};
        --primary-dark: ${dynamicStyles.primaryDark};
        --primary-light: ${dynamicStyles.primaryLight};
        --accent-color: ${dynamicStyles.accentColor};
        --background-color: ${dynamicStyles.backgroundColor};
        --surface-color: ${dynamicStyles.surfaceColor};
        --text-color: ${dynamicStyles.textColor};
        --text-light-color: ${dynamicStyles.textLightColor};
        --font-family: ${dynamicStyles.fontFamily};
      }
      
      * {
        font-family: var(--font-family) !important;
      }
      
      .btn-primary {
        background-color: var(--primary-color) !important;
        color: ${adaptiveColors.primaryText} !important;
      }
      
      .btn-primary:hover {
        background-color: var(--primary-dark) !important;
      }
      
      .text-primary {
        color: var(--primary-color) !important;
      }
      
      .bg-primary {
        background-color: var(--primary-color) !important;
        color: ${adaptiveColors.primaryText} !important;
      }
      
      .bg-accent {
        background-color: var(--accent-color) !important;
        color: ${adaptiveColors.accentText} !important;
      }
      
      .bg-surface {
        background-color: var(--surface-color) !important;
        color: ${adaptiveColors.surfaceText} !important;
      }
      
      .border-primary {
        border-color: var(--primary-color) !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [dynamicStyles, adaptiveColors]);

  return {
    adaptiveColors,
    dynamicStyles
  };
};