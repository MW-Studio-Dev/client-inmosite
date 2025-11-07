// components/admin/SidebarNavigation.tsx - Versión simple sin animaciones
'use client'

import { MenuItem } from '@/types/dashboard'

interface SidebarNavigationProps {
  menuItems: MenuItem[]
  pathname: string
}

export function SidebarNavigation({ menuItems, pathname }: SidebarNavigationProps) {
  return (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        const Icon = item.icon

        return (
          <div key={item.href} className="relative">
            <a
              href={item.href}
              className={`
                group flex items-center justify-between rounded-xl transition-all duration-200 relative
                px-5 py-3.5 font-medium text-sm
                ${isActive
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <div className="flex items-center space-x-4">
                <div className={`
                  flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-gray-600'
                  }
                `}>
                  {Icon && <Icon className="h-4 w-4" />}
                </div>

                <span className={`
                  font-medium transition-all duration-200
                  ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}
                `}>
                  {item.name}
                </span>
              </div>

              {item.badge && (
                <span className={`
                  px-2.5 py-1 text-xs font-bold rounded-full
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-red-500 text-white'
                  }
                `}>
                  {item.badge}
                </span>
              )}

              {isActive && (
                <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
              )}

              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </a>
          </div>
        )
      })}
    </div>
  )
}