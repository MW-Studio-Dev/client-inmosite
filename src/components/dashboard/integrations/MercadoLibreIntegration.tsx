'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/api';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { useToast } from '@/components/common/Toast';
import MercadoLibreErrorModal from './MercadoLibreErrorModal';
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

interface MeliApiError {
  success: false;
  message: string;
  error_code: string;
  errors: {
    action: string;
  };
  data: null;
  timestamp: string;
  request_id: string;
}

type LoadingState = 'idle' | 'loading' | 'connecting' | 'disconnecting';

const MercadoLibreIntegration: React.FC = () => {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const { showSuccess, showError } = useToast();

  const [authStatus, setAuthStatus] = useState<MeliAuthStatus | null>(null);
  const [stats, setStats] = useState<MeliStats | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [showStats, setShowStats] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lastError, setLastError] = useState<MeliApiError | null>(null);

  useEffect(() => {
    loadAuthStatus();
  }, []);

  useEffect(() => {
    if (authStatus?.connected) {
      loadStats();
    }
  }, [authStatus?.connected]);

  const handleApiError = (error: any) => {
    // Verificar si es un error de token expirado de MercadoLibre
    if (error?.response?.data?.error_code === 'MELI_TOKEN_EXPIRED') {
      setLastError(error.response.data);
      setShowErrorModal(true);
      return;
    }

    // Para otros errores, mostrar el toast normal
    const errorMsg = error?.response?.data?.message || error?.message || 'Error desconocido';
    showError(errorMsg);
  };

  const loadAuthStatus = async () => {
    setLoadingState('loading');
    try {
      const response = await axiosInstance.get('/integrations/mercadolibre/auth/');
      setAuthStatus(response.data.data);
    } catch (error: any) {
      console.error('Error loading MercadoLibre auth status:', error);
      handleApiError(error);
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
      handleApiError(error);
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
      handleApiError(error);
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
      handleApiError(error);
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

  const handleModalReconnect = async () => {
    setShowErrorModal(false);
    // Usar la misma lógica que handleConnect
    await handleConnect();
  };

  if (loadingState === 'loading') {
    return (
      <div className={`rounded-xl border p-6 ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`rounded-xl border p-6 ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              MercadoLibre Integration
            </h2>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Publica tus propiedades en MercadoLibre
            </p>
          </div>
          <button
            onClick={handleRefreshStatus}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Actualizar estado"
          >
            <HiRefresh className="w-5 h-5" />
          </button>
        </div>

        {!authStatus?.connected ? (
          <div className="text-center py-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <HiShoppingCart className={`w-8 h-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Conecta tu cuenta de MercadoLibre
            </h3>
            <p className={`text-sm mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Publica tus propiedades automáticamente en la plataforma de MercadoLibre
            </p>
            <button
              onClick={handleConnect}
              disabled={loadingState === 'connecting'}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingState === 'connecting' ? 'Conectando...' : 'Conectar Cuenta'}
            </button>
          </div>
        ) : (
          <div>
            <div className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
              isDark ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
            }`}>
              <HiCheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Conectado exitosamente</p>
                <p className="text-sm text-green-700">
                  Usuario: {authStatus.auth?.meli_nickname}
                </p>
              </div>
            </div>

            {stats && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Estadísticas de Publicación
                  </h4>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className={`text-sm ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    } hover:underline`}
                  >
                    {showStats ? 'Ocultar' : 'Mostrar'} detalles
                  </button>
                </div>

                {showStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="text-2xl font-bold text-blue-600">{stats.total_synced}</div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Total Sincronizados
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="text-2xl font-bold text-green-600">{stats.active_listings}</div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Activos
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="text-2xl font-bold text-yellow-600">{stats.paused_listings}</div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Pausados
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="text-2xl font-bold text-red-600">{stats.error_listings}</div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Errores
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDisconnect}
                disabled={loadingState === 'disconnecting'}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  loadingState === 'disconnecting'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } ${
                  isDark
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loadingState === 'disconnecting' ? 'Desconectando...' : 'Desconectar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para errores de MercadoLibre */}
      <MercadoLibreErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={lastError}
        onReconnect={handleModalReconnect}
      />
    </>
  );
};

export default MercadoLibreIntegration;
