'use client';

// app/s/[subdomain]/DynamicWebsiteClient.tsx
import React from 'react';
import { useWebsiteConfig } from '@/hooks/useWebsiteConfig';
import RealEstateTemplate from '@/components/websites/templates/template_1';
import {LoadingWebsite} from '@/components/websites/layout/LoadingWebsite';
import {ErrorWebsite} from '@/components/websites/layout/ErrorWebsite';

interface DynamicWebsiteClientProps {
  subdomain: string;
  companyName: string;
}

const DynamicWebsiteClient: React.FC<DynamicWebsiteClientProps> = ({ 
  subdomain, 
  companyName 
}) => {
  const { config, loading, error, refetch } = useWebsiteConfig(subdomain);

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