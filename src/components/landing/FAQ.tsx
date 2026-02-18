"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: '¿Necesito conocimientos técnicos para usar Inmosite?',
        answer: 'No. Inmosite está diseñado para que cualquier persona pueda crear y gestionar su sitio web inmobiliario sin saber programar. El proceso de configuración toma menos de 10 minutos.',
    },
    {
        question: '¿Cómo funciona la prueba gratuita?',
        answer: 'Tenés 30 días para probar todas las funcionalidades del plan que elijas, sin necesidad de ingresar una tarjeta de crédito. Al finalizar el período, podés elegir continuar con un plan pago o cancelar sin costo.',
    },
    {
        question: '¿Puedo publicar mis propiedades en Mercado Libre desde Inmosite?',
        answer: 'Sí. Inmosite tiene integración directa con Mercado Libre Inmuebles. Podés publicar y sincronizar tus propiedades desde el panel de administración sin tener que cargarlas dos veces.',
    },
    {
        question: '¿Puedo usar mi propio dominio?',
        answer: 'Sí, a partir del Plan Básico podés conectar tu dominio personalizado (por ejemplo, tuinmobiliaria.com.ar). Si no tenés uno, también podés usar un subdominio de Inmosite.',
    },
    {
        question: '¿Qué pasa si quiero cambiar de plan?',
        answer: 'Podés subir o bajar de plan en cualquier momento desde tu panel de administración. El cambio se aplica de forma inmediata y el cobro se ajusta de manera proporcional.',
    },
    {
        question: '¿Puedo cancelar cuando quiera?',
        answer: 'Sí. No hay contratos de permanencia. Podés cancelar tu suscripción en cualquier momento y seguirás teniendo acceso hasta el final del período ya abonado.',
    },
    {
        question: '¿Cómo se cobran los planes?',
        answer: 'Los planes se cobran mensualmente en pesos argentinos a través de Mercado Pago. El precio en USD es de referencia; el monto en ARS se actualiza periódicamente según el tipo de cambio.',
    },
    {
        question: '¿Tienen soporte en español?',
        answer: 'Sí. Nuestro equipo de soporte está disponible en español por WhatsApp y email. Los planes Enterprise incluyen soporte prioritario con tiempos de respuesta garantizados.',
    },
];

const FAQItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void; index: number }> = ({
    item,
    isOpen,
    onToggle,
    index,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        viewport={{ once: true }}
        className={`border rounded-xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-red-500/40 bg-gray-900/90' : 'border-gray-700/50 bg-gray-900/60 hover:border-gray-600/70'
            }`}
    >
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        >
            <span className={`font-medium text-base transition-colors duration-300 ${isOpen ? 'text-red-400' : 'text-gray-100'}`}>
                {item.question}
            </span>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0"
            >
                <HiChevronDown className={`w-5 h-5 transition-colors duration-300 ${isOpen ? 'text-red-400' : 'text-gray-500'}`} />
            </motion.div>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <p className="px-6 pb-5 text-gray-400 font-light leading-relaxed text-sm">
                        {item.answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 relative">
            <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
                        <span className="text-gray-100">Preguntas </span>
                        <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-light">
                            frecuentes
                        </span>
                    </h2>
                    <p className="text-gray-400 font-light">
                        ¿Tenés dudas? Acá respondemos las más comunes.
                    </p>
                </motion.div>

                {/* Accordion */}
                <div className="space-y-3">
                    {faqs.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={item}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center text-gray-500 text-sm font-light mt-10"
                >
                    ¿No encontrás lo que buscás?{' '}
                    <a
                        href="#contacto"
                        onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="text-red-400 hover:text-red-300 transition-colors underline underline-offset-2"
                    >
                        Contactanos
                    </a>
                </motion.p>
            </div>
        </section>
    );
};

export default FAQ;
