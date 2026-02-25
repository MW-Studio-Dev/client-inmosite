export default function WebsiteSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-text-primary">Configuraci�n del Sitio Web</h2>
        <p className="mt-2 text-lg text-text-secondary">
          Personaliza los ajustes de tu p�gina web
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-bold text-text-primary mb-4">
           Apariencia
          </h3>
          <p className="text-text-secondary">
            Configurar colores, fuentes y estilos del sitio web
          </p>
        </div>

        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            Informaci�n de la Inmobiliaria
          </h3>
          <p className="text-text-secondary">
            Datos de contacto, logo y descripci�n
          </p>
        </div>

        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            Integraci�n con Redes Sociales
          </h3>
          <p className="text-text-secondary">
            Enlaces a Facebook, Instagram, Twitter y m�s
          </p>
        </div>

        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            =
 SEO y Metadatos
          </h3>
          <p className="text-text-secondary">
            Optimizaci�n para motores de b�squeda
          </p>
        </div>
      </div>
    </div>
  );
}
