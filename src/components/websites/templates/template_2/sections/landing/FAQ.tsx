'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { TemplateConfig, FAQQuestion } from '../../types';

interface FAQSectionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const FAQSection: React.FC<FAQSectionProps> = ({ config, adaptiveColors }) => {
  // Validar que la sección esté habilitada
  if (!config.sections.faq?.enabled) {
    return null;
  }

  const faqConfig = config.sections.faq;

  // Preguntas por defecto si no vienen en la config (máximo 5)
  const defaultQuestions: FAQQuestion[] = [
    // ... (mismas preguntas que antes)
  ];

  // Limitar a máximo 5 preguntas
  const questions = faqConfig.questions && faqConfig.questions.length > 0
    ? faqConfig.questions.slice(0, 5)
    : defaultQuestions;

  // Estado para manejar qué pregunta está abierta
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Asegurarse de que el componente está montado en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Obtener el nombre de la empresa desde la config
  const companyName = config.company?.name;

  // Si no está montado, renderizar una versión estática
  if (!isMounted) {
    return (
      <section className="py-20" style={{ backgroundColor: config.colors.background }}>
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Layout con dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Columna izquierda - Título y badge */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
               

                {/* Título principal */}
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl mb-4"
                  style={{
                    color: config.colors.text,
                    fontWeight: config.typography.fontWeight.bold,
                    lineHeight: '1.2'
                  }}
                >
                  {faqConfig.title || 'Frequently asked questions about'}{' '}
                  <span style={{ color: config.colors.primary }}>
                    {companyName}
                  </span>
                </h2>

                {faqConfig.subtitle && (
                  <p
                    className="text-base md:text-lg"
                    style={{
                      color: config.colors.textLight,
                      fontWeight: config.typography.fontWeight.normal
                    }}
                  >
                    {faqConfig.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Columna derecha - Preguntas (versión estática) */}
            <div className="lg:col-span-8">
              <div className="space-y-4">
                {questions.map((faq: FAQQuestion, index: number) => (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: config.colors.surface
                    }}
                  >
                    {/* Pregunta - Versión estática sin eventos */}
                    <div
                      className="w-full text-left p-6 flex items-center justify-between gap-4"
                    >
                      <h3
                        className="text-base md:text-lg flex-1"
                        style={{
                          color: config.colors.text,
                          fontWeight: config.typography.fontWeight.semibold
                        }}
                      >
                        {faq.question}
                      </h3>

                      {/* Icono de chevron */}
                      <div
                        className="flex-shrink-0 rounded-full p-1"
                        style={{
                          backgroundColor: config.colors.primary + '10'
                        }}
                      >
                        <ChevronDownIcon
                          className="h-5 w-5"
                          style={{ color: config.colors.primary }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Versión interactiva una vez montado
  return (
    <section className="py-20" style={{ backgroundColor: config.colors.background }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Layout con dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Columna izquierda - Título y badge */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
            

              {/* Título principal */}
              <h2
                className="text-3xl md:text-4xl lg:text-5xl mb-4"
                style={{
                  color: config.colors.text,
                  fontWeight: config.typography.fontWeight.bold,
                  lineHeight: '1.2'
                }}
              >
                {faqConfig.title || 'Frequently asked questions about'}{' '}
                <span style={{ color: config.colors.primary }}>
                  {companyName}
                </span>
              </h2>

              {faqConfig.subtitle && (
                <p
                  className="text-base md:text-lg"
                  style={{
                    color: config.colors.textLight,
                    fontWeight: config.typography.fontWeight.normal
                  }}
                >
                  {faqConfig.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Columna derecha - Preguntas */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {questions.map((faq: FAQQuestion, index: number) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor: config.colors.surface
                    }}
                  >
                    {/* Pregunta - Botón clickeable */}
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 transition-colors duration-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      
                    >
                      <h3
                        className="text-base md:text-lg flex-1"
                        style={{
                          color: config.colors.text,
                          fontWeight: config.typography.fontWeight.semibold
                        }}
                      >
                        {faq.question}
                      </h3>

                      {/* Icono de chevron */}
                      <div
                        className="flex-shrink-0 transition-transform duration-300 rounded-full p-1"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          backgroundColor: config.colors.primary + '10'
                        }}
                      >
                        <ChevronDownIcon
                          className="h-5 w-5"
                          style={{ color: config.colors.primary }}
                        />
                      </div>
                    </button>

                    {/* Respuesta - Colapsable */}
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: isOpen ? '500px' : '0',
                        opacity: isOpen ? 1 : 0
                      }}
                    >
                      <div className="px-6 pb-6">
                        <p
                          className="text-sm md:text-base leading-relaxed"
                          style={{
                            color: config.colors.textLight,
                            fontWeight: config.typography.fontWeight.normal
                          }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
