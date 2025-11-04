// hooks/useTokenMonitor.ts - Hook para monitorear la validez de tokens

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

interface TokenMonitorOptions {
  checkInterval?: number; // Intervalo de verificación en ms (default: 60000 = 1 minuto)
  autoRefreshThreshold?: number; // Tiempo antes de expiración para renovar automáticamente en ms (default: 5 minutos)
  enabled?: boolean; // Si el monitoreo está habilitado (default: true)
}

/**
 * Hook que monitorea la validez de los tokens y los renueva automáticamente
 * cuando están próximos a expirar.
 *
 * @param options - Opciones de configuración del monitor
 *
 * @example
 * ```tsx
 * function App() {
 *   useTokenMonitor({
 *     checkInterval: 60000, // Verificar cada minuto
 *     autoRefreshThreshold: 300000, // Renovar si faltan menos de 5 minutos
 *   });
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export const useTokenMonitor = (options: TokenMonitorOptions = {}) => {
  const {
    checkInterval = 60000, // 1 minuto por defecto
    autoRefreshThreshold = 300000, // 5 minutos por defecto
    enabled = true
  } = options;

  const { isAuthenticated, refreshTokens, logout } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      // Limpiar intervalo si existe
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkTokenExpiration = () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!accessToken || !refreshToken) {
        console.log('🚪 Tokens no encontrados. Cerrando sesión...');
        logout();
        return;
      }

      try {
        // Decodificar el access token
        const accessPayload = JSON.parse(atob(accessToken.split('.')[1]));
        const accessExp = accessPayload.exp * 1000;
        const now = Date.now();
        const timeUntilExpiration = accessExp - now;

        // Si el token está completamente expirado
        if (timeUntilExpiration <= 0) {
          console.log('⏰ Access token expirado. Renovando...');
          refreshTokens();
          return;
        }

        // Si el token está próximo a expirar
        if (timeUntilExpiration < autoRefreshThreshold) {
          console.log(`⏰ Access token expira en ${Math.floor(timeUntilExpiration / 1000 / 60)} minutos. Renovando...`);
          refreshTokens();
          return;
        }

        // Verificar también el refresh token
        const refreshPayload = JSON.parse(atob(refreshToken.split('.')[1]));
        const refreshExp = refreshPayload.exp * 1000;
        const refreshTimeUntilExpiration = refreshExp - now;

        // Si el refresh token está expirado, cerrar sesión
        if (refreshTimeUntilExpiration <= 0) {
          console.log('❌ Refresh token expirado. Cerrando sesión...');
          logout();
          return;
        }

        // Log informativo (opcional, puedes comentar en producción)
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Tokens válidos. Access expira en ${Math.floor(timeUntilExpiration / 1000 / 60)} min, Refresh expira en ${Math.floor(refreshTimeUntilExpiration / 1000 / 60)} min`);
        }
      } catch (error) {
        console.error('❌ Error al verificar tokens:', error);
        // Si hay un error decodificando los tokens, son inválidos
        console.log('🚪 Tokens inválidos. Cerrando sesión...');
        logout();
      }
    };

    // Ejecutar una vez al montar
    checkTokenExpiration();

    // Configurar intervalo de verificación
    intervalRef.current = setInterval(checkTokenExpiration, checkInterval);

    // Limpiar al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, isAuthenticated, checkInterval, autoRefreshThreshold, refreshTokens, logout]);
};
