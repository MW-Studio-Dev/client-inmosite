'use client';

import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface LinkWithLoaderProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  loadingMessage?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export const LinkWithLoader = forwardRef<HTMLAnchorElement, LinkWithLoaderProps>(
  ({ href, children, className, loadingMessage, onClick, target, rel, ...props }, ref) => {
    const router = useRouter();
    const { showLoader, hideLoader } = useGlobalLoader();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Si es un enlace externo, no usar el loader
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        if (onClick) onClick();
        return;
      }

      e.preventDefault();

      if (onClick) onClick();

      // Mostrar loader y navegar
      showLoader(loadingMessage || 'Navegando...');

      setTimeout(() => {
        router.push(href);
        // Ocultar el loader después de un tiempo máximo
        setTimeout(() => {
          hideLoader();
        }, 2000);
      }, 100);
    };

    return (
      <a
        ref={ref}
        href={href}
        className={className}
        onClick={handleClick}
        target={target}
        rel={rel}
        {...props}
      >
        {children}
      </a>
    );
  }
);

LinkWithLoader.displayName = 'LinkWithLoader';
