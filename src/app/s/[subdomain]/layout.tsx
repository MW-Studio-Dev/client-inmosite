// app/s/[subdomain]/layout.tsx
import React from 'react';

interface SubdomainLayoutProps {
  children: React.ReactNode;
  params: {
    subdomain: string;
  };
}

export default async function SubdomainLayout({
  children,
  params
}: SubdomainLayoutProps) {
  const awaitedParams = await params;

  // Este layout es específico para los websites de subdominios
  // No incluye el header/footer del sitio principal
  return (
    <html lang="es">
      <head>
        <meta name="subdomain" content={awaitedParams.subdomain} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
