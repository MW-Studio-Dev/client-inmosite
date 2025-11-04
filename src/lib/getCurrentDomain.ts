// lib/getCurrentDomain.ts
import { headers } from 'next/headers';

/**
 * Obtiene el dominio actual de la petición de forma segura (Server Component).
 * Funciona en entornos de desarrollo y producción (incluso detrás de proxies como Vercel).
 * @returns {Promise<string>} El hostname sin puerto (ej: 'midominio.com', 'sub.cliente.com')
 */
export async function getCurrentDomain(): Promise<string> {
  try {
    const headersList = await headers();
    
    // En plataformas como Vercel, el dominio real puede estar en 'x-forwarded-host'
    // Si no existe, usamos 'host' como fallback.
    const domain = headersList.get('x-forwarded-host') || headersList.get('host');

    if (!domain) {
      // Esto no debería pasar en una petición normal, pero es bueno manejarlo.
      return '';
    }

    // Limpiamos el dominio 
    return domain;
  } catch (error) {
    // Esto puede ocurrir si la función se llama fuera de un contexto de petición (ej: en un build time)
    // o en un Client Component. Devolvemos un string vacío o un valor por defecto.
    console.error("No se pudo obtener el dominio de la petición:", error);
    return '';
  }
}
