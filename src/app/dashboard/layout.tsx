// app/dashboard/layout.tsx - Layout protegido
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  HiHome, 
  HiOfficeBuilding, 
  HiGlobe, 
  HiCog,
  HiMenu,
  HiX,
  HiLogout,
  HiBell,
  HiEye
} from 'react-icons/hi'
import { AdminProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { IconBaseProps } from 'react-icons/lib'
import { User } from '@/interfaces'
import type { Company } from '@/interfaces/company'
import Image from 'next/image'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<IconBaseProps>
  description: string
}

const menuItems: MenuItem[] = [
  {
    name: 'Propiedades',
    href: '/dashboard/properties',
    icon: HiHome,
    description: 'Gestiona tu catálogo de propiedades'
  },
  {
    name: 'Sitio Web',
    href: '/dashboard/website',
    icon: HiGlobe,
    description: 'Personaliza tu página web'
  },
  {
    name: 'Configuración',
    href: '/dashboard/config',
    icon: HiCog,
    description: 'Ajustes generales de tu cuenta'
  },
  {
    name: 'Inmobiliaria',
    href: '/dashboard/profile',
    icon: HiOfficeBuilding,
    description: 'Información de tu empresa'
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtectedRoute>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminProtectedRoute>
  )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, company } = useAuth()
  const [subdomain, setSubdomain] = useState<string>('')

  // Obtener subdomain del middleware
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const hostParts = hostname.split('.')
      if (hostParts.length > 2) {
        setSubdomain(hostParts[0])
      }
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const handleViewSite = () => {
    if (subdomain) {
      const siteUrl = `${window.location.protocol}//${subdomain}.${window.location.host}`
      window.open(siteUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar móvil */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-black/50 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
             onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-surface transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>
          
          <SidebarContent 
            menuItems={menuItems} 
            pathname={pathname} 
            user={user}
            company={company}
            subdomain={subdomain}
          />
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-surface border-r border-surface-border">
          <SidebarContent 
            menuItems={menuItems} 
            pathname={pathname} 
            user={user}
            company={company}
            subdomain={subdomain}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-surface/95 backdrop-blur-sm border-b border-surface-border shadow-custom-sm">
          <button
            type="button"
            className="px-4 text-text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <HiMenu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  Panel de Administración
                </h1>
                {subdomain && (
                  <p className="text-sm text-text-muted">
                    {subdomain}.mwstudiodigital.com
                  </p>
                )}
              </div>
              
              <div className="ml-4 flex items-center md:ml-6 gap-2">
                {/* Ver sitio público */}
                {subdomain && (
                  <button 
                    onClick={handleViewSite}
                    className="p-2 rounded-custom-lg text-text-secondary hover:text-primary-600 hover:bg-surface-hover transition-all duration-300"
                    title="Ver sitio público"
                  >
                    <HiEye className="h-5 w-5" />
                  </button>
                )}
                
                {/* Notificaciones */}
                <button className="p-2 rounded-custom-lg text-text-secondary hover:text-primary-600 hover:bg-surface-hover transition-all duration-300 relative">
                  <HiBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Perfil de usuario */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-text-primary">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {user?.email}
                    </p>
                  </div>
                  
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  </div>
                </div>
                
                {/* Logout */}
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-custom-lg text-text-secondary hover:text-red-500 hover:bg-surface-hover transition-all duration-300"
                  title="Cerrar sesión"
                >
                  <HiLogout className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ 
  menuItems, 
  pathname,
  user,
  company,
  subdomain
}: { 
  menuItems: MenuItem[]
  pathname: string
  user: User | null
  company: Company | null
  subdomain: string
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-primary">
        <HiOfficeBuilding className="h-8 w-8 text-white" />
        <span className="ml-2 text-xl font-black text-white">
          InmoSite
        </span>
      </div>

      {/* Info de la inmobiliaria */}
      {company && (
        <div className="px-4 py-3 bg-surface-hover/50 border-b border-surface-border">
          <div className="flex items-center gap-3">
            {company.logo ? (
              <Image
                src={company.logo} 
                alt={company.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">
                  {company.name?.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {company.name}
              </p>
              <p className="text-xs text-text-muted">
                {subdomain}.mwstudiodigital.com
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-custom-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-custom-lg'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-primary-600'
                }`}
              >
                <Icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
                    isActive ? 'text-white' : 'text-text-tertiary group-hover:text-primary-600'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className={`text-xs mt-0.5 ${
                    isActive ? 'text-white/80' : 'text-text-muted'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer con info del usuario */}
        <div className="flex-shrink-0 flex border-t border-surface-border p-4">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-text-muted truncate">
                Plan Profesional
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}