//app/dashboard/seguimiento/page.tsx

export default function SeguimientoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-text-primary">Seguimiento</h2>
        <p className="mt-2 text-lg text-text-secondary">
          Analiza leads, contactos y conversiones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            📊 Analytics
          </h3>
          <p className="text-text-secondary">
            Gráficos y métricas en desarrollo...
          </p>
        </div>

        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            📩 Leads Recientes
          </h3>
          <p className="text-text-secondary">
            Lista de contactos en desarrollo...
          </p>
        </div>
      </div>
    </div>
  )
}