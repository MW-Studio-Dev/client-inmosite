"use client";

import React, { useState, useEffect } from 'react';
import { HiArrowRight, HiInformationCircle } from 'react-icons/hi2';
import { subscriptionService } from '@/services/subscriptionService';
import { Loader } from '@/components/common/Loader';
import { PlanCard } from './PlanCard';
import type { Plan } from '@/types/subscription';

interface OnboardingPlanSelectorProps {
  currentPlanSlug?: string;
  onContinueWithFreePlan: () => void;
  onUpgradeToPlan: (planSlug: string, checkoutUrl?: string) => void;
}

export const OnboardingPlanSelector: React.FC<OnboardingPlanSelectorProps> = ({
  currentPlanSlug = 'free',
  onContinueWithFreePlan,
  onUpgradeToPlan
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlanSlug);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        // Usar forRegistration=true para obtener planes sin necesidad de autenticación
        const plansData = await subscriptionService.getPlans(true);
        setPlans(plansData);
        setError(null);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('No se pudieron cargar los planes. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (planSlug: string) => {
    setSelectedPlan(planSlug);
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Si el plan seleccionado es el actual (free), continuar sin cambios
      if (selectedPlan === currentPlanSlug) {
        onContinueWithFreePlan();
        return;
      }

      // Si el plan es gratuito o trial, no requiere pago
      if (selectedPlan === 'free' || selectedPlan === 'trial') {
        onContinueWithFreePlan();
        return;
      }

      // Si es un plan de pago, iniciar proceso de upgrade con prorrateo
      try {
        const upgradeResult = await subscriptionService.upgradeWithProrate(selectedPlan, 'mercadopago');

        // Si el upgrade fue gratuito (por crédito aplicado)
        if (upgradeResult.subscription_id && upgradeResult.amount_charged === 0) {
          // Upgrade completado sin costo
          onContinueWithFreePlan(); // Continuar al dashboard
          return;
        }

        // Si hay un checkout_url, redirigir a MercadoPago
        if (upgradeResult.payment_url) {
          window.location.href = upgradeResult.payment_url;
          return;
        }

        // Si llegamos aquí, llamar al callback con el plan y url
        onUpgradeToPlan(selectedPlan, upgradeResult.payment_url);
      } catch (upgradeError: any) {
        console.error('Error en upgrade:', upgradeError);
        throw new Error(upgradeError.response?.data?.message || 'Error al procesar el upgrade');
      }
    } catch (err: any) {
      console.error('Error al procesar la selección del plan:', err);
      setError(err.message || 'Hubo un error al procesar tu selección. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="text-red-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Elige tu plan
        </h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Puedes continuar con el plan gratuito o actualizar a un plan de pago para acceder a más funcionalidades.
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-8 p-4 rounded-lg border bg-blue-950/30 border-blue-800/30 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <HiInformationCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-300">
              Actualmente tienes el plan <span className="font-semibold">Gratuito</span>.
              Puedes continuar con este plan o elegir uno de pago para desbloquear funcionalidades premium.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 rounded-lg border bg-red-950/30 border-red-800/30 max-w-2xl mx-auto">
          <p className="text-sm text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.slug}
            onSelect={handleSelectPlan}
            showCurrentBadge={plan.slug === currentPlanSlug}
          />
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedPlan || isProcessing}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 min-w-[200px]"
        >
          {isProcessing ? (
            <>
              <Loader className="text-white" scale={0.5} />
              <span>Procesando...</span>
            </>
          ) : selectedPlan === currentPlanSlug || selectedPlan === 'free' || selectedPlan === 'trial' ? (
            <>
              <span>Continuar con este plan</span>
              <HiArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Actualizar y continuar</span>
              <HiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Skip Option */}
      {selectedPlan === currentPlanSlug && (
        <div className="text-center mt-6">
          <button
            onClick={onContinueWithFreePlan}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Saltar este paso →
          </button>
        </div>
      )}
    </div>
  );
};
