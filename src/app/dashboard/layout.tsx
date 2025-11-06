// pages/admin/layout.tsx - Layout profesional actualizado
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  HiMenuAlt3,
  HiHome,
  HiUsers,
  HiOfficeBuilding,
  HiCog,
  HiCurrencyDollar,
  HiBell,
  HiSupport,
  HiSearch,
  HiLogout,
  HiUserCircle,
  HiMail,
  HiChartBar,
  HiMoon,
  HiSun
} from 'react-icons/hi'
import { HiComputerDesktop } from 'react-icons/hi2'
import { AdminSidebar } from '@/components/dashboard/admin/AdminSideBar'
import { MenuItem } from '@/types/dashboard'
import { useAuth } from '@/hooks'
import { DashboardThemeProvider, useDashboardTheme } from '@/context/DashboardThemeContext'
import { ToastProvider } from '@/components/common/Toast'

// Configuración del menú principal
const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HiHome,
    description: 'Vista general del sistema',
  },
  {
    name: 'Propiedades',
    href: '/dashboard/properties',
    icon: HiOfficeBuilding,
    description: 'Gestionar inmuebles',
    subItems: [
      { name: 'Todas', href: '/dashboard/properties' },
      { name: 'En Venta', href: '/dashboard/properties/sale' },
      { name: 'En Alquiler', href: '/dashboard/properties/rent' },
    ]
  },
  {
    name: 'Sitio Web',
    href: '/dashboard/website',
    icon: HiComputerDesktop,
    description: 'Administrar sitio web',
    subItems: [
      { name: 'Configuración', href: '/dashboard/website' },
      { name: 'Preview', href: '/dashboard/website/preview' },
    ]
  },
  {
    name: 'Clientes',
    href: '/dashboard/clients',
    icon: HiUsers,
    description: 'Base de datos de clientes',
    subItems: [
      { name: 'Inquilinos', href: '/dashboard/clients/tenants' },
      { name: 'Propietarios', href: '/dashboard/clients/owners' },
      { name: 'Otros', href: '/dashboard/clients/others' },
    ]
  },
  {
    name: 'Alquileres',
    href: '/dashboard/rents',
    icon: HiCurrencyDollar,
    description: 'Información de alquileres',
    subItems: [
      { name: 'Alquileres', href: '/dashboard/rents' },
      { name: 'Contratos', href: '/dashboard/rents/contracts' },
      { name: 'Planes de Pago', href: '/dashboard/rents/payment-plans' },
    ]
  },
  {
    name: 'Ventas',
    href: '/dashboard/sales',
    icon: HiChartBar,
    description: 'Gestión de ventas',
    subItems: [
      { name: 'Todas', href: '/dashboard/sales' },
      { name: 'Boletos', href: '/dashboard/sales/receipts' },
    ]
  },
  {
    name: 'Contacto',
    href: '/dashboard/contact',
    icon: HiMail,
    description: 'Consultas del formulario',
    badge: 'NEW'
  },
]

// Menú inferior (Configuración y Soporte)
const bottomMenuItems: MenuItem[] = [
  {
    name: 'Configuración',
    href: '/dashboard/config',
    icon: HiCog,
    description: 'Ajustes del sistema',
  },
  {
    name: 'Soporte',
    href: '/dashboard/support',
    icon: HiSupport,
    description: 'Ayuda y asistencia',
  }
]

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, company, logout } = useAuth()
  const { theme, toggleTheme } = useDashboardTheme()
  const pathname = usePathname()

  const isDark = theme === 'dark'

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        pathname={pathname}
        user={user}
        company={company}
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top navigation bar */}
        <div className={`sticky top-0 z-40 flex h-16 items-center gap-x-4 shadow-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-900 border-b border-gray-700'
            : 'bg-white border-b border-gray-200'
        }`}>
          {/* Botón hamburguesa para abrir sidebar en móvil */}
          <button
            type="button"
            className={`p-2 rounded-lg lg:hidden transition-all duration-200 ${
              isDark
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <HiMenuAlt3 className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className={`h-6 w-px lg:hidden ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center gap-3">
              {/* Botón para colapsar sidebar en desktop */}
              <button
                type="button"
                className={`hidden lg:block p-2 rounded-lg transition-all duration-200 ${
                  isDark
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

              {/* Buscador */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <HiSearch className={`h-5 w-5 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="search"
                    placeholder="Buscar propiedades, clientes..."
                    className={`block w-full rounded-lg border py-2 pl-10 pr-3 text-sm transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-x-3 lg:gap-x-4">
              {/* Botón de modo oscuro/claro */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark
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
              <button
                type="button"
                className={`relative p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Notificaciones"
              >
                <span className="sr-only">Ver notificaciones</span>
                <HiBell className="h-6 w-6" aria-hidden="true" />
                {/* Badge de notificaciones */}
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Separator */}
              <div className={`hidden lg:block h-6 w-px ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} aria-hidden="true" />

              {/* Información del usuario */}
              <div className={`flex items-center gap-x-3 rounded-lg px-3 py-2 border transition-colors duration-200 ${
                isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <HiUserCircle className={`h-8 w-8 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className="hidden lg:flex lg:flex-col">
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {user?.full_name}
                  </span>
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {company?.name || 'Inmobiliaria'}
                  </span>
                </span>
              </div>

              {/* Separator */}
              <div className={`hidden lg:block h-6 w-px ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} aria-hidden="true" />

              {/* Botón cerrar sesión */}
              <button
                type="button"
                onClick={handleLogout}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isDark
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

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardThemeProvider>
      <ToastProvider>
        <DashboardContent>{children}</DashboardContent>
      </ToastProvider>
    </DashboardThemeProvider>
  )
}