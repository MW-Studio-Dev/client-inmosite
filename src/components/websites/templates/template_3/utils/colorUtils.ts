// Función para determinar si un color es claro u oscuro
export const isLightColor = (color: string): boolean => {
    // Convertir hex a RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcular luminosidad
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };
  
  // Función para generar colores adaptativos
  export const getAdaptiveTextColor = (backgroundColor: string): string => {
    return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
  };
  
  // Función para generar variaciones de color
  export const generateColorVariations = (baseColor: string) => {
    return {
      50: `${baseColor}0D`,   // 5% opacity
      100: `${baseColor}1A`,  // 10% opacity  
      200: `${baseColor}33`,  // 20% opacity
      300: `${baseColor}4D`,  // 30% opacity
      400: `${baseColor}66`,  // 40% opacity
      500: baseColor,         // Base color
      600: baseColor + 'CC',  // Slightly darker
      700: baseColor + 'B3',  // Darker
      800: baseColor + '99',  // Much darker
      900: baseColor + '80'   // Very dark
    };
  };