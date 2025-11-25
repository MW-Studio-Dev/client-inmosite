'use client'

import React from 'react'
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'info'
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
  isDark?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
  onClick,
  isDark = false
}) => {
  const getColorClasses = () => {
    const colors = {
      primary: {
        bg: isDark ? 'bg-red-900/20' : 'bg-red-50',
        iconBg: isDark ? 'bg-red-600' : 'bg-red-500',
        text: isDark ? 'text-red-400' : 'text-red-600',
        border: isDark ? 'border-red-800' : 'border-red-200'
      },
      success: {
        bg: isDark ? 'bg-green-900/20' : 'bg-green-50',
        iconBg: isDark ? 'bg-green-600' : 'bg-green-500',
        text: isDark ? 'text-green-400' : 'text-green-600',
        border: isDark ? 'border-green-800' : 'border-green-200'
      },
      warning: {
        bg: isDark ? 'bg-yellow-900/20' : 'bg-yellow-50',
        iconBg: isDark ? 'bg-yellow-600' : 'bg-yellow-500',
        text: isDark ? 'text-yellow-400' : 'text-yellow-600',
        border: isDark ? 'border-yellow-800' : 'border-yellow-200'
      },
      info: {
        bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
        iconBg: isDark ? 'bg-blue-600' : 'bg-blue-500',
        text: isDark ? 'text-blue-400' : 'text-blue-600',
        border: isDark ? 'border-blue-800' : 'border-blue-200'
      }
    }
    return colors[color]
  }

  const colorClasses = getColorClasses()

  return (
    <div
      onClick={onClick}
      className={`
        relative p-6 rounded-xl border transition-all duration-200 cursor-pointer
        ${colorClasses.bg} ${colorClasses.border}
        hover:shadow-md hover:scale-[1.02] ${isDark ? 'dark:hover:shadow-lg' : 'hover:shadow-lg'}
      `}
    >
      {/* Trend indicator */}
      {trend && (
        <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
          trend.isPositive
            ? `${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`
            : `${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`
        }`}>
          {trend.isPositive ? (
            <HiTrendingUp className="w-3 h-3" />
          ) : (
            <HiTrendingDown className="w-3 h-3" />
          )}
          {trend.value}%
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-xl ${colorClasses.iconBg} text-white shadow-sm`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatCard