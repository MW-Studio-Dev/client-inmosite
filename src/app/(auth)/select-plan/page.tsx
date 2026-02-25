"use client";

import React, { useState, useEffect } from 'react';
import { HiArrowRight, HiCheckCircle } from "react-icons/hi2";
import { subscriptionService } from '@/services/subscriptionService';
import { Loader } from '@/components/common/Loader';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Plan } from '@/types/subscription';

const SelectPlanPage = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const plansData = await subscriptionService.getPlans(true); // true = para registro
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

  const handleContinue = () => {
    if (selectedPlan) {
      // Guardar el plan seleccionado en localStorage para usarlo en el registro
      localStorage.setItem('selected_plan_slug', selectedPlan);
      router.push('/register');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <Loader className="text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Fondo con patrones sutiles */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.1), transparent 50%),
            radial-gradient(circle at 0% 50%, rgba(239, 68, 68, 0.05), transparent 50%),
            radial-gradient(circle at 100% 50%, rgba(239, 68, 68, 0.05), transparent 50%),
            linear-gradient(rgba(239, 68, 68, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "auto, auto, auto, 60px 60px, 60px 60px"
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-red-400 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">

            {/* Logo y título */}
            <div className="text-center mb-12">
              <div className="relative w-64 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl"></div>
                <div className="relative w-full h-full flex items-center justify-center p-6">
                  <Image
                    src='/logo.png'
                    alt="Logo InmoSite"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-3xl font-normal text-white mb-2">
                Elige tu plan
              </h1>
              <p className="text-sm text-gray-400">
                Selecciona el plan que mejor se adapte a tus necesidades
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 rounded-lg border bg-red-950/30 border-red-800/30 max-w-2xl mx-auto">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Plans Grid - Horizontal Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan.slug)}
                  className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${selectedPlan === plan.slug
                      ? 'border-red-500 bg-gradient-to-b from-red-950/40 to-red-950/20 shadow-xl shadow-red-500/30 scale-105'
                      : plan.is_popular
                        ? 'border-red-700/50 bg-gradient-to-b from-gray-800/60 to-gray-900/60 hover:border-red-600'
                        : 'border-gray-700/50 bg-gradient-to-b from-gray-800/40 to-gray-900/40 hover:border-gray-600'
                    }`}
                >
                  {/* Badge Popular */}
                  {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                        ⭐ Más Popular
                      </span>
                    </div>
                  )}

                  {/* Selected Check */}
                  {selectedPlan === plan.slug && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="bg-red-500 rounded-full p-1.5 shadow-lg animate-pulse">
                        <HiCheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="p-6 h-full flex flex-col">
                    {/* Plan Name */}
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {plan.name}
                      </h3>
                      {plan.highlight_text && (
                        <p className="text-xs text-red-400 font-medium">
                          {plan.highlight_text}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6 pb-6 border-b border-gray-700/50">
                      <div className="flex items-baseline justify-center gap-1 mb-1">
                        <span className="text-4xl font-bold text-white">
                          ${plan.price_ars === 0 ? '0' : plan.price_ars.toLocaleString('es-AR')}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">
                          /{plan.billing_cycle === 'monthly' ? 'mes' : plan.billing_cycle === 'yearly' ? 'año' : plan.duration_days + ' días'}
                        </span>
                      </div>
                      {plan.price_usd && plan.price_ars > 0 && (
                        <p className="text-xs text-gray-500">
                          ≈ ${plan.price_usd} USD
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    {plan.description && (
                      <p className="text-sm text-gray-400 text-center mb-6 min-h-[40px]">
                        {plan.description}
                      </p>
                    )}

                    {/* Features */}
                    <div className="space-y-3 flex-grow">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Características
                      </p>
                      {plan.features_list && plan.features_list.length > 0 ? (
                        plan.features_list.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <HiCheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedPlan === plan.slug ? 'text-red-400' : 'text-green-500'
                              }`} />
                            <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">Sin características definidas</p>
                      )}
                    </div>

                    {/* Select Button */}
                    <div className="mt-6 pt-6 border-t border-gray-700/50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan.slug);
                        }}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${selectedPlan === plan.slug
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                          }`}
                      >
                        {selectedPlan === plan.slug ? 'Seleccionado ✓' : 'Seleccionar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={!selectedPlan}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                <span>Continuar con el registro</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SelectPlanPage;
