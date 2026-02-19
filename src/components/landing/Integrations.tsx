"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HiClock, HiCheckCircle } from 'react-icons/hi2';

interface Integration {
    name: string;
    logo: React.ReactNode;
    description: string;
    available: boolean;
    tag?: string;
}

const Integrations: React.FC = () => {
    const integrations: Integration[] = [
        {
            name: 'Mercado Libre',
            logo: (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                        <span className="text-yellow-400 font-bold text-sm">M</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-300">Mercado <span className="text-yellow-400">Libre</span></span>
                </div>
            ),
            description: 'Publicá tus propiedades directamente en el marketplace líder de Argentina.',
            available: true,
        },
        {
            name: 'Argenprop',
            logo: (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <span className="text-blue-400 font-bold text-sm">A</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-300">Argenprop</span>
                </div>
            ),
            description: 'Sincronizá tu cartera con uno de los portales inmobiliarios más visitados del país.',
            available: false,
            tag: 'Próximamente',
        },
        {
            name: 'ZonaProp',
            logo: (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-600/20 border border-green-500/30 flex items-center justify-center">
                        <span className="text-green-400 font-bold text-sm">Z</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-300">ZonaProp</span>
                </div>
            ),
            description: 'Publicá en ZonaProp sin salir de tu panel de administración.',
            available: false,
            tag: 'Próximamente',
        },
        {
            name: 'InmoSite Homes',
            logo: (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                        <span className="text-red-400 font-bold text-sm">H</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-300">InmoSite <span className="text-red-400">Homes</span></span>
                </div>
            ),
            description: 'Nuestro propio portal de propiedades para ampliar tu alcance de forma nativa.',
            available: false,
            tag: 'Próximamente',
        },
    ];

    return (
        <section id="integraciones" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
                        <span className="text-gray-100">Conectado con los portales </span>
                        <br />
                        <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-light">
                            que ya usás
                        </span>
                    </h2>
                    <p className="text-lg text-gray-300 font-light max-w-2xl mx-auto">
                        Publicá tus propiedades en múltiples plataformas desde un solo lugar.{' '}
                        <span className="text-red-400 font-normal">Sin duplicar el trabajo.</span>
                    </p>
                </motion.div>

                {/* Integrations Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {integrations.map((integration, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative group bg-gray-900/80 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-500 ${integration.available
                                ? 'border-gray-700/50 hover:border-red-500/50 hover:shadow-red-500/10 hover:shadow-xl hover:scale-105'
                                : 'border-gray-700/30 opacity-70'
                                }`}
                        >
                            {/* Hover glow (only for available) */}
                            {integration.available && (
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            )}

                            {/* Tag badge */}
                            {integration.tag && (
                                <div className="absolute -top-2.5 left-4 z-10">
                                    <div className="flex items-center gap-1 bg-gray-800 border border-gray-600/50 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-full">
                                        <HiClock className="w-3 h-3" />
                                        {integration.tag}
                                    </div>
                                </div>
                            )}

                            {/* Available badge */}
                            {integration.available && (
                                <div className="absolute -top-2.5 left-4 z-10">
                                    <div className="flex items-center gap-1 bg-green-900/80 border border-green-500/30 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">
                                        <HiCheckCircle className="w-3 h-3" />
                                        Disponible
                                    </div>
                                </div>
                            )}

                            {/* Logo */}
                            <div className="h-12 flex items-center mb-4 relative z-10">
                                {integration.logo}
                            </div>

                            {/* Description */}
                            <p className="text-gray-400 text-sm font-light leading-relaxed relative z-10">
                                {integration.description}
                            </p>

                            {/* Corner accents (only for available) */}
                            {integration.available && (
                                <>
                                    <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-red-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-red-500/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center text-gray-500 text-sm font-light mt-10"
                >
                    Más integraciones en camino. Estamos trabajando para conectarte con todos los portales del mercado.
                </motion.p>
            </div>
        </section>
    );
};

export default Integrations;
