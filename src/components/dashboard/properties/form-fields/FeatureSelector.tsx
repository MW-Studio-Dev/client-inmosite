import React, { useState } from 'react';
import { useField } from 'formik';
import { HiCheckCircle, HiPlus, HiX } from 'react-icons/hi';

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
  const features = field.value || [];

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
    <div>
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Características adicionales</h4>

      {/* Características comunes */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Selecciona características:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {commonFeatures.map((feature) => {
            const isSelected = features.includes(feature);
            return (
              <button
                key={feature}
                type="button"
                onClick={() => addCommonFeature(feature)}
                disabled={isSelected}
                className={`text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 cursor-not-allowed flex items-center'
                    : 'bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600'
                }`}
              >
                {isSelected && <HiCheckCircle className="h-3 w-3 inline mr-1" />}
                {!isSelected && <HiPlus className="h-3 w-3 inline mr-1" />}
                {feature}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agregar característica personalizada */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Agregar característica personalizada..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
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
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Características seleccionadas ({features.length}):</p>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <span
                key={index}
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-700"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 transition-colors"
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
