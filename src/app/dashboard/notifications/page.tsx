'use client'

import { useState, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
// import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader'
import {
  Bell,
  BellRing,
  MessageSquare,
  Home,
  AlertTriangle,
  Check,
  X,
  ExternalLink,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react'
import { Notification } from '@/types/notifications'

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    isConnected
  } = useNotifications()

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const statusColors = {
    connected: 'bg-green-500',
    disconnected: 'bg-gray-400',
    error: 'bg-red-500'
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return true // Todas las notificaciones en el hook son no leídas
    if (filter === 'read') return false // No tenemos notificaciones leídas en el estado actual
    return true
  })

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification)
    await markAsRead(notification.id)

    // Navegar a la URL de acción si existe
    if (notification.action_url) {
      window.location.href = notification.action_url
    } else if (notification.data?.inquiry_id) {
      window.location.href = `/dashboard/inquiries/${notification.data.inquiry_id}`
    }
  }

  const handleMarkAllAsRead = async () => {
    setIsLoading(true)
    try {
      await markAllAsRead()
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'inquiry_received':
      case 'inquiry_assigned':
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case 'property_viewed':
        return <Home className="h-5 w-5 text-green-500" />
      case 'system_alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500 bg-red-50'
      case 'high':
        return 'border-orange-500 bg-orange-50'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-gray-300 bg-gray-50'
      default:
        return 'border-gray-300 bg-white'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
    return `Hace ${Math.floor(diffInMinutes / 1440)} d`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
        <p className="mt-2 text-gray-600">Mantente al día con todas las actividades importantes</p>
      </div>

      {/* Controles y estado */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Estado de conexión */}
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${statusColors[connectionStatus]}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>

            {/* Contador de no leídas */}
            {unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-900">
                  {unreadCount} no leídas
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filtros */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'unread'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                No leídas
              </button>
            </div>

            {/* Acciones */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'No hay notificaciones no leídas' : 'No hay notificaciones'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {isConnected
                ? 'Las notificaciones nuevas aparecerán aquí automáticamente.'
                : 'Conéctate para recibir notificaciones en tiempo real.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${getPriorityColor(
                  notification.priority
                )}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.notification_type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {notification.priority === 'urgent' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Urgente
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Información adicional */}
                        <div className="space-y-1">
                          {notification.data?.inquiry_id && (
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                              <ExternalLink className="h-3 w-3" />
                              <span>Consulta #{notification.data.inquiry_id}</span>
                            </div>
                          )}

                          {notification.data?.property_name && (
                            <p className="text-xs text-gray-500">
                              Propiedad: {notification.data.property_name}
                            </p>
                          )}

                          {notification.data?.client_name && (
                            <p className="text-xs text-gray-500">
                              Cliente: {notification.data.client_name}
                            </p>
                          )}
                        </div>

                        {/* Acción */}
                        {notification.action_url && (
                          <div className="mt-3">
                            <button className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                              Ver detalle
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(notification.created_at)}</span>
                        </div>
                        <span title={formatDate(notification.created_at)}>
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}