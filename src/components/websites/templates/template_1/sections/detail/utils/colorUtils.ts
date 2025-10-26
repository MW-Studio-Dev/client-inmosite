export const isLightColor = (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };
  
  export const getAdaptiveTextColor = (backgroundColor: string): string => {
    return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
  };
  
  export const getAdaptiveColors = (templateConfig: any) => ({
    primaryText: getAdaptiveTextColor(templateConfig.colors.primary),
    accentText: getAdaptiveTextColor(templateConfig.colors.accent),
    backgroundText: getAdaptiveTextColor(templateConfig.colors.background),
    surfaceText: getAdaptiveTextColor(templateConfig.colors.surface)
  });