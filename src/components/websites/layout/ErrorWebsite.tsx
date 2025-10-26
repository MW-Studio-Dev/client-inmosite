// components/websites/ErrorWebsite.tsx
interface ErrorWebsiteProps {
    error: string;
    companyName: string;
    subdomain: string;
    onRetry: () => void;
  }
  
export  const ErrorWebsite: React.FC<ErrorWebsiteProps> = ({ 
    error, 
    companyName, 
    subdomain, 
    onRetry 
  }) => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg 
                  className="h-6 w-6 text-red-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
            </div>
  
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Error al cargar {companyName}
            </h1>
            
            <p className="text-gray-600 mb-4">
              No pudimos cargar la configuración del sitio web
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
              <p className="text-sm text-red-800">
                {error}
              </p>
            </div>
  
            <div className="space-y-3">
              <button
                onClick={onRetry}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Intentar de nuevo
              </button>
              
              <a 
                href="/"
                className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Volver al inicio
              </a>
            </div>
  
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Sitio: {subdomain} | 
                <a 
                  href="mailto:soporte@tudominio.com" 
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Contactar soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
