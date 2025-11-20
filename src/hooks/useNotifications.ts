'use client';

import { useState, useEffect, useRef } from 'react';
import { Notification, WebSocketMessage, NotificationOptions } from '@/types/notifications';
import axiosInstance from '@/lib/api';

// Singleton WebSocket para evitar múltiples conexiones
class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private subscribers = new Set<(message: WebSocketMessage) => void>();
  private statusSubscribers = new Set<(status: 'connected' | 'disconnected' | 'error') => void>();
  private connectionCount = 0;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private wsUrl: string = '';

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  setUrl(url: string) {
    this.wsUrl = url;
  }

  subscribe(callback: (message: WebSocketMessage) => void) {
    this.subscribers.add(callback);
    this.connectionCount++;

    if (this.connectionCount === 1 && !this.ws) {
      this.connect();
    }

    return () => {
      this.subscribers.delete(callback);
      this.connectionCount--;

      if (this.connectionCount === 0 && this.ws) {
        this.disconnect();
      }
    };
  }

  subscribeToStatus(callback: (status: 'connected' | 'disconnected' | 'error') => void) {
    this.statusSubscribers.add(callback);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      callback('connected');
    }

    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  private connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      let wsUrl = this.wsUrl;

      // Obtener token de autenticación
      let authToken = '';
      try {
        authToken = localStorage.getItem('access_token') || '';
      } catch (error) {
        console.warn('⚠️ No se pudo obtener token:', error);
      }

      if (authToken) {
        const separator = wsUrl.includes('?') ? '&' : '?';
        wsUrl = `${wsUrl}${separator}token=${authToken}`;
      }

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.notifyStatus('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.subscribers.forEach(callback => callback(message));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        this.ws = null;
        this.notifyStatus('disconnected');

        // Reconexión automática
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
          }, delay);
        }
      };

      this.ws.onerror = () => {
        this.notifyStatus('error');
      };

    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      this.notifyStatus('error');
    }
  }

  private disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'error') {
    this.statusSubscribers.forEach(callback => callback(status));
  }
}

export function useNotifications(options: NotificationOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

  const wsManager = useRef(WebSocketManager.getInstance());
  const wsUrl = useRef(
    process.env.NODE_ENV === 'production'
      ? `wss://${window.location.host}/ws/notifications/`
      : `ws://localhost:8000/ws/notifications/`
  );
  const maxNotifications = options.maxNotifications || 50;

  useEffect(() => {
    // Configurar URL del WebSocket
    wsManager.current.setUrl(wsUrl.current);

    // Suscribirse a mensajes
    const unsubscribeMessages = wsManager.current.subscribe((message: WebSocketMessage) => {
      switch (message.type) {
        case 'notification':
          setNotifications(prev => {
            const notification = message as unknown as Notification;
            const exists = prev.some(n => n.id === notification.id);
            if (!exists) {
              const updated = [notification, ...prev].slice(0, maxNotifications);
              if (notification.unread_count !== undefined) {
                setUnreadCount(notification.unread_count);
              }
              return updated;
            }
            return prev;
          });
          break;
        case 'unread_count':
          setUnreadCount(message.count || 0);
          options.onUnreadCountChange?.(message.count || 0);
          break;
        case 'notification_read':
          setUnreadCount(message.unread_count || 0);
          options.onUnreadCountChange?.(message.unread_count || 0);
          break;
      }
    });

    // Suscribirse a estados
    const unsubscribeStatus = wsManager.current.subscribeToStatus((status) => {
      setConnectionStatus(status);
      setIsConnected(status === 'connected');
      options.onConnectionChange?.(status);
    });

    // Cleanup
    return () => {
      unsubscribeMessages();
      unsubscribeStatus();
    };
  }, []); // Sin dependencias para evitar bucles

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await axiosInstance.post('/notifications/mark-read/', {
        notification_id: notificationId
      });

      if (response.status === 200) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.post('/notifications/mark-all-read/');

      if (response.status === 200) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
    }
  };

  return {
    isConnected,
    connectionStatus,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead
  };
}

// Función auxiliar para obtener CSRF token
function getCSRFToken(): string {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
  return csrfCookie ? csrfCookie.split('=')[1] : '';
}

// Función para reproducir sonido de notificación
function playNotificationSound(priority: string) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Frecuencia según prioridad
    const frequencies = {
      'urgent': 1000,
      'high': 800,
      'medium': 600,
      'low': 400
    };

    oscillator.frequency.value = frequencies[priority as keyof typeof frequencies] || 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.log('No se pudo reproducir sonido de notificación');
  }
}