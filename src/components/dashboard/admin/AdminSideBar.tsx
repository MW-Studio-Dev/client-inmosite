// components/admin/AdminSidebar.tsx - Versión mejorada para modo claro y oscuro
'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HiX, HiQuestionMarkCircle } from 'react-icons/hi'
import { useRouter, usePathname } from 'next/navigation'
import type { MenuItem } from '@/types/dashboard'
import { useDashboardTheme } from '@/context/DashboardThemeContext'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  menuItems: MenuItem[]
  bottomMenuItems: MenuItem[]
  user?: any
  company?: any
}

export function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  menuItems,
  bottomMenuItems,
  user,
  company
}: AdminSidebarProps) {
  const { theme } = useDashboardTheme()
  const isDark = theme === 'dark'
  const router = useRouter()
  const pathname = usePathname()
  const [error, setError] = React.useState<string | null>(null)
  const isMounted = React.useRef(false)
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Error boundary fallback
  if (error) {
    return (
      <div className={`w-72 p-4 ${isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border-r`}>
        <div className={isDark ? 'text-red-100' : 'text-red-800'}>
          <h3 className="font-semibold mb-2">Error en el Sidebar</h3>
          <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-600'}`}>{error}</p>
          <button
            onClick={() => setError(null)}
            className={`mt-2 px-3 py-1 rounded text-sm ${isDark ? 'bg-red-800 text-red-100 hover:bg-red-700' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Función unificada para renderizar el contenido del sidebar
  const renderSidebarContent = () => (
    <div
      ref={sidebarRef}
      className={`flex grow flex-col transition-colors duration-300 ${isDark
        ? 'bg-gray-900'
        : 'bg-white shadow-xl'
        }`}
    >
      {/* Header con logo */}
      <div className={`flex h-16 shrink-0 items-center justify-center px-6 transition-colors duration-300 ${isCollapsed ? 'px-2' : ''}`}>
        {isCollapsed ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute z-50 flex items-center justify-center translate-x-9" style={{ width: '140px', height: '140px' }}>
              <Image
                src={isDark ? "/logo.png" : "/logo_white.png"}
                alt="InmoSite"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="140px"
              />
            </div>
          </div>
        ) : (
          // 1. Envuelve el logo y el cartel en un nuevo div con Flexbox
          <div className="flex items-center">
            <Image
              src={isDark ? "/logo.png" : "/logo_white.png"}
              alt="InmoSite"
              width={160}
              height={120}
              priority
              className="object-contain"
            />
            {/* 2. Añade el elemento del cartel aquí */}
            <span className={`
            mt-4
            ml-4           
            text-xs         
            font-semibold   
            px-2 py-1       
            rounded-full    
            ${isDark ? 'bg-red-400 text-gray-900' : 'bg-red-600 text-white'} // Color de fondo y texto que cambia con el modo oscuro
          `}>
              BETA
            </span>
          </div>
        )}
      </div>

      {/* Navegación principal y inferior - Contenedor scrollable sin scrollbar visible */}
      <nav className="flex flex-1 flex-col min-h-0">
        <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <ul role="list" className="space-y-0.5 px-2 pb-4">
            {menuItems.map((item) => (
              <SidebarItem key={item.href} item={item} pathname={pathname} isCollapsed={isCollapsed} isDark={isDark} router={router} />
            ))}
          </ul>
        </div>
        <div className={`shrink-0 border-t py-3 ${isDark
          ? 'border-gray-700'
          : 'border-gray-200'
          }`}>
          <ul role="list" className="space-y-1 px-2">
            {bottomMenuItems.map((item) => (
              <SidebarItem key={item.href} item={item} pathname={pathname} isCollapsed={isCollapsed} isDark={isDark} router={router} />
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className={`flex shrink-0 items-center justify-center py-3 px-6 transition-colors duration-300 border-t ${isDark
        ? 'border-gray-700 bg-gray-800'
        : 'border-gray-200 bg-gray-50'
        }`}>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          {!isCollapsed && <p className={`text-xs font-medium ${isDark
            ? 'text-gray-400'
            : 'text-gray-600'
            }`}>© 2025 InmoSite</p>}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Sidebar para móvil */}
      {isOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed inset-0 flex">
            <div className="relative flex w-full max-w-[85vw] sm:max-w-xs flex-1">
              <div
                className="w-full h-full"
                onError={(e) => {
                  console.error('Mobile sidebar render error:', e)
                  if (isMounted.current) {
                    setError('Error al renderizar el sidebar móvil')
                  }
                }}
              >
                {renderSidebarContent()}
              </div>
              <button
                type="button"
                className={`absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 z-10 ${isDark
                  ? 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500'
                  : 'bg-white text-gray-800 hover:bg-gray-100 focus:ring-gray-300 border border-gray-300'
                  }`}
                onClick={onClose}
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar para escritorio */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
        onError={(e) => {
          console.error('Desktop sidebar render error:', e)
          if (isMounted.current) {
            setError('Error al renderizar el sidebar de escritorio')
          }
        }}
      >
        {renderSidebarContent()}
      </div>
    </>
  )
}

// Componente para un ítem del sidebar (incluyendo sub-ítems)
function SidebarItem({ item, pathname, isCollapsed, isDark, router }: {
  item: MenuItem
  pathname: string
  isCollapsed: boolean
  isDark: boolean
  router: ReturnType<typeof useRouter>
}) {
  // Safety checks for item properties
  if (!item || !item.name || !item.href) {
    console.warn('Invalid sidebar item:', item)
    return null
  }

  const hasSubItems = item.subItems && item.subItems.length > 0
  const isSubItemActive = hasSubItems && item.subItems?.some(subItem => pathname.startsWith(subItem.href))
  const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href) || isSubItemActive

  const [isOpen, setIsOpen] = React.useState(isSubItemActive)
  const itemRef = React.useRef<HTMLLIElement>(null)

  // Ensure component is mounted before performing state updates
  const isMounted = React.useRef(false)
  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault()
      if (isMounted.current) {
        setIsOpen(!isOpen)
      }
    } else {
      try {
        router.push(item.href)
      } catch (error) {
        console.error('Navigation error:', error)
      }
    }
  }

  // Safety check for icon component
  const IconComponent = React.useMemo(() => {
    if (!item.icon) {
      console.warn(`Missing icon for menu item: ${item.name}`)
      return HiQuestionMarkCircle
    }

    // Check if icon is a valid React component
    if (typeof item.icon !== 'function') {
      console.warn(`Invalid icon for menu item: ${item.name}`, item.icon)
      return HiQuestionMarkCircle
    }

    return item.icon
  }, [item.icon, item.name])

  const itemClasses = `
    group flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200
    ${isCollapsed ? 'justify-center px-2 py-3' : ''}
    ${isActive
      ? isDark
        ? 'bg-gray-800 text-white shadow-sm border-l-4 border-red-500'
        : 'bg-red-50 text-red-700 shadow-sm border-l-4 border-red-700'
      : isDark
        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }
  `

  return (
    <li ref={itemRef}>
      <div onClick={handleClick} className={itemClasses} title={isCollapsed ? item.name : undefined}>
        <IconComponent className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive
          ? isDark ? 'text-red-500' : 'text-red-700'
          : isDark
            ? 'text-gray-400 group-hover:text-gray-300'
            : 'text-gray-500 group-hover:text-red-700'
          }`} />

        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{item.name}</span>
            {item.badge && (
              <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${isActive
                ? isDark
                  ? 'bg-red-900 text-red-100'
                  : 'bg-red-100 text-red-700'
                : isDark
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
                }`}>
                {item.badge}
              </span>
            )}
            {hasSubItems && (
              <svg className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                } ${isActive ? (isDark ? 'text-red-500' : 'text-red-700') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </>
        )}
      </div>

      {hasSubItems && !isCollapsed && (
        <ul className={`mt-2 ml-4 sm:ml-9 space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          {item.subItems?.map((subItem) => {
            const isSubActive = pathname.startsWith(subItem.href)
            return (
              <li key={subItem.href}>
                <Link href={subItem.href} className={`flex w-full items-center rounded-lg px-3 py-2 text-xs sm:text-sm transition-all duration-200 mx-1 ${isSubActive
                  ? isDark
                    ? 'bg-gray-800 font-medium text-red-500 shadow-sm'
                    : 'bg-red-50 font-medium text-red-700 shadow-sm'
                  : isDark
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 rounded-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg'
                  }`}>
                  <span className="flex-1">{subItem.name}</span>
                  {subItem.badge && (
                    <span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs font-medium shrink-0 ${isSubActive
                      ? isDark
                        ? 'bg-red-900 text-red-100'
                        : 'bg-red-100 text-red-700'
                      : isDark
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                      }`}>
                      {subItem.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
