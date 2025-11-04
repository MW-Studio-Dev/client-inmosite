/**
 * Obtiene el dominio actual desde el cliente (Client Component).
 * Usa window.location para obtener el origin (protocolo + hostname + puerto).
 * @returns {string} El origin completo (ej: 'https://midominio.com', 'http://localhost:3000')
 */
export function getCurrentDomainClient(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    // Usamos origin que incluye protocolo + hostname + puerto
    return window.location.origin;
  } catch (error) {
    console.error("No se pudo obtener el dominio desde el cliente:", error);
    return '';
  }
}

