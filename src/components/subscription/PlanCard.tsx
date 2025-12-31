"use client";

import React from 'react';
import { HiCheckCircle, HiStar } from 'react-icons/hi2';
import type { Plan } from '@/types/subscription';

interface PlanCardProps {
  plan: Plan;
  isSelected?: boolean;
  onSelect: (planSlug: string) => void;
  showCurrentBadge?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isSelected = false,
  onSelect,
  showCurrentBadge = false
}) => {
  return (
    <div
      onClick={() => onSelect(plan.slug)}
      className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
        isSelected
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
            <HiStar className="w-4 h-4 mr-1" />
            Más Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {showCurrentBadge && (
        <div className="absolute -top-3 right-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200 border border-gray-600">
            Plan Actual
          </span>
        </div>
      )}

      {/* Selected Check */}
      {isSelected && (
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
                <HiCheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isSelected ? 'text-red-400' : 'text-green-500'
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
              onSelect(plan.slug);
            }}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isSelected
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                : showCurrentBadge
                ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            {isSelected
              ? 'Seleccionado ✓'
              : showCurrentBadge
              ? 'Mantener este plan'
              : 'Seleccionar Plan'
            }
          </button>
        </div>
      </div>
    </div>
  );
};
