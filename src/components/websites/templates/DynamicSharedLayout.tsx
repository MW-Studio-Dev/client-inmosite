'use client';

import React from 'react';
import { useWebsiteConfigContext } from '@/contexts/WebsiteConfigContext';
import Template1Layout from '@/components/websites/templates/template_1/layout/SharedLayout';
import Template2Layout from '@/components/websites/templates/template_2/layout/SharedLayout';
import Template3Layout from '@/components/websites/templates/template_3/layout/SharedLayout';

interface DynamicSharedLayoutProps {
    children: React.ReactNode;
    subdomain: string;
}

const DynamicSharedLayout: React.FC<DynamicSharedLayoutProps> = ({ children, subdomain }) => {
    const { config, loading, error } = useWebsiteConfigContext();

    // If loading or error, default to Template1Layout because it handles its own loading/error UI
    if (loading || error || !config) {
        return <Template1Layout subdomain={subdomain}>{children}</Template1Layout>;
    }

    const LayoutComponent = (() => {
        switch (config.templateId) {
            case 'template_2': return Template2Layout;
            case 'template_3': return Template3Layout;
            case 'template_1':
            default: return Template1Layout;
        }
    })();

    return <LayoutComponent subdomain={subdomain}>{children}</LayoutComponent>;
};

export default DynamicSharedLayout;
