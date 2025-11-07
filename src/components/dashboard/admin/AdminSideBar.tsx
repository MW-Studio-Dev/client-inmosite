// components/admin/AdminSidebar.tsx - Versión corregida
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
      <div className="w-72 bg-red-50 border-r border-red-200 p-4">
        <div className="text-red-800">
          <h3 className="font-semibold mb-2">Error en el Sidebar</h3>
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
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
      className={`flex grow flex-col overflow-y-auto bg-white shadow-sm transition-colors duration-300 dark:bg-gray-900 dark:border-r dark:border-gray-700 border-r border-gray-200`}
    >
      {/* Header con logo */}
      <div className={`flex h-16 shrink-0 items-center justify-center border-b border-gray-200 px-6 transition-colors duration-300 dark:border-gray-700 ${isCollapsed ? 'px-2' : ''}`}>
        {isCollapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <span className="font-bold text-lg text-gray-900 dark:text-white">I</span>
          </div>
        ) : (
          <Image
            src={isDark ? "/logo.png" : "/logo_white.png"}
            alt="InmoSite"
            width={120}
            height={90}
            priority
          />
        )}
      </div>

      {/* Navegación principal e inferior */}
      <nav className="flex flex-1 flex-col">
        <div className="flex-1 py-4">
          <ul role="list" className="space-y-1 px-2">
            {menuItems.map((item) => (
              <SidebarItem key={item.href} item={item} pathname={pathname} isCollapsed={isCollapsed} isDark={isDark} router={router} />
            ))}
          </ul>
        </div>
        <div className="border-t border-gray-200 py-3 dark:border-gray-700">
          <ul role="list" className="space-y-1 px-2">
            {bottomMenuItems.map((item) => (
              <SidebarItem key={item.href} item={item} pathname={pathname} isCollapsed={isCollapsed} isDark={isDark} router={router} />
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-center border-t border-gray-200 bg-gray-50 py-3 px-6 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          {!isCollapsed && <p className="text-xs font-medium text-gray-600 dark:text-gray-400">© 2025 InmoSite</p>}
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
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <button
                type="button"
                className="absolute -right-14 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <HiX className="h-6 w-6" />
              </button>
              <div
                onError={(e) => {
                  console.error('Mobile sidebar render error:', e)
                  if (isMounted.current) {
                    setError('Error al renderizar el sidebar móvil')
                  }
                }}
              >
                {renderSidebarContent()}
              </div>
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
  // Corregido: usar HTMLLIElement en lugar de HTMLDivElement
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
    group flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200
    ${isCollapsed ? 'justify-center px-2 py-3' : ''}
    ${isActive
      ? 'bg-gray-900 text-white shadow-sm dark:bg-gray-700'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
    }
  `

  return (
    <li ref={itemRef}>
      <div onClick={handleClick} className={itemClasses} title={isCollapsed ? item.name : undefined}>
        <IconComponent className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`} />
        
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{item.name}</span>
            {item.badge && <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-600">{item.badge}</span>}
            {hasSubItems && <svg className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
          </>
        )}
      </div>

      {hasSubItems && !isCollapsed && (
        <ul className={`mt-1 ml-9 space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          {item.subItems?.map((subItem) => {
            const isSubActive = pathname.startsWith(subItem.href)
            return (
              <li key={subItem.href}>
                <Link href={subItem.href} className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${isSubActive ? 'bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'}`}>
                  <span className="flex-1">{subItem.name}</span>
                  {subItem.badge && <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${isSubActive ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>{subItem.badge}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}