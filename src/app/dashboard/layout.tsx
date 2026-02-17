// app/dashboard/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  HiMenuAlt3,
  HiSearch,
  HiLogout,
  HiUserCircle,
  HiMoon,
  HiSun
} from 'react-icons/hi'
import { AdminSidebar } from '@/components/dashboard/admin/AdminSideBar'
import { DashboardGuard } from '@/components/dashboard/DashboardGuard'
import { DashboardThemeProvider, useDashboardTheme } from '@/context/DashboardThemeContext'
import { useAuth } from '@/hooks'
import { dashboardMenuItems, dashboardBottomMenuItems } from '@/constants/dashboardMenu'
import { NotificationBadge } from '@/components/common/NotificationBadge'
import { NotificationProvider } from '@/providers/NotificationProvider'

// Componente interno que usa los hooks del contexto
function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const { user, company, logout, needsOnboarding, isAuthenticated, isReady } = useAuth()
  const { theme, toggleTheme } = useDashboardTheme()
  const pathname = usePathname()

  const isDark = theme === 'dark'

  // Redirigir a onboarding si el usuario está autenticado pero necesita completar onboarding
  // y no está ya en la página de onboarding
  useEffect(() => {
    if (isReady && isAuthenticated && needsOnboarding && !pathname.includes('/onboarding')) {
      window.location.href = '/dashboard/onboarding'
    }
  }, [isReady, isAuthenticated, needsOnboarding, pathname])

  const handleLogout = () => {
    logout()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 font-poppins font-light ${isDark ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        menuItems={dashboardMenuItems}
        bottomMenuItems={dashboardBottomMenuItems}
        user={user}
        company={company}
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top navigation bar */}
        <div className={`fixed top-0 right-0 z-40 transition-all duration-300 ${isDark
          ? 'bg-gray-900'
          : 'bg-white border-b border-gray-200'
          } ${searchExpanded ? 'h-24' : 'h-16'} ${sidebarCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-72'
          }`}>
          <div className="flex h-16 items-center gap-x-4 shadow-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Botón hamburguesa para abrir sidebar en móvil */}
            <button
              type="button"
              className={`p-2 rounded-lg lg:hidden transition-all duration-200 ${isDark
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Abrir sidebar</span>
              <HiMenuAlt3 className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div className={`h-6 w-px lg:hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 lg:pl-8">
              <div className="flex flex-1 items-center gap-3">
                {/* Botón para colapsar sidebar en desktop */}
                <button
                  type="button"
                  className={`hidden lg:block p-2 rounded-lg transition-all duration-200 mt-1 ${isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <span className="sr-only">
                    {sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                  </span>
                  <HiMenuAlt3 className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* Buscador - Versión móvil expandible */}
                <div className="flex-1 lg:max-w-2xl">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <HiSearch className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                    </div>
                    <input
                      type="search"
                      placeholder="Buscar propiedades, clientes..."
                      onFocus={() => setSearchExpanded(true)}
                      onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
                      className={`block w-full rounded-lg border py-2 pl-10 pr-3 text-sm transition-all duration-200 lg:py-2 ${isDark
                        ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
                        } ${searchExpanded ? 'lg:py-3' : ''}`}
                    />
                  </div>
                  {/* Expandible search suggestions for mobile */}
                  {searchExpanded && (
                    <div className={`absolute left-0 right-0 top-16 mt-2 mx-4 lg:hidden rounded-lg shadow-lg border transition-all duration-300 ${isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                      }`}>
                      <div className="p-3">
                        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          Sugerencias de búsqueda
                        </p>
                        <div className="space-y-2">
                          <button className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${isDark
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}>
                            🏠 Buscar propiedades
                          </button>
                          <button className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${isDark
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}>
                            👥 Buscar clientes
                          </button>
                          <button className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${isDark
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}>
                            📊 Ver estadísticas
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
            {/* User menu */}
            <div className="flex items-center gap-x-3 lg:gap-x-4">
              {/* Botón de modo oscuro/claro */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${isDark
                  ? 'text-yellow-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
                title={isDark ? 'Modo claro' : 'Modo oscuro'}
              >
                <span className="sr-only">Cambiar tema</span>
                {isDark ? (
                  <HiSun className="h-6 w-6" />
                ) : (
                  <HiMoon className="h-6 w-6" />
                )}
              </button>

              {/* Notificaciones */}
              <NotificationBadge
                className={`relative p-2 rounded-lg transition-all duration-200 ${isDark
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              />

              {/* Separator */}
              <div className={`hidden lg:block h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`} aria-hidden="true" />

              {/* Información del usuario */}
              <div className={`flex items-center gap-x-3 rounded-lg px-3 py-2 border transition-colors duration-200 ${isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-200'
                }`}>
                <HiUserCircle className={`h-8 w-8 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                <span className="hidden lg:flex lg:flex-col">
                  <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                    {user?.full_name}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    {company?.name || 'Inmobiliaria'}
                  </span>
                </span>
              </div>

              {/* Separator */}
              <div className={`hidden lg:block h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`} aria-hidden="true" />

              {/* Botón cerrar sesión */}
              <button
                type="button"
                onClick={handleLogout}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                title="Cerrar sesión"
              >
                <HiLogout className="h-5 w-5" />
                <span className="hidden lg:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spacer for fixed header */}
        <div className="h-16" />

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <DashboardGuard>
              {children}
            </DashboardGuard>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <DashboardThemeProvider>
        <DashboardContent>{children}</DashboardContent>
      </DashboardThemeProvider>
    </NotificationProvider>
  )
}