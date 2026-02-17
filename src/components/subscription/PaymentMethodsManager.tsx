"use client";

import React, { useState, useEffect } from 'react';
import {
  HiCreditCard,
  HiTrash,
  HiCheckCircle,
  HiPlusCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import { subscriptionService } from '@/services/subscriptionService';
import type { PaymentMethod } from '@/types/subscription';
import { Loader } from '@/components/common/Loader';

export const PaymentMethodsManager = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const methods = await subscriptionService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err: any) {
      console.error('Error fetching payment methods:', err);
      setError('No se pudieron cargar los métodos de pago');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      await subscriptionService.setDefaultPaymentMethod(methodId);
      await fetchPaymentMethods();
    } catch (err: any) {
      console.error('Error setting default payment method:', err);
      alert('Error al establecer método de pago predeterminado');
    }
  };

  const handleDelete = async (methodId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      return;
    }

    try {
      await subscriptionService.deletePaymentMethod(methodId);
      await fetchPaymentMethods();
    } catch (err: any) {
      console.error('Error deleting payment method:', err);
      alert('Error al eliminar método de pago');
    }
  };

  const getBrandIcon = (brand: string) => {
    return <HiCreditCard className="w-8 h-8 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <HiExclamationCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchPaymentMethods}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métodos de Pago</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona tus tarjetas y métodos de pago para suscripciones
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <HiPlusCircle className="w-5 h-5" />
          <span>Agregar Método</span>
        </button>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <HiCreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes métodos de pago registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Agrega una tarjeta o método de pago para gestionar tus suscripciones
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Agregar Método de Pago
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`
                relative bg-white border-2 rounded-lg p-6 transition-all
                ${method.is_default
                  ? 'border-red-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Default Badge */}
              {method.is_default && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <HiCheckCircle className="w-3 h-3" />
                    Predeterminado
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getBrandIcon(method.brand)}
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {method.brand}
                    </p>
                    <p className="text-sm text-gray-600">
                      {method.payment_type === 'credit_card' ? 'Tarjeta de Crédito' : 'Tarjeta de Débito'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 font-mono text-lg tracking-wider">
                  •••• •••• •••• {method.masked_number}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Vence: {method.expiry_display}
                </p>
              </div>

              <div className="flex gap-2">
                {!method.is_default && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Establecer como predeterminado
                  </button>
                )}
                <button
                  onClick={() => handleDelete(method.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>

              {!method.is_active && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <p className="text-xs text-yellow-800">
                    Este método de pago está inactivo
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <HiCheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Seguridad de tus datos</p>
            <p className="text-blue-800">
              Todos tus métodos de pago están encriptados y protegidos mediante MercadoPago.
              Nunca almacenamos tu número de tarjeta completo.
            </p>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <AddPaymentMethodModal onClose={() => setShowAddModal(false)} onSuccess={fetchPaymentMethods} />
      )}
    </div>
  );
};

// Modal para agregar método de pago (placeholder)
const AddPaymentMethodModal = ({
  onClose,
  onSuccess
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Agregar Método de Pago
        </h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            Para agregar un método de pago, debes suscribirte a un plan o realizar un upgrade.
            Los métodos de pago se registran automáticamente durante el proceso de checkout de MercadoPago.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onClose();
              window.location.href = '/dashboard/admin/subscription';
            }}
            className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Ver Planes
          </button>
        </div>
      </div>
    </div>
  );
};
