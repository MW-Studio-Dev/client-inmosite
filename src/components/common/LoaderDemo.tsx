'use client';

import { useState } from 'react';
import { LinkWithLoader } from './LinkWithLoader';
import { useLoaderWithAction } from '@/hooks/useLoaderWithAction';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

export function LoaderDemo() {
  const [message, setMessage] = useState('');
  const { showLoader, hideLoader, setLoadingWithTimeout } = useGlobalLoader();
  const { executeWithLoader } = useLoaderWithAction();

  const simulateApiCall = async () => {
    // Simular una llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    return 'Datos cargados exitosamente';
  };

  const handleSimulateApiCall = async () => {
    try {
      const result = await executeWithLoader(
        simulateApiCall,
        'Cargando datos desde la API...'
      );
      setMessage(result);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al cargar datos');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleShowLoaderForTime = () => {
    setLoadingWithTimeout('Procesando solicitud...', 3000);
  };

  const handleManualLoader = () => {
    showLoader('Loader manual...');
    setTimeout(() => {
      hideLoader();
      setMessage('Loader manual cerrado');
      setTimeout(() => setMessage(''), 2000);
    }, 2000);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
        Demostración del Loader Global
      </h3>

      <div className="space-y-4">
        {/* Enlaces con loader */}
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Navegación con Loader:
          </h4>
          <div className="flex flex-wrap gap-2">
            <LinkWithLoader
              href="/dashboard"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              loadingMessage="Yendo al dashboard..."
            >
              Dashboard
            </LinkWithLoader>
            <LinkWithLoader
              href="/dashboard/properties"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              loadingMessage="Cargando propiedades..."
            >
              Propiedades
            </LinkWithLoader>
            <LinkWithLoader
              href="/dashboard/config"
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              loadingMessage="Abriendo configuración..."
            >
              Configuración
            </LinkWithLoader>
          </div>
        </div>

        {/* Acciones asíncronas */}
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Acciones Asíncronas:
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSimulateApiCall}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Simular API Call
            </button>
            <button
              onClick={handleShowLoaderForTime}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Loader por 3s
            </button>
            <button
              onClick={handleManualLoader}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
            >
              Loader Manual
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {message && (
          <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-md">
            <p className="text-green-800 dark:text-green-200 text-sm">{message}</p>
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
            ¿Cómo usarlo?
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">LinkWithLoader</code>: Para enlaces de navegación</li>
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">useLoaderWithAction</code>: Para acciones asíncronas</li>
            <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">useGlobalLoader</code>: Control manual del loader</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
