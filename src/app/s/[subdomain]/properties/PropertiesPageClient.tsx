'use client';

import dynamic from 'next/dynamic';
import PropertiesPageErrorBoundary from '@/components/websites/templates/template_1/sections/list/PropertiesPageWrapper';

// Dynamic import with loading state - CLIENT COMPONENT
const PropertiesPage = dynamic(
  () => import("@/components/websites/templates/template_1/sections/list/PropertiesPage"),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

interface PropertiesPageClientProps {
  subdomain: string;
}

export default function PropertiesPageClient({ subdomain }: PropertiesPageClientProps) {
  return (
    <PropertiesPageErrorBoundary>
      <PropertiesPage key={`properties-${subdomain}`} subdomain={subdomain} />
    </PropertiesPageErrorBoundary>
  );
}
