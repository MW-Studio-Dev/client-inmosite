// utils/propertyUtils.ts
import { Property } from '@/types/property';

export const propertyUtils = {
  // Formatear precio para mostrar
  formatPrice: (priceUsd: string, priceArs: string): string => {
    const usd = parseFloat(priceUsd);
    const ars = parseFloat(priceArs);
    
    if (usd > 0) {
      return `USD ${usd.toLocaleString('es-AR')}`;
    } else if (ars > 0) {
      return `$ ${ars.toLocaleString('es-AR')}`;
    }
    return 'Consultar precio';
  },

  // Obtener color del estado
  getStatusConfig: (status: string) => {
    const configs = {
      disponible: {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Disponible',
        emoji: '✅'
      },
      vendido: {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Vendido',
        emoji: '🏁'
      },
      reservado: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Reservado',
        emoji: '⏳'
      },
      no_disponible: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'No Disponible',
        emoji: '🚫'
      }
    };
    return configs[status as keyof typeof configs] || configs.no_disponible;
  },

  // Obtener configuración del tipo de operación
  getOperationTypeConfig: (operationType: string) => {
    const configs = {
      venta: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Venta',
        emoji: '💰'
      },
      alquiler: {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Alquiler',
        emoji: '🏠'
      }
    };
    return configs[operationType as keyof typeof configs] || configs.venta;
  },

  // Obtener emoji del tipo de propiedad
  getPropertyTypeEmoji: (propertyType: string): string => {
    const emojis: { [key: string]: string } = {
      departamento: '🏢',
      casa: '🏠',
      oficina: '🏢',
      local: '🏪',
      lote: '🏞️',
      cochera: '🚗',
      quinta: '🏡',
      galpon: '🏭',
      default: '🏠'
    };
    return emojis[propertyType.toLowerCase()] || emojis.default;
  },

  // Formatear fecha de manera amigable
  formatRelativeDate: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `Hace ${years} año${years > 1 ? 's' : ''}`;
    }
  },

  // Ordenar propiedades por diferentes criterios
  sortProperties: (properties: Property[], sortBy: string, order: 'asc' | 'desc' = 'desc') => {
    return [...properties].sort((a, b) => {
      let valueA: number | string;
      let valueB: number | string;

      switch (sortBy) {
        case 'price':
          valueA = parseFloat(a.price_usd) || parseFloat(a.price_ars) || 0;
          valueB = parseFloat(b.price_usd) || parseFloat(b.price_ars) || 0;
          break;
        case 'views':
          valueA = a.views_count;
          valueB = b.views_count;
          break;
        case 'created':
          valueA = new Date(a.created_at).getTime();
          valueB = new Date(b.created_at).getTime();
          break;
        case 'updated':
          valueA = new Date(a.updated_at).getTime();
          valueB = new Date(b.updated_at).getTime();
          break;
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  },

  // Filtrar propiedades por texto de búsqueda
  searchProperties: (properties: Property[], searchTerm: string): Property[] => {
    if (!searchTerm.trim()) return properties;

    const term = searchTerm.toLowerCase();
    return properties.filter(property =>
      property.title.toLowerCase().includes(term) ||
      property.location_display.toLowerCase().includes(term) ||
      property.property_type.toLowerCase().includes(term) ||
      property.main_features.toLowerCase().includes(term)
    );
  },

  // Obtener resumen estadístico
  getPropertiesStats: (properties: Property[]) => {
    const total = properties.length;
    const published = properties.filter(p => p.is_published).length;
    const featured = properties.filter(p => p.is_featured).length;
    const available = properties.filter(p => p.status === 'disponible').length;
    const sold = properties.filter(p => p.status === 'vendido').length;
    
    const totalViews = properties.reduce((sum, p) => sum + p.views_count, 0);
    const avgViews = total > 0 ? Math.round(totalViews / total) : 0;

    const forSale = properties.filter(p => p.operation_type === 'venta').length;
    const forRent = properties.filter(p => p.operation_type === 'alquiler').length;

    return {
      total,
      published,
      featured,
      available,
      sold,
      totalViews,
      avgViews,
      forSale,
      forRent,
      publishedPercentage: total > 0 ? Math.round((published / total) * 100) : 0,
      availablePercentage: total > 0 ? Math.round((available / total) * 100) : 0
    };
  }
};