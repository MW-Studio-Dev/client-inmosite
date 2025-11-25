'use client'

import React from 'react'
import {
  HiTrendingUp,
  HiTrendingDown,
  HiChartBar,
  HiCurrencyDollar,
  HiHome,
  HiUsers,
  HiDocumentText,
  HiClock
} from 'react-icons/hi'

interface StatisticsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  progress?: {
    current: number
    total: number
    color?: string
  }
  variant?: 'default' | 'glass' | 'neumorphic' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  children
}) => {
  const getProgressPercentage = () => {
    if (!progress) return 0
    return Math.min((progress.current / progress.total) * 100, 100)
  }

  const getProgressColor = () => {
    const percentage = getProgressPercentage()
    if (percentage >= 90) return 'var(--color-error)'
    if (percentage >= 70) return 'var(--color-warning)'
    return 'var(--color-success)'
  }

  const getCardClasses = () => {
    const baseClasses = 'relative overflow-hidden transition-all duration-300 cursor-pointer'

    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }

    const variantClasses = {
      default: 'card-premium',
      glass: 'card-glass glass-reflection',
      neumorphic: 'neumorphic',
      gradient: 'relative bg-gradient-to-br from-red-500 to-red-700 text-white'
    }

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  }

  const getIconClasses = () => {
    const baseClasses = 'flex items-center justify-center rounded-2xl transition-all duration-300'

    if (variant === 'gradient') {
      return `${baseClasses} bg-white/20 backdrop-blur-sm text-white`
    }

    return `${baseClasses} bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg`
  }

  const getIconSize = () => {
    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    }
    return sizes[size]
  }

  const getTextColorClasses = () => {
    return variant === 'gradient' ? 'text-white' : 'text-gray-900'
  }

  const getSubtitleColorClasses = () => {
    return variant === 'gradient' ? 'text-red-100' : 'text-gray-500'
  }

  return (
    <div
      className={getCardClasses()}
      onClick={onClick}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header con icono y titulo */}
        <div className="flex items-start justify-between mb-4">
          <div className={getIconClasses()}>
            <div className={getIconSize()}>
              {icon}
            </div>
          </div>

          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
              trend.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {trend.isPositive ? (
                <HiTrendingUp className="w-4 h-4" />
              ) : (
                <HiTrendingDown className="w-4 h-4" />
              )}
              {trend.value}%
            </div>
          )}
        </div>

        {/* Valor principal */}
        <div className="mb-2">
          <h3 className={`text-2xl font-bold ${getTextColorClasses()} mb-1`}>
            {value}
          </h3>
          <p className={`text-sm font-medium ${getTextColorClasses()}`}>
            {title}
          </p>
        </div>

        {/* Subtitulo */}
        {subtitle && (
          <p className={`text-sm ${getSubtitleColorClasses()}`}>
            {subtitle}
          </p>
        )}

        {/* Barra de progreso */}
        {progress && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-gray-500">Progreso</span>
              <span className="font-bold text-gray-700">{getProgressPercentage().toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: progress.color || getProgressColor()
                }}
              >
                {/* Efecto de shimmer en la barra de progreso */}
                <div className="absolute inset-0 animate-shimmer"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{progress.current}</span>
              <span>{progress.total}</span>
            </div>
          </div>
        )}

        {/* Trend label */}
        {trend && trend.label && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">{trend.label}</span>
          </div>
        )}

        {/* Contenido adicional */}
        {children && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {children}
          </div>
        )}
      </div>

      {/* Efecto decorativo de fondo */}
      {variant === 'default' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      )}
    </div>
  )
}

// Componentes preconfigurados para casos de uso comunes
export const PropertiesStatCard: React.FC<Omit<StatisticsCardProps, 'icon'>> = (props) => (
  <StatisticsCard
    {...props}
    icon={<HiHome className="w-6 h-6" />}
  />
)

export const RevenueStatCard: React.FC<Omit<StatisticsCardProps, 'icon'>> = (props) => (
  <StatisticsCard
    {...props}
    icon={<HiCurrencyDollar className="w-6 h-6" />}
  />
)

export const UsersStatCard: React.FC<Omit<StatisticsCardProps, 'icon'>> = (props) => (
  <StatisticsCard
    {...props}
    icon={<HiUsers className="w-6 h-6" />}
  />
)

export const DocumentsStatCard: React.FC<Omit<StatisticsCardProps, 'icon'>> = (props) => (
  <StatisticsCard
    {...props}
    icon={<HiDocumentText className="w-6 h-6" />}
  />
)

export const VisitsStatCard: React.FC<Omit<StatisticsCardProps, 'icon'>> = (props) => (
  <StatisticsCard
    {...props}
    icon={<HiChartBar className="w-6 h-6" />}
  />
)

export const TimeStatCard: React.FC<Omit<StatisticsCardProps, 'icon'>> = (props) => (
  <StatisticsCard
    {...props}
    icon={<HiClock className="w-6 h-6" />}
  />
)

export default StatisticsCard