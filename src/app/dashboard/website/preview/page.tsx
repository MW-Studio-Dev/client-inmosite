export default function WebsitePreviewPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Vista Previa del Sitio Web</h2>
          <p className="mt-2 text-lg text-text-secondary">
            Previsualiza c�mo se ver� tu sitio web antes de publicarlo
          </p>
        </div>
        <button className="bg-gradient-primary text-white px-6 py-3 rounded-custom-lg font-semibold hover:scale-105 transition-all duration-300">
          Ver Sitio en Vivo
        </button>
      </div>

      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-text-primary">
            =� Vista de Escritorio
          </h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
              Desktop
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">
              Tablet
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">
              M�vil
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-8 min-h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4"></div>
            <p className="text-gray-600 text-lg mb-4">
              Vista previa del sitio web
            </p>
            <p className="text-gray-500">
              El iframe de previsualizaci�n aparecer� aqu�
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h4 className="font-bold text-text-primary mb-2">=� Responsive</h4>
          <p className="text-sm text-text-secondary">
            Tu sitio se adapta autom�ticamente a todos los dispositivos
          </p>
        </div>
        
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h4 className="font-bold text-text-primary mb-2">� Optimizado</h4>
          <p className="text-sm text-text-secondary">
            Carga r�pida y optimizado para SEO
          </p>
        </div>
        
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h4 className="font-bold text-text-primary mb-2">= Actualizaci�n Autom�tica</h4>
          <p className="text-sm text-text-secondary">
            Los cambios se reflejan inmediatamente
          </p>
        </div>
      </div>
    </div>
  );
}