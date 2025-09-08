// app/dashboard/configuracion/page.tsx
export default function ConfiguracionPage() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Configuración</h2>
          <p className="mt-2 text-lg text-text-secondary">
            Ajustes generales de tu cuenta
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              👤 Perfil
            </h3>
            <p className="text-text-secondary">
              Información personal y de contacto...
            </p>
          </div>
  
          <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              🔒 Seguridad
            </h3>
            <p className="text-text-secondary">
              Contraseña y configuración de seguridad...
            </p>
          </div>
  
          <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              💳 Suscripción
            </h3>
            <p className="text-text-secondary">
              Plan actual y facturación...
            </p>
          </div>
  
          <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              🔔 Notificaciones
            </h3>
            <p className="text-text-secondary">
              Preferencias de notificaciones...
            </p>
          </div>
        </div>
      </div>
    )
  }
  