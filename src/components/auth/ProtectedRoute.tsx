// components/auth/ProtectedRoute.tsx - Componente mejorado con manejo correcto de hidratación

'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  requireOnboarding?: boolean;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requireEmailVerification = false,
  requireOnboarding = false,
  redirectTo = '/login',
  loadingComponent
}: ProtectedRouteProps) => {
  const { 
    isAuthenticated, 
    isEmailVerified, 
    needsOnboarding,
    isInitializing,
    isReady,
  } = useAuth();
  
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // No hacer nada mientras se está inicializando (hidratando o cargando)
    if (isInitializing) {
      setShouldRender(false);
      return;
    }

    // Una vez que el estado está listo, evaluar las condiciones
    if (isReady) {
      console.log('ProtectedRoute - Estado listo:', {
        isAuthenticated,
        requireAuth,
        isEmailVerified,
        requireEmailVerification,
        needsOnboarding,
        requireOnboarding
      });

      // Verificar autenticación
      if (requireAuth && !isAuthenticated) {
        console.log('Usuario no autenticado, redirigiendo a login');
        setRedirecting(true);
        const currentPath = window.location.pathname;
        const loginUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
        setShouldRender(false);
        return;
      }

      // Verificar email verificado
      if (requireEmailVerification && isAuthenticated && !isEmailVerified) {
        console.log('Email no verificado, redirigiendo a verificación');
        setRedirecting(true);
        router.push('/verify-email');
        setShouldRender(false);
        return;
      }

      // Verificar onboarding completado (comentado por ahora)
      // if (requireOnboarding && isAuthenticated && needsOnboarding) {
      //   console.log('Onboarding no completado, redirigiendo a onboarding');
      //   setRedirecting(true);
      //   router.push('/onboarding');
      //   setShouldRender(false);
      //   return;
      // }

      // Si pasa todas las verificaciones, permitir renderizado
      console.log('Todas las verificaciones pasadas, renderizando contenido');
      setRedirecting(false);
      setShouldRender(true);
    }
  }, [
    isAuthenticated, 
    isEmailVerified, 
    needsOnboarding,
    isInitializing,
    isReady,
    router, 
    requireAuth, 
    requireEmailVerification, 
    requireOnboarding,
    redirectTo
  ]);

  // Mostrar loading mientras se inicializa o mientras se redirige
  if (isInitializing || redirecting || !shouldRender) {
    return loadingComponent || <DefaultLoadingScreen />;
  }

  return <>{children}</>;
};

// Componente de loading por defecto
const DefaultLoadingScreen = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
    <p className="text-text-secondary font-light">Verificando autenticación...</p>
  </div>
);

// Componente específico para el panel admin
export const AdminProtectedRoute = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute
      requireAuth={true}
      requireEmailVerification={false} // Temporalmente en false
      requireOnboarding={false} // Temporalmente en false
      redirectTo="/login"
      loadingComponent={<AdminLoadingScreen />}
    >
      {children}
    </ProtectedRoute>
  );
};

// Loading screen específico para admin
const AdminLoadingScreen = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <div className="mb-8">
      <div className="w-16 h-16 bg-gradient-primary rounded-custom-lg flex items-center justify-center shadow-custom-lg mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
      </div>
    </div>
    <h2 className="text-xl font-bold text-text-primary mb-2">
      Cargando panel de administración
    </h2>
    <p className="text-text-secondary font-light">
      Verificando permisos y datos de tu inmobiliaria...
    </p>
  </div>
);

// Hook personalizado para verificar autenticación en componentes específicos
export const useRequireAuth = (redirect = true) => {
  const { isAuthenticated, isInitializing, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isAuthenticated && redirect) {
      const currentPath = window.location.pathname;
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, isReady, redirect, router]);

  return {
    isAuthenticated,
    isLoading: isInitializing,
    isReady
  };
};