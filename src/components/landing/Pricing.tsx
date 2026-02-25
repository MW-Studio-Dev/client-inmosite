"use client";

import React, { useState, useEffect } from 'react';
import { HiCheck, HiSparkles, HiExclamationCircle, HiXMark } from 'react-icons/hi2';
import { subscriptionService } from '@/services/subscriptionService';
import type { Plan } from '@/types/subscription';

// ─── Map raw features object to human-readable list ──────────────────────────

interface RawFeatures {
  agents?: string | number;
  contacts?: string | number;
  properties?: string | number;
  analytics?: boolean;
  api_access?: boolean;
  integrations?: boolean;
  custom_domain?: boolean;
  priority_support?: boolean;
  [key: string]: unknown;
}

function buildFeaturesList(features: RawFeatures): { label: string; included: boolean }[] {
  const fmt = (v: string | number | undefined | null) => {
    if (v === 'unlimited') return 'Ilimitados';
    if (v === null || v === undefined) return 'Consultar';
    return String(v);
  };

  return [
    { label: `${fmt(features.properties)} propiedades`, included: true },
    { label: `${fmt(features.agents)} agente${features.agents === '1' ? '' : 's'}`, included: true },
    { label: `${fmt(features.contacts)} contactos`, included: true },
    { label: 'Dominio personalizado', included: !!features.custom_domain },
    { label: 'Analíticas', included: !!features.analytics },
    { label: 'Integraciones (MeLi, etc.)', included: !!features.integrations },
    { label: 'Acceso a API', included: !!features.api_access },
    { label: 'Soporte prioritario', included: !!features.priority_support },
  ];
}

function formatARS(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return 'Consultar';

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return 'Consultar';
  if (num === 0) return 'Gratis';

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(num);
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 animate-pulse">
    <div className="text-center mb-6">
      <div className="h-6 bg-gray-700/60 rounded w-24 mx-auto mb-3" />
      <div className="h-8 bg-gray-700/60 rounded w-28 mx-auto mb-1" />
      <div className="h-4 bg-gray-700/40 rounded w-20 mx-auto" />
    </div>
    <div className="space-y-3 mb-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-700/60 rounded-full flex-shrink-0" />
          <div className="h-3 bg-gray-700/40 rounded flex-1" />
        </div>
      ))}
    </div>
    <div className="h-10 bg-gray-700/60 rounded-xl" />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Pricing: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const fetchPlans = () => {
    setError(false);
    setLoading(true);
    subscriptionService
      .getPlans(true)
      .then((data) => { setPlans(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { fetchPlans(); }, []);

  const scrollToWhitelist = () => {
    document.getElementById('whitelist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="precios" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
            <span className="text-gray-100">Precios que se adaptan a </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-light">
              tu crecimiento
            </span>
          </h2>
          <p className="text-lg text-gray-300 font-light">
            <span className="text-red-400 font-normal">Sin costos ocultos.</span>{' '}
            Cancela cuando quieras.
          </p>
        </div>

        {/* Toggle Anual/Mensual */}
        <div className="flex justify-center mb-12 relative z-10">
          <div className="flex items-center p-1 rounded-full border bg-gray-900/80 border-gray-700/50 backdrop-blur-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Anual
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <HiExclamationCircle className="w-10 h-10 text-red-400" />
            <p className="text-gray-400 font-light">
              No pudimos cargar los planes.{' '}
              <button onClick={fetchPlans} className="text-red-400 underline hover:text-red-300 transition-colors">
                Intentá nuevamente
              </button>
            </p>
          </div>
        )}

        {/* Skeleton */}
        {loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Plans grid */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.filter(plan => plan.billing_cycle === billingCycle || plan.plan_type === 'trial').map((plan) => {
              const rawFeatures = (plan.features ?? {}) as RawFeatures;
              const featuresList = buildFeaturesList(rawFeatures);
              const arsPrice = formatARS(plan.price_ars);
              const isFree = parseFloat(String(plan.price_ars)) === 0;

              return (
                <div
                  key={plan.id}
                  className={`relative group transition-all duration-500 hover:scale-105 ${plan.is_popular ? 'scale-105 z-10' : 'hover:z-20'}`}
                >
                  {plan.is_popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-red-700/10 rounded-3xl blur-xl transform scale-110" />
                  )}

                  <div className={`relative bg-gray-900/80 backdrop-blur-sm border rounded-2xl p-6 shadow-lg transition-all duration-500 h-full flex flex-col ${plan.is_popular
                    ? 'border-red-500/60 ring-1 ring-red-500/30 shadow-red-500/20'
                    : 'border-gray-700/50 hover:border-red-500/40 hover:shadow-red-500/10'
                    }`}>

                    {/* Hover glow */}
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${plan.is_popular
                      ? 'bg-gradient-to-br from-red-500/20 to-transparent opacity-60'
                      : 'bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100'
                      }`} />

                    {/* Popular badge */}
                    {plan.is_popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg border border-red-400/30">
                          <HiSparkles className="w-3 h-3" />
                          Más Popular
                        </div>
                      </div>
                    )}

                    {/* Plan name */}
                    <div className="text-center mb-4 relative z-10">
                      <h3 className="text-xl font-medium text-gray-100 group-hover:text-red-400 transition-colors duration-300">
                        {plan.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6 relative z-10">
                      {arsPrice === 'Consultar' ? (
                        <div className={`text-3xl font-light transition-colors duration-300 ${plan.is_popular ? 'text-red-400' : 'text-gray-100 group-hover:text-red-400'}`}>
                          Consultar
                        </div>
                      ) : (
                        <>
                          <div className={`text-3xl font-light transition-colors duration-300 ${plan.is_popular ? 'text-red-400' : 'text-gray-100 group-hover:text-red-400'}`}>
                            {arsPrice}
                          </div>
                          {isFree && (
                            <div className="text-sm text-gray-400 font-light mt-1">30 días de prueba</div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-6 relative z-10 flex-1">
                      {featuresList.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <div className={`flex-shrink-0 rounded-full p-0.5 ${f.included
                            ? 'bg-red-500/20 border border-red-500/30'
                            : 'bg-gray-700/30 border border-gray-600/30'
                            }`}>
                            {f.included
                              ? <HiCheck className="w-3 h-3 text-red-400" />
                              : <HiXMark className="w-3 h-3 text-gray-600" />
                            }
                          </div>
                          <span className={`text-sm font-light ${f.included ? 'text-gray-300' : 'text-gray-600'}`}>
                            {f.label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="relative z-10">
                      <button
                        onClick={scrollToWhitelist}
                        className={`w-full py-3 text-sm font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden ${plan.is_popular
                          ? 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-red-500/40 border border-red-400/30'
                          : 'bg-transparent border border-red-500/60 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400 hover:shadow-red-500/30'
                          }`}
                      >
                        {isFree ? 'Empezar gratis' : plan.is_popular ? 'Empezar ahora' : 'Comenzar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && plans.length === 0 && (
          <p className="text-center text-gray-400 font-light py-12">
            No hay planes disponibles en este momento.
          </p>
        )}

        {/* Footer note */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm font-light">
            Todos los planes incluyen{' '}
            <span className="text-red-400 font-normal">30 días de prueba gratuita</span>{' '}
            · Sin compromiso de permanencia
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
