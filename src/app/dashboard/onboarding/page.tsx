'use client'

import { OnboardingWizard } from '@/components/dashboard/onboarding/OnboardingWizard'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OnboardingPage() {
  const { isAuthenticated, needsOnboarding, isReady } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirigir si el usuario no está autenticado
    if (isReady && !isAuthenticated) {
      router.push('/login')
      return
    }

    // Redirigir al dashboard si el usuario ya completó el onboarding
    if (isReady && isAuthenticated && !needsOnboarding) {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, needsOnboarding, isReady, router])

  // Mostrar loading mientras se verifica el estado
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Solo mostrar el wizard si el usuario está autenticado y necesita onboarding
  if (isAuthenticated && needsOnboarding) {
    return <OnboardingWizard />
  }

  // Caso por defecto (no debería llegar aquí)
  return null
}