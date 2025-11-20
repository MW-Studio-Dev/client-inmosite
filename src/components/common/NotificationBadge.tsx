'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, X, Check, ExternalLink, MessageSquare, Home, AlertTriangle } from 'lucide-react';
import { Notification } from '@/types/notifications';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

interface NotificationBadgeProps {
  className?: string;
  onClick?: () => void;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  className = '',
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, connectionStatus, notifications, markAsRead, markAllAsRead } = useNotifications();
  const { theme } = useDashboardTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  const statusColors = {
    connected: 'bg-green-500',
    disconnected: 'bg-gray-400',
    error: 'bg-red-500'
  };

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    // Marcar como leída
    await markAsRead(notification.id);

    // Navegar a la URL de acción si existe
    if (notification.action_url) {
      window.location.href = notification.action_url;
    } else if (notification.data?.inquiry_id) {
      // Si es una consulta, navegar al detalle de la consulta
      window.location.href = `/admin/inquiries/${notification.data.inquiry_id}`;
    }

    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'inquiry_received':
      case 'inquiry_assigned':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'property_viewed':
        return <Home className="h-4 w-4 text-green-500" />;
      case 'system_alert':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = isDark ? {
      urgent: 'border-red-600 bg-red-900/30',
      high: 'border-orange-600 bg-orange-900/30',
      medium: 'border-yellow-600 bg-yellow-900/30',
      low: 'border-gray-600 bg-gray-800/50',
      default: 'border-gray-600 bg-gray-800/50'
    } : {
      urgent: 'border-red-500 bg-red-50',
      high: 'border-orange-500 bg-orange-50',
      medium: 'border-yellow-500 bg-yellow-50',
      low: 'border-gray-300 bg-gray-50',
      default: 'border-gray-300 bg-white'
    };

    return colors[priority as keyof typeof colors] || colors.default;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} d`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'text-gray-300 hover:bg-gray-800'
            : 'text-gray-600 hover:bg-gray-100'
        } ${className}`}
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />

        {/* Badge de contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Indicador de conexión */}
        <span
          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${statusColors[connectionStatus]}`}
          title={`Conexión: ${connectionStatus}`}
        />
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-96 rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          {/* Header del dropdown */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDark
              ? 'border-gray-700'
              : 'border-gray-200'
          }`}>
            <h3 className={`text-sm font-semibold ${
              isDark
                ? 'text-gray-100'
                : 'text-gray-900'
            }`}>
              Notificaciones {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className={`text-xs flex items-center gap-1 ${
                    isDark
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  <Check className="h-3 w-3" />
                  Marcar todas como leídas
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`p-8 text-center ${
                isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}>
                <Bell className={`h-8 w-8 mx-auto mb-2 ${
                  isDark
                    ? 'text-gray-600'
                    : 'text-gray-300'
                }`} />
                <p className="text-sm">No tienes notificaciones nuevas</p>
              </div>
            ) : (
              <div className={`divide-y ${
                isDark
                  ? 'divide-gray-700'
                  : 'divide-gray-100'
              }`}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer border-l-4 transition-colors ${
                      isDark
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    } ${getPriorityColor(notification.priority)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.notification_type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              isDark
                                ? 'text-gray-100'
                                : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-sm mt-1 line-clamp-2 ${
                              isDark
                                ? 'text-gray-300'
                                : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>

                            {/* Mostrar información adicional si es una consulta */}
                            {notification.data?.inquiry_id && (
                              <div className={`mt-2 text-xs flex items-center gap-1 ${
                                isDark
                                  ? 'text-blue-400'
                                  : 'text-blue-600'
                              }`}>
                                <ExternalLink className="h-3 w-3" />
                                Ver consulta #{notification.data.inquiry_id}
                              </div>
                            )}

                            {notification.data?.property_name && (
                              <p className={`mt-1 text-xs ${
                                isDark
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}>
                                Propiedad: {notification.data.property_name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            isDark
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}>
                            {formatTime(notification.created_at)}
                          </span>

                          {notification.action_url && (
                            <ExternalLink className={`h-3 w-3 ${
                              isDark
                                ? 'text-gray-500'
                                : 'text-gray-400'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer con enlace a todas las notificaciones */}
          {notifications.length > 0 && (
            <div className={`p-3 border-t ${
              isDark
                ? 'border-gray-700 bg-gray-700/50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <a
                href="/dashboard/notifications"
                className={`text-xs flex items-center justify-center gap-1 ${
                  isDark
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Ver todas las notificaciones
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;