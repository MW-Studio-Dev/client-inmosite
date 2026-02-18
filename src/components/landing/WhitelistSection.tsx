"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { marketingService } from '@/services/marketingService';
import {
    HiArrowRight,
    HiCheck,
    HiEnvelope,
    HiUser,
    HiSparkles,
    HiShieldCheck,
} from 'react-icons/hi2';

// ─── Inner form (needs useSearchParams inside Suspense) ───────────────────────

function WhitelistFormInner() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Capture UTM params into a cookie (30 days)
    useEffect(() => {
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        const metadata: Record<string, string> = {};
        utmParams.forEach((param) => {
            const value = searchParams.get(param);
            if (value) metadata[param] = value;
        });
        if (Object.keys(metadata).length > 0) {
            const d = new Date();
            d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
            document.cookie = `marketing_info=${JSON.stringify(metadata)};expires=${d.toUTCString()};path=/`;
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Por favor ingresá tu email.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('El email no es válido.');
            return;
        }

        setLoading(true);
        try {
            let metadata = {};
            const match = document.cookie.match(new RegExp('(^| )marketing_info=([^;]+)'));
            if (match) {
                try { metadata = JSON.parse(match[2]); } catch { /* ignore */ }
            }
            await marketingService.joinWhitelist(email, name, metadata);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError('Ocurrió un error. Por favor intentá nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // ── Success state ──────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
            >
                <div className="w-16 h-16 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiCheck className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-light text-white mb-2">¡Estás dentro!</h3>
                <p className="text-gray-300 font-light">
                    Te avisaremos cuando tu acceso esté listo.
                </p>
            </motion.div>
        );
    }

    // ── Form ───────────────────────────────────────────────────────────────────
    const inputBase =
        'w-full px-4 py-3.5 rounded-xl border bg-white/5 backdrop-blur-sm text-gray-100 placeholder-gray-500 font-light focus:outline-none focus:ring-2 transition-all duration-300';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Tu nombre (opcional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${inputBase} pl-11 border-gray-700/60 hover:border-gray-600/70 focus:ring-red-500/40 focus:border-red-500/50`}
                />
            </div>

            {/* Email */}
            <div className="relative">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className={`${inputBase} pl-11 ${error
                        ? 'border-red-500/70 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-700/60 hover:border-gray-600/70 focus:ring-red-500/40 focus:border-red-500/50'
                        }`}
                />
            </div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-red-400 text-sm font-light"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Registrando...</span>
                    </>
                ) : (
                    <>
                        <span>Quiero acceso anticipado</span>
                        <HiArrowRight className="w-4 h-4" />
                    </>
                )}
            </motion.button>

            {/* Privacy note */}
            <p className="text-center text-xs text-gray-500 font-light flex items-center justify-center gap-1.5">
                <HiShieldCheck className="w-3.5 h-3.5 text-gray-600" />
                Sin spam. Podés darte de baja cuando quieras.
            </p>
        </form>
    );
}

// ─── Main exported section ────────────────────────────────────────────────────

const WhitelistSection: React.FC = () => {
    const benefits = [
        'Acceso antes que nadie',
        'Precio de lanzamiento especial',
        'Soporte personalizado en el setup',
        'Sin compromiso de permanencia',
    ];

    return (
        <section id="whitelist" className="py-24 relative">
            {/* Decorative glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/8 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/25 rounded-full px-4 py-2 mb-6">
                        <HiSparkles className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 text-sm font-medium">Acceso anticipado</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
                        <span className="text-gray-100">Sé de los primeros en </span>
                        <br />
                        <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-light">
                            transformar tu inmobiliaria
                        </span>
                    </h2>
                    <p className="text-lg text-gray-300 font-light max-w-2xl mx-auto">
                        Anotate en la lista de espera y obtené{' '}
                        <span className="text-red-400 font-normal">beneficios exclusivos</span> de lanzamiento.
                    </p>
                </motion.div>

                {/* Main card */}
                <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left: benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-light text-gray-100">
                            ¿Qué obtenés al anotarte?
                        </h3>
                        <ul className="space-y-4">
                            {benefits.map((b, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 flex-shrink-0 bg-red-500/15 border border-red-500/25 rounded-lg flex items-center justify-center group-hover:bg-red-500/25 transition-colors duration-300">
                                        <HiCheck className="w-4 h-4 text-red-400" />
                                    </div>
                                    <span className="text-gray-300 font-light group-hover:text-gray-200 transition-colors duration-300">
                                        {b}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Right: form card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
                            {/* Card glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />

                            {/* Corner accents */}
                            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-500/30 rounded-tr-lg" />
                            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-red-500/30 rounded-bl-lg" />

                            <div className="relative z-10">
                                <h3 className="text-xl font-medium text-gray-100 mb-1">
                                    Reservá tu lugar
                                </h3>
                                <p className="text-gray-400 text-sm font-light mb-6">
                                    Completá el formulario y te contactamos.
                                </p>

                                <Suspense fallback={
                                    <div className="flex items-center justify-center py-8">
                                        <div className="w-6 h-6 border-2 border-red-500/40 border-t-red-500 rounded-full animate-spin" />
                                    </div>
                                }>
                                    <WhitelistFormInner />
                                </Suspense>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhitelistSection;
