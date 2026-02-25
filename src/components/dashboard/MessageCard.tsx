'use client'

import React from 'react'
import {
  HiMail,
  HiPhone,
  HiChevronRight,
  HiClock,
  HiUser
} from 'react-icons/hi'
import { HiChatBubbleLeftRight } from 'react-icons/hi2'
interface Message {
  id: string
  name: string
  message: string
  time: string
  type: 'email' | 'chat' | 'call'
  read: boolean
  avatar?: string
}

interface MessageCardProps {
  messages?: Message[]
  onMessageClick?: (messageId: string) => void
  isDark?: boolean
}

export const MessageCard: React.FC<MessageCardProps> = ({
  messages = mockMessages,
  onMessageClick,
  isDark = false
}) => {
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <HiMail className="w-4 h-4" />
      case 'chat':
        return <HiChatBubbleLeftRight className="w-4 h-4" />
      case 'call':
        return <HiPhone className="w-4 h-4" />
      default:
        return <HiMail className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-600'
      case 'chat':
        return isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-600'
      case 'call':
        return isDark ? 'bg-purple-900/20 text-purple-400' : 'bg-purple-100 text-purple-600'
      default:
        return isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'email':
        return isDark ? 'bg-blue-900/10 border-blue-800' : 'bg-blue-50 border-blue-200'
      case 'chat':
        return isDark ? 'bg-green-900/10 border-green-800' : 'bg-green-50 border-green-200'
      case 'call':
        return isDark ? 'bg-purple-900/10 border-purple-800' : 'bg-purple-50 border-purple-200'
      default:
        return isDark ? 'bg-gray-900/10 border-gray-700' : 'bg-gray-50 border-gray-200'
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-sm">
                <HiMail className="w-5 h-5" />
              </div>
              {unreadCount > 0 && (
                <div className={`absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 ${
                  isDark ? 'border-gray-800' : 'border-white'
                }`}>
                  {unreadCount}
                </div>
              )}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Mensajes Recientes
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {unreadCount} no leído{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard/messages'}
            className={`text-sm font-medium flex items-center gap-1 transition-colors ${
              isDark
                ? 'text-indigo-400 hover:text-indigo-300'
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            Ver todos
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className={`divide-y max-h-96 overflow-y-auto ${
          isDark ? 'divide-gray-700' : 'divide-gray-200'
        }`}>
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => onMessageClick?.(message.id)}
            className={`
              p-4 transition-colors cursor-pointer
              ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}
              ${!message.read ? (isDark ? 'bg-indigo-900/10' : 'bg-indigo-50/50') : ''}
            `}
          >
            <div className="flex items-start gap-3">
              {/* Message Type Icon */}
              <div className={`p-2 rounded-lg ${getTypeColor(message.type)}`}>
                {getMessageIcon(message.type)}
              </div>

              {/* Avatar */}
              <div className="relative">
                {message.avatar ? (
                  <img
                    src={message.avatar}
                    alt={message.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <HiUser className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                )}
                {!message.read && (
                  <div className={`absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 ${
                    isDark ? 'border-gray-800' : 'border-white'
                  }`}></div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {message.name}
                  </p>
                  <div className={`flex items-center gap-1 text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <HiClock className="w-3 h-3" />
                    {message.time}
                  </div>
                </div>
                <p className={`text-sm line-clamp-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {message.message}
                </p>
                <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getTypeBg(message.type)}`}>
                  {getMessageIcon(message.type)}
                  <span className="font-medium">
                    {message.type === 'email' ? 'Email' : message.type === 'chat' ? 'Chat' : 'Llamada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${
          isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
        <div className="flex items-center justify-between">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-medium">{messages.length}</span> mensajes totales
          </div>
          <button
            onClick={() => window.location.href = '/dashboard/compose'}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <HiMail className="w-4 h-4" />
            Nuevo Mensaje
          </button>
        </div>
      </div>
    </div>
  )
}

// Mock data para demostración
const mockMessages: Message[] = [
  {
    id: '1',
    name: 'María González',
    message: 'Hola, estoy interesada en el apartamento de 2 habitaciones en el centro. ¿Podrían darme más información sobre los amenities?',
    time: 'hace 5 min',
    type: 'email',
    read: false,
    avatar: undefined
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    message: 'Me gustaría agendar una visita para la casa en la calle Principal. Estoy disponible este fin de semana.',
    time: 'hace 1 hora',
    type: 'chat',
    read: false
  },
  {
    id: '3',
    name: 'Ana Martínez',
    message: 'Gracias por la información. Ya he revisado los documentos y todo parece estar en orden.',
    time: 'hace 3 horas',
    type: 'call',
    read: true,
    avatar: undefined
  },
  {
    id: '4',
    name: 'Pedro López',
    message: '¿Cuál es el precio final de la propiedad en la avenida Nueva? Incluyendo todos los costos.',
    time: 'hace 5 horas',
    type: 'email',
    read: true
  },
  {
    id: '5',
    name: 'Laura Silva',
    message: 'Excelente servicio de atención al cliente. Muy profesional y rápido.',
    time: 'ayer',
    type: 'chat',
    read: true
  }
]

export default MessageCard
