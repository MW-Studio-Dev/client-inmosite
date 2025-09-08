export default function SitioWebPage() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Sitio Web</h2>
          <p className="mt-2 text-lg text-text-secondary">
            Personaliza y configura tu página web
          </p>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface rounded-custom-xl p-6 border border-surface-border">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              🎨 Editor Visual
            </h3>
            <p className="text-text-secondary">
              Constructor de páginas en desarrollo...
            </p>
          </div>
  
          <div className="space-y-6">
            <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
              <h3 className="text-lg font-bold text-text-primary mb-4">
                🌈 Temas
              </h3>
              <p className="text-text-secondary text-sm">
                Selector de colores y estilos...
              </p>
            </div>
  
            <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
              <h3 className="text-lg font-bold text-text-primary mb-4">
                📱 Vista Previa
              </h3>
              <button className="w-full bg-gradient-primary text-white py-2 rounded-custom-lg font-semibold">
                Ver Sitio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }