'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import {
  HiCheckCircle,
  HiXCircle,
  HiRefresh,
  HiArrowLeft,
  HiShoppingBag
} from 'react-icons/hi';

interface MeliConnectionResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    meli_user_id: number;
    meli_nickname: string;
    is_active: boolean;
    last_sync: string | null;
    is_token_expired: boolean;
    connection_status: string;
    needs_reauth: boolean;
    created_at: string;
    updated_at: string;
  };
  status_code: number;
}

type ConnectionState = 'idle' | 'connecting' | 'success' | 'error';

export default function MercadoLibreCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [connectionData, setConnectionData] = useState<MeliConnectionResponse['data'] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      handleOAuthCallback(code, state);
    } else {
      setConnectionState('error');
      setErrorMessage('No se recibieron los parámetros de autenticación necesarios');
    }
  }, [searchParams]);

  const handleOAuthCallback = async (code: string, state: string) => {
    setConnectionState('connecting');
    setErrorMessage('');

    try {
      const response = await axiosInstance.post<MeliConnectionResponse>(
        '/integrations/mercadolibre/auth/oauth_callback/',
        {
          code,
          state
        }
      );

      if (response.data.success) {
        setConnectionState('success');
        setConnectionData(response.data.data);
      } else {
        setConnectionState('error');
        setErrorMessage(response.data.message || 'Error al conectar con MercadoLibre');
      }
    } catch (error: any) {
      console.error('Error en OAuth callback:', error);
      setConnectionState('error');

      const errorMsg = error.response?.data?.message ||
                      error.response?.data?.error ||
                      error.message ||
                      'Error al conectar con MercadoLibre';
      setErrorMessage(errorMsg);
    }
  };

  const handleRetry = () => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      handleOAuthCallback(code, state);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/properties');
  };

  // Estado de carga
  if (connectionState === 'connecting') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`max-w-md w-full mx-4 rounded-xl border p-8 shadow-lg ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className={`relative ${
                isDark ? 'text-gray-600' : 'text-yellow-400'
              }`}>
                <HiShoppingBag className="h-16 w-16 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`h-20 w-20 rounded-full border-4 border-t-transparent animate-spin ${
                    isDark ? 'border-gray-600' : 'border-yellow-400'
                  }`}></div>
                </div>
              </div>
            </div>

            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Conectando con MercadoLibre
            </h2>

            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Por favor espera mientras establecemos la conexión...
            </p>

            <div className="mt-6">
              <div className={`h-2 w-full rounded-full overflow-hidden ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div className={`h-full rounded-full animate-pulse ${
                  isDark
                    ? 'bg-gradient-to-r from-gray-600 to-gray-500'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                }`}
                style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de éxito
  if (connectionState === 'success' && connectionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`max-w-md w-full mx-4 rounded-xl border p-8 shadow-lg ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <HiCheckCircle className="h-20 w-20 text-green-500 animate-bounce" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-green-500/20 animate-ping"></div>
                </div>
              </div>
            </div>

            <h2 className={`text-2xl font-bold mb-3 ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              ¡Conexión Exitosa!
            </h2>

            <p className={`text-sm mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Tu cuenta de MercadoLibre se ha conectado correctamente
            </p>

            <div className={`rounded-lg p-4 mb-6 text-left ${
              isDark
                ? 'bg-gray-900/50 border border-gray-700'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Usuario
                  </span>
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {connectionData.meli_nickname}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ID de Usuario
                  </span>
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {connectionData.meli_user_id}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Estado
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    connectionData.is_active
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {connectionData.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Estado de conexión
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    connectionData.connection_status === 'connected'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {connectionData.connection_status === 'connected' ? 'Conectado' : connectionData.connection_status}
                  </span>
                </div>

                {connectionData.last_sync && (
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Última Sincronización
                    </span>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {new Date(connectionData.last_sync).toLocaleString('es-AR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => router.push('/dashboard/config')}
                className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  isDark
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                }`}
              >
                Ver Configuración
              </button>

              <button
                onClick={handleGoBack}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                }`}
              >
                <HiArrowLeft className="h-4 w-4" />
                Volver a Propiedades
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (connectionState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`max-w-md w-full mx-4 rounded-xl border p-8 shadow-lg ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <HiXCircle className="h-20 w-20 text-red-500 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-red-500/20 animate-ping"></div>
                </div>
              </div>
            </div>

            <h2 className={`text-2xl font-bold mb-3 ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Error de Conexión
            </h2>

            <p className={`text-sm mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No se pudo conectar tu cuenta de MercadoLibre
            </p>

            {errorMessage && (
              <div className={`rounded-lg p-4 mb-6 text-left ${
                isDark
                  ? 'bg-red-900/20 border border-red-800'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-red-400' : 'text-red-700'
                }`}>
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  isDark
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                }`}
              >
                <HiRefresh className="h-4 w-4" />
                Reintentar
              </button>

              <button
                onClick={handleGoBack}
                className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 hover:border-gray-500'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <HiArrowLeft className="h-4 w-4" />
                Volver a Propiedades
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado inicial (no debería mostrarse)
  return null;
}
