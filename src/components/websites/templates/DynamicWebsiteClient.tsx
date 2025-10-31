'use client';

// app/s/[subdomain]/DynamicWebsiteClient.tsx
import React from 'react';
import { useWebsiteConfigContext } from '@/contexts/WebsiteConfigContext';
import RealEstateTemplate from '@/components/websites/templates/template_1';
import {LoadingWebsite} from '@/components/websites/layout/LoadingWebsite';
import {ErrorWebsite} from '@/components/websites/layout/ErrorWebsite';

interface DynamicWebsiteClientProps {
  subdomain: string;
  companyName: string;
}

/**
 * Componente cliente que renderiza el template dinámico del website
 * Usa el WebsiteConfigContext provisto por el layout padre
 */
const DynamicWebsiteClient: React.FC<DynamicWebsiteClientProps> = ({
  subdomain,
  companyName
}) => {
  const { config, loading, error, refetch } = useWebsiteConfigContext();

  if (loading) {
    return <LoadingWebsite companyName={companyName} />;
  }

  if (error || !config) {
    return (
      <ErrorWebsite
        error={error || 'No se pudo cargar la configuración'}
        companyName={companyName}
        subdomain={subdomain}
        onRetry={refetch}
      />
    );
  }

  return (
    <RealEstateTemplate
      templateConfig={config}
      subdomain={subdomain}
    />
  );
};

export default DynamicWebsiteClient;