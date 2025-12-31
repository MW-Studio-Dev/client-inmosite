'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import {
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiHome,
  HiRefresh,
  HiDocumentText,
  HiExclamationCircle
} from 'react-icons/hi'
import Link from 'next/link'

type PaymentStatus = 'success' | 'pending' | 'cancelled' | 'failure'

interface PaymentInfo {
  collection_id?: string
  collection_status?: string
  payment_id?: string
  status?: string
  external_reference?: string
  preference_id?: string
  merchant_order_id?: string
  payment_type?: string
}

export default function PaymentStatusPage() {
  const { theme } = useDashboardTheme()
  const isDark = theme === 'dark'
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Extraer par�metros de la URL
    const status = searchParams.get('status')
    const collectionStatus = searchParams.get('collection_status')
    const paymentId = searchParams.get('payment_id')
    const collectionId = searchParams.get('collection_id')
    const externalReference = searchParams.get('external_reference')
    const preferenceId = searchParams.get('preference_id')
    const merchantOrderId = searchParams.get('merchant_order_id')
    const paymentType = searchParams.get('payment_type')

    // Guardar informaci�n del pago
    setPaymentInfo({
      collection_id: collectionId || undefined,
      collection_status: collectionStatus || undefined,
      payment_id: paymentId || undefined,
      status: status || undefined,
      external_reference: externalReference || undefined,
      preference_id: preferenceId || undefined,
      merchant_order_id: merchantOrderId || undefined,
      payment_type: paymentType || undefined
    })

    // Determinar el estado del pago
    // MercadoPago puede usar diferentes par�metros
    let determinedStatus: PaymentStatus

    if (status === 'approved' || collectionStatus === 'approved') {
      determinedStatus = 'success'
    } else if (status === 'pending' || collectionStatus === 'pending') {
      determinedStatus = 'pending'
    } else if (status === 'rejected' || status === 'cancelled' || collectionStatus === 'rejected' || collectionStatus === 'cancelled') {
      determinedStatus = 'cancelled'
    } else if (status === 'failure' || collectionStatus === 'failure') {
      determinedStatus = 'failure'
    } else {
      // Si no hay par�metros, asumir que hay un error
      determinedStatus = 'failure'
    }

    setPaymentStatus(determinedStatus)
    setLoading(false)

    // Opcional: notificar al backend sobre el estado del pago
    // notifyBackend(determinedStatus, paymentInfo)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Procesando informaci�n del pago...
          </p>
        </div>
      </div>
    )
  }

  const statusConfig = {
    success: {
      icon: HiCheckCircle,
      iconColor: 'text-green-500',
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
      borderColor: isDark ? 'border-green-800' : 'border-green-200',
      title: '�Pago Exitoso!',
      description: 'Tu suscripci�n ha sido activada correctamente. Ya puedes disfrutar de todos los beneficios de tu plan.',
      actionText: 'Ir al Dashboard',
      actionLink: '/dashboard',
      actionIcon: HiHome,
      showPaymentDetails: true
    },
    pending: {
      icon: HiClock,
      iconColor: 'text-yellow-500',
      bgColor: isDark ? 'bg-yellow-900/20' : 'bg-yellow-50',
      borderColor: isDark ? 'border-yellow-800' : 'border-yellow-200',
      title: 'Pago Pendiente',
      description: 'Tu pago est� siendo procesado. Te notificaremos cuando se confirme. Esto puede tomar unos minutos.',
      actionText: 'Ver mi Suscripci�n',
      actionLink: '/dashboard/subscription',
      actionIcon: HiDocumentText,
      showPaymentDetails: true
    },
    cancelled: {
      icon: HiXCircle,
      iconColor: 'text-red-500',
      bgColor: isDark ? 'bg-red-900/20' : 'bg-red-50',
      borderColor: isDark ? 'border-red-800' : 'border-red-200',
      title: 'Pago Cancelado',
      description: 'El pago ha sido cancelado. No se realiz� ning�n cargo. Puedes intentar nuevamente cuando lo desees.',
      actionText: 'Reintentar Pago',
      actionLink: '/dashboard/subscription',
      actionIcon: HiRefresh,
      showPaymentDetails: false
    },
    failure: {
      icon: HiExclamationCircle,
      iconColor: 'text-red-500',
      bgColor: isDark ? 'bg-red-900/20' : 'bg-red-50',
      borderColor: isDark ? 'border-red-800' : 'border-red-200',
      title: 'Error en el Pago',
      description: 'Hubo un problema al procesar tu pago. Por favor, verifica tus datos e intenta nuevamente.',
      actionText: 'Reintentar Pago',
      actionLink: '/dashboard/subscription',
      actionIcon: HiRefresh,
      showPaymentDetails: false
    }
  }

  const config = statusConfig[paymentStatus!]
  const IconComponent = config.icon
  const ActionIcon = config.actionIcon

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full rounded-2xl border shadow-xl overflow-hidden ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Header con �cono de estado */}
        <div className={`p-8 text-center border-b ${config.bgColor} ${config.borderColor}`}>
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${
              isDark ? 'bg-gray-800/50' : 'bg-white/80'
            } shadow-lg`}>
              <IconComponent className={`h-16 w-16 ${config.iconColor}`} />
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {config.title}
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {config.description}
          </p>
        </div>

        {/* Detalles del pago */}
        {config.showPaymentDetails && (paymentInfo.payment_id || paymentInfo.collection_id) && (
          <div className={`p-6 border-b ${
            isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-sm font-bold mb-4 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Detalles del Pago
            </h3>
            <div className="space-y-3">
              {(paymentInfo.payment_id || paymentInfo.collection_id) && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ID de Pago:
                  </span>
                  <span className={`text-sm font-mono font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {paymentInfo.payment_id || paymentInfo.collection_id}
                  </span>
                </div>
              )}
              {paymentInfo.external_reference && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Referencia:
                  </span>
                  <span className={`text-sm font-mono font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {paymentInfo.external_reference}
                  </span>
                </div>
              )}
              {paymentInfo.payment_type && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    M�todo de Pago:
                  </span>
                  <span className={`text-sm font-medium capitalize ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {paymentInfo.payment_type.replace('_', ' ')}
                  </span>
                </div>
              )}
              {(paymentInfo.status || paymentInfo.collection_status) && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Estado:
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${
                    paymentStatus === 'success'
                      ? 'bg-green-100 text-green-800'
                      : paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {paymentInfo.status || paymentInfo.collection_status}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informaci�n adicional seg�n el estado */}
        <div className="p-6">
          {paymentStatus === 'success' && (
            <div className={`rounded-lg p-4 mb-6 ${
              isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <HiDocumentText className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <p className={`font-medium mb-1 ${
                    isDark ? 'text-blue-300' : 'text-blue-800'
                  }`}>
                    Pr�ximos pasos
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    Recibir�s un correo con el comprobante de pago y los detalles de tu suscripci�n.
                    Puedes comenzar a usar todas las funcionalidades de tu plan inmediatamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className={`rounded-lg p-4 mb-6 ${
              isDark ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-start gap-3">
                <HiClock className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <div>
                  <p className={`font-medium mb-1 ${
                    isDark ? 'text-yellow-300' : 'text-yellow-800'
                  }`}>
                    �Por qu� est� pendiente?
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-yellow-400' : 'text-yellow-700'
                  }`}>
                    Algunos m�todos de pago requieren confirmaci�n adicional. Te notificaremos por
                    email cuando el pago se confirme. Mientras tanto, puedes seguir usando tu plan actual.
                  </p>
                </div>
              </div>
            </div>
          )}

          {(paymentStatus === 'cancelled' || paymentStatus === 'failure') && (
            <div className={`rounded-lg p-4 mb-6 ${
              isDark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                <HiExclamationCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <div>
                  <p className={`font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-800'
                  }`}>
                    �Necesitas ayuda?
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Si tienes problemas para completar el pago, nuestro equipo de soporte est�
                    disponible para ayudarte. Cont�ctanos a trav�s del chat o por email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acci�n */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={config.actionLink}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${
                paymentStatus === 'success'
                  ? 'bg-gradient-primary text-white'
                  : isDark
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              <ActionIcon className="h-5 w-5" />
              {config.actionText}
            </Link>

            <Link
              href="/dashboard"
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all border ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
              }`}
            >
              <HiHome className="h-5 w-5" />
              Volver al Inicio
            </Link>
          </div>
        </div>

        {/* Footer con soporte */}
        <div className={`p-4 text-center border-t ${
          isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            �Tienes alguna pregunta?{' '}
            <a
              href="mailto:soporte@inmosite.com"
              className={`font-medium hover:underline ${
                isDark ? 'text-primary-400' : 'text-primary-600'
              }`}
            >
              Cont�ctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
