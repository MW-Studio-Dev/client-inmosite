export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'inquiry_received' | 'inquiry_assigned' | 'property_viewed' | 'system_alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  data: Record<string, any>;
  created_at: string;
  unread_count?: number;
}

export interface WebSocketMessage {
  type: 'notification' | 'unread_count' | 'notification_read' | 'company_inquiry';
  [key: string]: any;
}

export interface NotificationOptions {
  wsUrl?: string;
  onNotification?: (notification: Notification) => void;
  onUnreadCountChange?: (count: number) => void;
  onConnectionChange?: (status: 'connected' | 'disconnected' | 'error') => void;
  autoReconnect?: boolean;
  soundEnabled?: boolean;
  maxNotifications?: number;
}

export interface NotificationPreference {
  email_notifications: boolean;
  push_notifications: boolean;
  websocket_notifications: boolean;
  inquiry_notifications: boolean;
  property_notifications: boolean;
  lead_notifications: boolean;
  system_notifications: boolean;
}