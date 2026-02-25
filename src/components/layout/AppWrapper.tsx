// components/layout/AppWrapper.tsx - Wrapper principal de la aplicación
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface AppWrapperProps {
  children: React.ReactNode;
}

// Rutas que no requieren autenticación
const publicRoutes = [
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/',
  '/about',
  '/contact'
];

// Rutas que requieren estar NO autenticado (redirigen si ya estás logueado)
const guestOnlyRoutes = [
  '/login',
  '/register'
];

export const AppWrapper = ({ children }: AppWrapperProps) => {
  const { 
    isAuthenticated, 
    isHydrated, 
    isLoading,
    needsOnboarding,
    checkAuth,
    user 
  } = useAuth();
  const router = useRouter();

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    if (isHydrated && !user && localStorage.getItem('access_token')) {
      checkAuth();
    }
  }, [isHydrated, user, checkAuth]);

  // Manejar redirecciones basadas en el estado de autenticación
  useEffect(() => {
    if (!isHydrated || isLoading) {
      return;
    }

    const currentPath = router.pathname;
    const isPublicRoute = publicRoutes.includes(currentPath);
    const isGuestOnlyRoute = guestOnlyRoutes.includes(currentPath);

    // Si está autenticado y trata de acceder a rutas solo para invitados
    if (isAuthenticated && isGuestOnlyRoute) {
      // Verificar si hay returnUrl en query params
      const returnUrl = router.query.returnUrl as string;
      if (returnUrl && returnUrl !== '/login' && returnUrl !== '/register') {
        router.replace(returnUrl);
      } else if (needsOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard');
      }
      return;
    }

    // Si no está autenticado y trata de acceder a rutas protegidas
    if (!isAuthenticated && !isPublicRoute) {
      const loginUrl = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      router.replace(loginUrl);
      return;
    }

    // Si está autenticado, en ruta protegida pero necesita onboarding
    if (isAuthenticated && !isPublicRoute && needsOnboarding && currentPath !== '/onboarding') {
      router.replace('/onboarding');
      return;
    }

  }, [
    isHydrated,
    isLoading,
    isAuthenticated,
    needsOnboarding,
    router
  ]);

  // Mostrar loading mientras se inicializa
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
