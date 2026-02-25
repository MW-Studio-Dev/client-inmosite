"use client";

import React, { useState } from 'react';
import { Button } from "@heroui/react";
import { HiCheck, HiPaperAirplane, HiEnvelope, HiPhone, HiClock } from "react-icons/hi2";
import { contactService } from '@/services/contactService';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  message: string;
}

type SubmitStatus = 'success' | 'error' | null;

interface ContactProps {
  companyData?: any;
}

const Contact: React.FC<ContactProps> = ({ companyData }) => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const contactInfo = [
    { icon: <HiEnvelope className="w-5 h-5 text-red-400" />, text: "info@mwstudiodigital.com.ar" },
    { icon: <HiPhone className="w-5 h-5 text-red-400" />, text: "+54 9 11 3467 2565" },
    { icon: <HiClock className="w-5 h-5 text-red-400" />, text: "Lun - Vie: 9:00 AM - 6:00 PM" }
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev: ContactForm) => ({
      ...prev,
      [field]: value
    }));
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const generateWhatsAppMessage = () => {
    const { name, email, company, message } = formData;

    let whatsappMessage = `🏢 *Nueva Consulta desde MW Studio Digital*\n\n`;
    whatsappMessage += `👤 *Nombre:* ${name}\n`;
    whatsappMessage += `📧 *Email:* ${email}\n`;

    if (company.trim()) {
      whatsappMessage += `🏠 *Inmobiliaria:* ${company}\n`;
    }

    whatsappMessage += `\n💬 *Mensaje:*\n${message}\n\n`;
    whatsappMessage += `⏰ *Enviado desde la web el:* ${new Date().toLocaleString('es-AR')}\n\n`;
    whatsappMessage += `¡Gracias por contactarnos! 🚀`;

    return encodeURIComponent(whatsappMessage);
  };

  const handleSubmitForm = async () => {
    // Validaciones
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await contactService.sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || undefined,
        message: formData.message.trim(),
      });

      setFormData({ name: '', email: '', company: '', message: '' });
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border border-gray-600/50 bg-gray-800/50 backdrop-blur-sm
    text-gray-100 placeholder-gray-400 font-light
    focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
    hover:border-gray-500/70 transition-all duration-300
  `;

  const inputErrorClasses = `
    w-full px-4 py-3 rounded-xl border border-red-500/60 bg-gray-800/50 backdrop-blur-sm
    text-gray-100 placeholder-gray-400 font-light
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
    transition-all duration-300
  `;

  const labelClasses = "block text-sm font-light text-gray-200 mb-2";

  return (
    <section id="contacto" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extralight mb-4 tracking-tight">
                <span className="text-gray-100">
                  ¿Tienes{" "}
                  <span className="text-red-400 font-light">preguntas?</span>
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-light">
                  Hablemos
                </span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                Nuestro equipo está aquí para ayudarte. Envíanos un mensaje y te responderemos en menos de{" "}
                <span className="text-red-400 font-normal">24 horas</span>.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 group-hover:border-red-400/50 transition-all duration-300">
                    <span className="text-xl">{contact.icon}</span>
                  </div>
                  <span className="text-gray-300 font-light group-hover:text-red-400 transition-colors duration-300">
                    {contact.text}
                  </span>
                </div>
              ))}
            </div>



            {/* Additional contact features */}
            <div className="mt-12 p-6 bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
              <h3 className="text-lg font-medium text-gray-100 mb-4">¿Por qué elegirnos?</h3>
              <div className="space-y-3">
                {[
                  "Respuesta garantizada en 24 horas",
                  "Soporte técnico especializado",
                  "Consultoría gratuita personalizada",
                  "Migración de datos sin costo"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 bg-red-500/20 rounded-full border border-red-500/30">
                      <HiCheck className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm font-light">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-red-500/10 transition-all duration-500">
            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-green-500/30 rounded-full">
                    <HiCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-green-400 font-light text-sm">
                    ¡Mensaje enviado! Te responderemos en menos de 24 horas.
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <span className="text-red-400 font-light text-sm">
                  Por favor, completa todos los campos requeridos con información válida.
                </span>
              </div>
            )}



            {/* Form Fields */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label htmlFor="name" className={labelClasses}>
                  Nombre completo *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={submitStatus === 'error' && !formData.name.trim() ? inputErrorClasses : inputClasses}
                />
                {submitStatus === 'error' && !formData.name.trim() && (
                  <p className="mt-1 text-sm text-red-400 font-light">Este campo es requerido</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={submitStatus === 'error' && (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ? inputErrorClasses : inputClasses}
                />
                {submitStatus === 'error' && !formData.email.trim() && (
                  <p className="mt-1 text-sm text-red-400 font-light">Este campo es requerido</p>
                )}
                {submitStatus === 'error' && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <p className="mt-1 text-sm text-red-400 font-light">Formato de email inválido</p>
                )}
              </div>

              {/* Inmobiliaria */}
              <div>
                <label htmlFor="company" className={labelClasses}>
                  Inmobiliaria
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Nombre de tu inmobiliaria"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={inputClasses}
                />
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="message" className={labelClasses}>
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  rows={7}
                  placeholder="Cuéntanos sobre tu proyecto..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`${submitStatus === 'error' && !formData.message.trim() ? inputErrorClasses : inputClasses} resize-none`}
                />
                {submitStatus === 'error' && !formData.message.trim() && (
                  <p className="mt-1 text-sm text-red-400 font-light">Este campo es requerido</p>
                )}
              </div>

              <Button
                size="lg"
                onClick={handleSubmitForm}
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-6 font-medium shadow-lg hover:shadow-red-500/30 hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
                endContent={isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <HiPaperAirplane className="w-5 h-5" />}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
