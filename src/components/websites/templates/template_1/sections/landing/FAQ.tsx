'use client';

import React, { useState } from 'react';
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import { TemplateConfig, FAQQuestion, } from '../../types';

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
  // Validar que la secci�n est� habilitada
  if (!config.sections.faq?.enabled) {
    return null;
  }

  const faqConfig = config.sections.faq;

  // Preguntas por defecto si no vienen en la config
  const defaultQuestions: FAQQuestion[] = [
    {
      question: '�Cu�l es la inversi�n m�nima requerida?',
      answer: 'Nuestras oportunidades de inversi�n comienzan desde $50,000 USD. Sin embargo, contamos con diferentes opciones adaptadas a distintos perfiles de inversi�n. Te recomendamos agendar una consulta con nuestro equipo para encontrar la mejor opci�n seg�n tu presupuesto y objetivos.',
      category: 'Inversi�n'
    },
    {
      question: '�Puedo invertir si vivo en otro pa�s?',
      answer: 'S�, absolutamente. Trabajamos con inversionistas de todo el mundo. Nuestro proceso est� 100% digitalizado y tenemos experiencia en transacciones internacionales. Te guiaremos en cada paso del proceso, incluyendo aspectos legales y tributarios aplicables a inversionistas extranjeros.',
      category: 'Internacional'
    },
    {
      question: '�Qu� tipo de retorno puedo esperar?',
      answer: 'Los retornos var�an seg�n el tipo de inversi�n y ubicaci�n. Hist�ricamente, nuestras propiedades han generado retornos entre 8% y 15% anual, incluyendo apreciaci�n del capital y rentas. Cada oportunidad incluye un an�lisis detallado de ROI proyectado basado en datos del mercado.',
      category: 'Retornos'
    },
    {
      question: '�Cu�nto tiempo toma el proceso de inversi�n?',
      answer: 'El proceso completo, desde la selecci�n de la propiedad hasta el cierre, t�picamente toma entre 30 y 90 d�as. Esto incluye la due diligence legal, aprobaci�n de financiamiento (si aplica), y el proceso de cierre. Nuestro equipo trabaja para hacer este proceso lo m�s eficiente posible.',
      category: 'Proceso'
    },
    {
      question: '�Ofrecen opciones de financiamiento?',
      answer: 'S�, trabajamos con una red de instituciones financieras y fintech partners que ofrecen opciones de financiamiento competitivas. Podemos conectarte con las mejores opciones seg�n tu perfil crediticio y el tipo de propiedad. Tambi�n aceptamos financiamiento con criptomonedas en algunos casos.',
      category: 'Financiamiento'
    },
    {
      question: '�Qu� sucede despu�s de la compra?',
      answer: 'Ofrecemos servicios completos de gesti�n post-venta, incluyendo administraci�n de propiedades, b�squeda de inquilinos, mantenimiento, y reportes financieros mensuales. Nuestro objetivo es que tu inversi�n sea completamente pasiva si as� lo deseas.',
      category: 'Post-Venta'
    },
    {
      question: '�C�mo garantizan la seguridad de mi inversi�n?',
      answer: 'Realizamos un exhaustivo proceso de due diligence en cada propiedad, incluyendo an�lisis legal, t�tulo de propiedad, evaluaciones t�cnicas, y an�lisis de mercado. Trabajamos solo con desarrolladores y vendedores verificados. Adem�s, todas las transacciones se realizan con respaldo legal completo y seguros correspondientes.',
      category: 'Seguridad'
    },
    {
      question: '�Puedo visitar las propiedades antes de invertir?',
      answer: 'Por supuesto. Ofrecemos tours virtuales 24/7 para todas nuestras propiedades, y tambi�n podemos coordinar visitas presenciales. Si vives en otro pa�s, nuestro equipo puede realizar inspecciones en video en vivo para que puedas ver la propiedad en tiempo real.',
      category: 'Inspecci�n'
    }
  ];

  const questions = faqConfig.questions && faqConfig.questions.length > 0
    ? faqConfig.questions
    : defaultQuestions;

  // Estado para manejar qu� pregunta est� abierta
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Categor�as �nicas
  const categories = Array.from(new Set(questions.map((q: any) => q.category).filter(Boolean)));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrar preguntas por categor�a
  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter((q: any) => q.category === selectedCategory);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20" style={{ backgroundColor: config.colors.background }}>
      <div className="container mx-auto px-4">
        {/* Header de la secci�n */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <QuestionMarkCircleIcon
              className="h-12 w-12 mr-3"
              style={{ color: config.colors.primary }}
            />
            <h2
              className="text-3xl md:text-4xl"
              style={{
                color: config.colors.text,
                fontWeight: config.typography.fontWeight.bold
              }}
            >
              {faqConfig.title || 'Preguntas Frecuentes'}
            </h2>
          </div>
          {faqConfig.subtitle && (
            <p
              className="text-lg max-w-3xl mx-auto"
              style={{
                color: config.colors.textLight,
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              {faqConfig.subtitle}
            </p>
          )}
        </div>

        {/* Filtros por categor�a (si hay categor�as) */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2 rounded-full transition-all duration-200"
              style={{
                backgroundColor: selectedCategory === 'all'
                  ? config.colors.primary
                  : config.colors.surface,
                color: selectedCategory === 'all'
                  ? adaptiveColors.primaryText
                  : config.colors.text,
                fontWeight: config.typography.fontWeight.medium,
                border: `2px solid ${selectedCategory === 'all' ? config.colors.primary : 'transparent'}`
              }}
            >
              Todas
            </button>
            {categories.map((category, idx) => (
              <button
                key={`category-${idx}`}
                onClick={() => setSelectedCategory(category as string)}
                className="px-5 py-2 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: selectedCategory === category
                    ? config.colors.primary
                    : config.colors.surface,
                  color: selectedCategory === category
                    ? adaptiveColors.primaryText
                    : config.colors.text,
                  fontWeight: config.typography.fontWeight.medium,
                  border: `2px solid ${selectedCategory === category ? config.colors.primary : 'transparent'}`
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Grid de FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredQuestions.map((faq: FAQQuestion, index: number) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: config.colors.surface,
                    border: `2px solid ${isOpen ? config.colors.primary : 'transparent'}`,
                    boxShadow: isOpen ? '0 8px 16px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {/* Pregunta - Bot�n clickeable */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full text-left p-6 flex items-start justify-between gap-4 transition-colors duration-200"
                    style={{
                      backgroundColor: isOpen
                        ? config.colors.primary + '08'
                        : 'transparent'
                    }}
                  >
                    <div className="flex-1">
                      {/* Badge de categor�a */}
                      {faq.category && (
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs mb-2"
                          style={{
                            backgroundColor: config.colors.primary + '20',
                            color: config.colors.primary,
                            fontWeight: config.typography.fontWeight.medium
                          }}
                        >
                          {faq.category}
                        </span>
                      )}

                      <h3
                        className="text-lg md:text-xl"
                        style={{
                          color: config.colors.text,
                          fontWeight: config.typography.fontWeight.semibold
                        }}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* Icono de chevron */}
                    <div
                      className="flex-shrink-0 mt-1 transition-transform duration-300"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <ChevronDownIcon
                        className="h-6 w-6"
                        style={{ color: config.colors.primary }}
                      />
                    </div>
                  </button>

                  {/* Respuesta - Colapsable */}
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: isOpen ? '500px' : '0',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="p-6 pt-0">
                      <div
                        className="pl-4 border-l-4"
                        style={{ borderColor: config.colors.primary + '30' }}
                      >
                        <p
                          className="text-base leading-relaxed"
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
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA de contacto */}
        <div className="text-center mt-16">
          <div
            className="inline-block p-8 rounded-2xl max-w-2xl"
            style={{
              backgroundColor: config.colors.surface,
              border: `2px solid ${config.colors.primary}20`
            }}
          >
            <ChatBubbleLeftRightIcon
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: config.colors.primary }}
            />
            <h3
              className="text-xl md:text-2xl mb-3"
              style={{
                color: config.colors.text,
                fontWeight: config.typography.fontWeight.semibold
              }}
            >
              {faqConfig.contactTitle || '�No encontraste tu respuesta?'}
            </h3>
            <p
              className="text-base mb-6"
              style={{
                color: config.colors.textLight,
                fontWeight: config.typography.fontWeight.normal
              }}
            >
              {faqConfig.contactSubtitle || 'Nuestro equipo est� disponible para resolver todas tus dudas y acompa�arte en tu proceso de inversi�n.'}
            </p>
            <button
              className="px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              style={{
                backgroundColor: config.colors.primary,
                color: adaptiveColors.primaryText,
                fontWeight: config.typography.fontWeight.semibold
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.primary}
            >
              {faqConfig.contactButton || 'Contactar a un Asesor'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
