'use client';

import React, { useState, useEffect } from 'react';
import { Notification } from '@/types/notifications';
import { useNotifications } from '@/hooks/useNotifications';
import { X, Bell, BellRing } from 'lucide-react';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onMarkAsRead
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto cerrar después de 8 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Esperar a la animación
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const priorityColors = {
    low: 'border-blue-400',
    medium: 'border-green-400',
    high: 'border-yellow-400',
    urgent: 'border-red-400'
  };

  const priorityBgColors = {
    low: 'bg-blue-50',
    medium: 'bg-green-50',
    high: 'bg-yellow-50',
    urgent: 'bg-red-50'
  };

  const handleActionClick = () => {
    if (notification.action_url) {
      onMarkAsRead(notification.id);
      window.location.href = notification.action_url;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} d`;
  };

  return (
    <div
      className={`
        relative max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4
        ${priorityColors[notification.priority]} ${priorityBgColors[notification.priority]}
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        pointer-events-auto
      `}
    >
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>

      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {notification.priority === 'urgent' ? (
              <BellRing className="h-6 w-6 text-red-500" />
            ) : (
              <Bell className="h-6 w-6 text-gray-500" />
            )}
          </div>

          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              {notification.message}
            </p>

            {notification.action_url && (
              <button
                onClick={handleActionClick}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver detalle →
              </button>
            )}

            <p className="mt-2 text-xs text-gray-400">
              {formatTimeAgo(notification.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente contenedor de notificaciones
export const NotificationContainer: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast
            notification={notification}
            onClose={() => {}}
            onMarkAsRead={markAsRead}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;