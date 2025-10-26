'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HiExclamationCircle, HiRefresh } from 'react-icons/hi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error en página de clientes:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center py-16">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <HiExclamationCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-red-800">Algo salió mal</h2>
            <p className="mb-8 max-w-md text-center text-red-600">
              {error.message || 'Hubo un error al cargar la página de clientes'}
            </p>
            <Button onClick={reset} className="gap-2">
              <HiRefresh className="h-4 w-4" />
              Intentar nuevamente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
