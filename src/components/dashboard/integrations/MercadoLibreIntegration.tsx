'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/api';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { useToast } from '@/components/common/Toast';
import {
  HiCheckCircle,
  HiXCircle,
  HiRefresh,
  HiExclamationCircle,
  HiExternalLink,
  HiChartBar,
  HiShoppingCart
} from 'react-icons/hi';

interface MeliAuthStatus {
  connected: boolean;
  auth: {
    id: number;
    meli_user_id: number;
    meli_nickname: string;
    is_active: boolean;
    connection_status: string;
    needs_reauth: boolean;
    last_sync?: string;
    created_at: string;
  } | null;
}

interface MeliStats {
  connected: boolean;
  meli_nickname?: string;
  total_synced: number;
  active_listings: number;
  paused_listings: number;
  error_listings: number;
  last_sync_date?: string;
  sync_health_score: number;
  success_rate: number;
  connection_date?: string;
}

type LoadingState = 'idle' | 'loading' | 'connecting' | 'disconnecting';

export const MercadoLibreIntegration: React.FC = () => {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const { showSuccess, showError } = useToast();

  const [authStatus, setAuthStatus] = useState<MeliAuthStatus | null>(null);
  const [stats, setStats] = useState<MeliStats | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadAuthStatus();
  }, []);

  useEffect(() => {
    if (authStatus?.connected) {
      loadStats();
    }
  }, [authStatus?.connected]);

  const loadAuthStatus = async () => {
    setLoadingState('loading');
    try {
      const response = await axiosInstance.get('/integrations/mercadolibre/auth/');
      setAuthStatus(response.data.data);
    } catch (error: any) {
      console.error('Error loading MercadoLibre auth status:', error);
      showError('Error al cargar el estado de MercadoLibre');
    } finally {
      setLoadingState('idle');
    }
  };

  const loadStats = async () => {
    try {
      const response = await axiosInstance.get('/integrations/mercadolibre/sync/stats/');
      setStats(response.data.data);
    } catch (error: any) {
      console.error('Error loading MercadoLibre stats:', error);
    }
  };

  const handleConnect = async () => {
    setLoadingState('connecting');
    try {
      const response = await axiosInstance.get('/integrations/mercadolibre/auth/get_oauth_url/');
      const { oauth_url, state } = response.data.data;

      // Guardar el state en sessionStorage para validación (opcional)
      sessionStorage.setItem('meli_oauth_state', state);

      // Redirigir a MercadoLibre
      window.location.href = oauth_url;
    } catch (error: any) {
      console.error('Error connecting to MercadoLibre:', error);
      const errorMsg = error.response?.data?.message || 'Error al conectar con MercadoLibre';
      showError(errorMsg);
      setLoadingState('idle');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('¿Estás seguro de que deseas desconectar tu cuenta de MercadoLibre?')) {
      return;
    }

    setLoadingState('disconnecting');
    try {
      await axiosInstance.post('/integrations/mercadolibre/auth/disconnect/');
      showSuccess('Cuenta de MercadoLibre desconectada correctamente');
      setAuthStatus({ connected: false, auth: null });
      setStats(null);
    } catch (error: any) {
      console.error('Error disconnecting from MercadoLibre:', error);
      const errorMsg = error.response?.data?.message || 'Error al desconectar de MercadoLibre';
      showError(errorMsg);
    } finally {
      setLoadingState('idle');
    }
  };

  const handleRefreshStatus = async () => {
    await loadAuthStatus();
    if (authStatus?.connected) {
      await loadStats();
    }
    showSuccess('Estado actualizado');
  };

  if (loadingState === 'loading') {
    return (
      <div className={`rounded-xl border p-6 ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-center py-8">
          <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${
            isDark ? 'border-gray-600' : 'border-gray-300'
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              isDark
                ? 'bg-yellow-500/10 border border-yellow-500/20'
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <HiShoppingCart className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                MercadoLibre
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Publica y sincroniza tus propiedades automáticamente
              </p>
            </div>
          </div>

          <button
            onClick={handleRefreshStatus}
            disabled={loadingState !== 'idle'}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Actualizar estado"
          >
            <HiRefresh className={`h-5 w-5 ${loadingState !== 'idle' ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="p-6">
        {authStatus?.connected && authStatus.auth ? (
          <>
            {/* Connected Status */}
            <div className={`rounded-lg p-4 mb-4 ${
              authStatus.auth.is_active
                ? isDark
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-green-50 border border-green-200'
                : isDark
                  ? 'bg-yellow-500/10 border border-yellow-500/20'
                  : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-3">
                {authStatus.auth.is_active ? (
                  <HiCheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                ) : (
                  <HiExclamationCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${
                      authStatus.auth.is_active
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {authStatus.auth.is_active ? 'Conectado' : 'Requiere Reautenticación'}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${
                    authStatus.auth.is_active
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-yellow-600 dark:text-yellow-500'
                  }`}>
                    Usuario: {authStatus.auth.meli_nickname}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className={`rounded-lg p-4 mb-4 ${
              isDark
                ? 'bg-gray-900/50 border border-gray-700'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <h4 className={`text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-200' : 'text-gray-900'
              }`}>
                Información de la Cuenta
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Usuario ML
                  </span>
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {authStatus.auth.meli_nickname}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ID de Usuario
                  </span>
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {authStatus.auth.meli_user_id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Fecha de Conexión
                  </span>
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {new Date(authStatus.auth.created_at).toLocaleDateString('es-AR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Toggle */}
            {stats && (
              <button
                onClick={() => setShowStats(!showStats)}
                className={`w-full mb-4 p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between ${
                  isDark
                    ? 'bg-gray-900/50 hover:bg-gray-900 border border-gray-700'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HiChartBar className={`h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    Estadísticas de Sincronización
                  </span>
                </div>
                <span className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {showStats ? '▼' : '▶'}
                </span>
              </button>
            )}

            {/* Stats Panel */}
            {showStats && stats && (
              <div className={`rounded-lg p-4 mb-4 ${
                isDark
                  ? 'bg-gray-900/50 border border-gray-700'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Total Publicadas
                    </p>
                    <p className={`text-xl font-bold ${
                      isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {stats.total_synced}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Activas
                    </p>
                    <p className="text-xl font-bold text-green-500">
                      {stats.active_listings}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Pausadas
                    </p>
                    <p className="text-xl font-bold text-yellow-500">
                      {stats.paused_listings}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Con Error
                    </p>
                    <p className="text-xl font-bold text-red-500">
                      {stats.error_listings}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Estado de Salud
                    </span>
                    <span className={`text-xs font-bold ${
                      stats.sync_health_score >= 80
                        ? 'text-green-500'
                        : stats.sync_health_score >= 50
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}>
                      {stats.sync_health_score.toFixed(1)}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-full transition-all duration-500 ${
                        stats.sync_health_score >= 80
                          ? 'bg-green-500'
                          : stats.sync_health_score >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${stats.sync_health_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {authStatus.auth.needs_reauth && (
                <button
                  onClick={handleConnect}
                  disabled={loadingState === 'connecting'}
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                      : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingState === 'connecting' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Reconectando...
                    </>
                  ) : (
                    <>
                      <HiRefresh className="h-4 w-4" />
                      Reconectar Cuenta
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleDisconnect}
                disabled={loadingState === 'disconnecting'}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingState === 'disconnecting' ? (
                  <>
                    <div className={`animate-spin rounded-full h-4 w-4 border-2 border-t-transparent ${
                      isDark ? 'border-gray-400' : 'border-gray-600'
                    }`}></div>
                    Desconectando...
                  </>
                ) : (
                  <>
                    <HiXCircle className="h-4 w-4" />
                    Desconectar Cuenta
                  </>
                )}
              </button>

              <a
                href="https://www.mercadolibre.com.ar/publicaciones/listado"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <HiExternalLink className="h-4 w-4" />
                Ver en MercadoLibre
              </a>
            </div>
          </>
        ) : (
          <>
            {/* Not Connected */}
            <div className={`rounded-lg p-4 mb-4 text-center ${
              isDark
                ? 'bg-gray-900/50 border border-gray-700'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <HiXCircle className={`h-12 w-12 mx-auto mb-3 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h4 className={`text-sm font-semibold mb-2 ${
                isDark ? 'text-gray-200' : 'text-gray-900'
              }`}>
                No Conectado
              </h4>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Conecta tu cuenta de MercadoLibre para comenzar a publicar propiedades automáticamente
              </p>
            </div>

            <button
              onClick={handleConnect}
              disabled={loadingState === 'connecting'}
              className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                isDark
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loadingState === 'connecting' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Conectando...
                </>
              ) : (
                <>
                  <HiShoppingCart className="h-5 w-5" />
                  Conectar con MercadoLibre
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
