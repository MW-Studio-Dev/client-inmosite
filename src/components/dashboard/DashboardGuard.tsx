'use client'

import { useAuth } from '@/hooks'
import Loading from '@/components/common/Loading'

interface DashboardGuardProps {
  children: React.ReactNode
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const { isReady, isHydrated } = useAuth()

  // Si no está hidratado o listo, mostrar loading
  if (!isHydrated || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  // Si está listo, renderizar los hijos
  return <>{children}</>
}