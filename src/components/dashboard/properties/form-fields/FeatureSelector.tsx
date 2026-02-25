import React, { useState } from 'react';
import { useField } from 'formik';
import { HiCheckCircle, HiPlus, HiX } from 'react-icons/hi';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

interface FeatureSelectorProps {
  name: string;
  commonFeatures: string[];
}

export const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  name,
  commonFeatures
}) => {
  const [field, , helpers] = useField<string[]>(name);
  const [newFeature, setNewFeature] = useState('');
  const [showAll, setShowAll] = useState(false);
  const features = field.value || [];
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const VISIBLE_COUNT = 7;
  const visibleFeatures = showAll ? commonFeatures : commonFeatures.slice(0, VISIBLE_COUNT);
  const hasMore = commonFeatures.length > VISIBLE_COUNT;

  const addCommonFeature = (feature: string) => {
    if (!features.includes(feature)) {
      helpers.setValue([...features, feature]);
    }
  };

  const addCustomFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      helpers.setValue([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    helpers.setValue(features.filter(f => f !== feature));
  };

  return (
    // Contenedor principal con fondo y borde que se adaptan al tema
    <div className={`p-4 rounded-lg border transition-colors ${isDark
      ? 'bg-slate-800 border-slate-700'
      : 'bg-white border-gray-200'
      }`}>
      <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>Características adicionales</h4>

      {/* Características comunes */}
      <div className="mb-4">
        <p className={`text-xs mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Selecciona características:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {visibleFeatures.map((feature) => {
            const isSelected = features.some(f => {
              if (typeof f === 'string') return f === feature;
              // If f is object, try to match structure. This handles weird mixed state.
              return JSON.stringify(f) === feature || (f as any)?.feature === feature || (f as any)?.name === feature;
            });
            return (
              <button
                key={feature}
                type="button"
                onClick={() => addCommonFeature(feature)}
                disabled={isSelected}
                className={`text-left px-2.5 py-1.5 rounded-md text-xs transition-all border ${isSelected
                  ? isDark
                    ? 'bg-red-900/30 text-red-300 border-red-700 cursor-not-allowed'
                    : 'bg-red-50 text-red-700 border-red-300 cursor-not-allowed'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {isSelected && <HiCheckCircle className="h-3 w-3 inline mr-1" />}
                {!isSelected && <HiPlus className="h-3 w-3 inline mr-1" />}
                {typeof feature === 'string' ? feature : JSON.stringify(feature)}
              </button>
            );
          })}
          {hasMore && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={`text-left px-2.5 py-1.5 rounded-md text-xs transition-all border font-medium ${isDark
                ? 'bg-slate-700 text-red-400 border-slate-600 hover:bg-slate-600'
                : 'bg-gray-50 text-red-600 border-gray-300 hover:bg-gray-100'
                }`}
            >
              Ver más ({commonFeatures.length - VISIBLE_COUNT})
            </button>
          )}
        </div>
      </div>

      {/* Agregar característica personalizada */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Agregar característica personalizada..."
          // El input tiene su propio fondo para destacarse del contenedor
          className={`flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors ${isDark
            ? 'bg-slate-900 text-white border-slate-600 placeholder:text-gray-500'
            : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'
            }`}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomFeature();
            }
          }}
        />
        <button
          type="button"
          onClick={addCustomFeature}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <HiPlus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      {/* Características seleccionadas */}
      {features.length > 0 && (
        <div>
          <p className={`text-xs mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Características seleccionadas ({features.length}):</p>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <span
                key={index}
                // Las etiquetas seleccionadas usan colores neutros para no competir con el botón seleccionado
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${isDark
                  ? 'bg-slate-700 text-slate-300 border-slate-600'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}
              >
                {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  // El botón de eliminar usa el color de acento 'red' para indicar una acción destructiva
                  className={`p-0.5 rounded-full transition-colors ${isDark
                    ? 'hover:bg-red-900/50 text-red-400 hover:text-red-300'
                    : 'hover:bg-red-100 text-red-600 hover:text-red-800'
                    }`}
                >
                  <HiX className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
