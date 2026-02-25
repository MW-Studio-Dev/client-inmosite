'use client';

import React, { useState } from 'react';
import { 
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { TemplateConfig } from '../../types';

interface ContactSectionProps {
  config: TemplateConfig;
  adaptiveColors: {
    primaryText: string;
    accentText: string;
    backgroundText: string;
    surfaceText: string;
  };
}

const ContactSection: React.FC<ContactSectionProps> = ({ config, adaptiveColors }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyType: ''
  });

  // Early return si la sección de contacto no está habilitada
  if (!config.sections.showContact) return null;

  const contactConfig = config.sections.contact;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      propertyType: ''
    });
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(contactConfig.info.methods.whatsapp.message);
    window.open(`https://wa.me/${config.company.whatsapp}?text=${message}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.open(`tel:${config.company.phone}`, '_self');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${config.company.email}`, '_self');
  };

  return (
    <section 
      id="contact"
      className="py-20" 
      style={{ backgroundColor: config.colors.surface }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl mb-4"
            style={{ 
              color: config.colors.text,
              fontWeight: config.typography.fontWeight.bold,
              fontFamily: config.typography.fontFamily
            }}
          >
            {contactConfig.title}
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ 
              color: config.colors.textLight,
              fontFamily: config.typography.fontFamily
            }}
          >
            {contactConfig.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Información de contacto */}
          <div className="space-y-8">
            <h3 
              className="text-2xl mb-6"
              style={{ 
                color: config.colors.text,
                fontWeight: config.typography.fontWeight.bold,
                fontFamily: config.typography.fontFamily
              }}
            >
              {contactConfig.info.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono */}
              <div 
                className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                style={{ backgroundColor: config.colors.background }}
                onClick={handlePhoneClick}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: config.colors.primary }}
                  >
                    <PhoneIcon className="h-6 w-6" style={{ color: adaptiveColors.primaryText }} />
                  </div>
                  <div>
                    <h4 
                      className="font-semibold text-lg"
                      style={{ 
                        color: config.colors.text,
                        fontWeight: config.typography.fontWeight.semibold,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.phone.title}
                    </h4>
                    <p 
                      className="text-sm"
                      style={{ 
                        color: config.colors.textLight,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {config.company.phone}
                    </p>
                    <p 
                      className="text-xs mt-1"
                      style={{ 
                        color: config.colors.primary,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.phone.action}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div 
                className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                style={{ backgroundColor: config.colors.background }}
                onClick={handleEmailClick}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: config.colors.primary }}
                  >
                    <EnvelopeIcon className="h-6 w-6" style={{ color: adaptiveColors.primaryText  }} />
                  </div>
                  <div>
                    <h4 
                      className="font-semibold text-lg"
                      style={{ 
                        color: config.colors.text,
                        fontWeight: config.typography.fontWeight.semibold,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.email.title}
                    </h4>
                    <p 
                      className="text-sm"
                      style={{ 
                        color: config.colors.textLight,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {config.company.email}
                    </p>
                    <p 
                      className="text-xs mt-1"
                      style={{ 
                        color: config.colors.primary,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.email.action}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div 
                className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                style={{ backgroundColor: config.colors.background }}
                onClick={handleWhatsAppClick}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: config.colors.primary }}
                  >
                    <ChatBubbleLeftRightIcon className="h-6 w-6" style={{ color: adaptiveColors.primaryText }} />
                  </div>
                  <div>
                    <h4 
                      className="font-semibold text-lg"
                      style={{ 
                        color: config.colors.text,
                        fontWeight: config.typography.fontWeight.semibold,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.whatsapp.title}
                    </h4>
                    <p 
                      className="text-sm"
                      style={{ 
                        color: config.colors.textLight,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.whatsapp.value}
                    </p>
                    <p 
                      className="text-xs mt-1"
                      style={{ 
                        color: config.colors.primary,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.whatsapp.action}
                    </p>
                  </div>
                </div>
              </div>

              {/* Oficina */}
              <div 
                className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                style={{ backgroundColor: config.colors.background }}
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(config.company.address)}`, '_blank')}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: config.colors.primary }}
                  >
                    <MapPinIcon className="h-6 w-6" style={{ color: adaptiveColors.primaryText }} />
                  </div>
                  <div>
                    <h4 
                      className="font-semibold text-lg"
                      style={{ 
                        color: config.colors.text,
                        fontWeight: config.typography.fontWeight.semibold,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.office.title}
                    </h4>
                    <p 
                      className="text-sm"
                      style={{ 
                        color: config.colors.textLight,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {config.company.address}
                    </p>
                    <p 
                      className="text-xs mt-1"
                      style={{ 
                        color: config.colors.primary,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {contactConfig.info.methods.office.action}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios de atención */}
            <div 
              className="p-6 rounded-xl"
              style={{ backgroundColor: config.colors.background }}
            >
              <h4 
                className="text-lg mb-4"
                style={{ 
                  color: config.colors.text,
                  fontWeight: config.typography.fontWeight.semibold,
                  fontFamily: config.typography.fontFamily
                }}
              >
                {contactConfig.info.schedule.title}
              </h4>
              <div className="space-y-2">
                {contactConfig.info.schedule.hours.map((schedule, index) => (
                  <div key={index} className="flex justify-between">
                    <span 
                      style={{ 
                        color: config.colors.textLight,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {schedule.days}
                    </span>
                    <span 
                      style={{ 
                        color: config.colors.text,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div 
            className="p-8 rounded-xl shadow-lg"
            style={{ backgroundColor: config.colors.background }}
          >
            <h3 
              className="text-2xl mb-6"
              style={{ 
                color: config.colors.text,
                fontWeight: config.typography.fontWeight.bold,
                fontFamily: config.typography.fontFamily
              }}
            >
              {contactConfig.form.title}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block text-sm mb-2"
                    style={{ 
                      color: config.colors.text,
                      fontWeight: config.typography.fontWeight.medium,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    {contactConfig.form.fields.name.label}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder={contactConfig.form.fields.name.placeholder}
                    className="w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none"
                    style={{ 
                      borderColor: config.colors.textLight,
                      backgroundColor: config.colors.surface,
                      color: config.colors.text,
                      fontFamily: config.typography.fontFamily
                    }}
                    onFocus={(e) => e.target.style.borderColor = config.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = config.colors.textLight}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-sm mb-2"
                    style={{ 
                      color: config.colors.text,
                      fontWeight: config.typography.fontWeight.medium,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    {contactConfig.form.fields.email.label}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder={contactConfig.form.fields.email.placeholder}
                    className="w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none"
                    style={{ 
                      borderColor: config.colors.textLight,
                      backgroundColor: config.colors.surface,
                      color: config.colors.text,
                      fontFamily: config.typography.fontFamily
                    }}
                    onFocus={(e) => e.target.style.borderColor = config.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = config.colors.textLight}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block text-sm mb-2"
                    style={{ 
                      color: config.colors.text,
                      fontWeight: config.typography.fontWeight.medium,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    {contactConfig.form.fields.phone.label}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={contactConfig.form.fields.phone.placeholder}
                    className="w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none"
                    style={{ 
                      borderColor: config.colors.textLight,
                      backgroundColor: config.colors.surface,
                      color: config.colors.text,
                      fontFamily: config.typography.fontFamily
                    }}
                    onFocus={(e) => e.target.style.borderColor = config.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = config.colors.textLight}
                  />
                </div>

                <div>
                  <label 
                    className="block text-sm mb-2"
                    style={{ 
                      color: config.colors.text,
                      fontWeight: config.typography.fontWeight.medium,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    {contactConfig.form.fields.propertyType.label}
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none"
                    style={{ 
                      borderColor: config.colors.textLight,
                      backgroundColor: config.colors.surface,
                      color: config.colors.text,
                      fontFamily: config.typography.fontFamily
                    }}
                    onFocus={(e) => e.target.style.borderColor = config.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = config.colors.textLight}
                  >
                    <option value="">
                      {contactConfig.form.fields.propertyType.placeholder}
                    </option>
                    {contactConfig.form.fields.propertyType.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm mb-2"
                  style={{ 
                    color: config.colors.text,
                    fontWeight: config.typography.fontWeight.medium,
                    fontFamily: config.typography.fontFamily
                  }}
                >
                  {contactConfig.form.fields.message.label}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder={contactConfig.form.fields.message.placeholder}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none resize-none"
                  style={{ 
                    borderColor: config.colors.textLight,
                    backgroundColor: config.colors.surface,
                    color: config.colors.text,
                    fontFamily: config.typography.fontFamily
                  }}
                  onFocus={(e) => e.target.style.borderColor = config.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = config.colors.textLight}
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 rounded-lg transition-colors duration-200"
                style={{ 
                  backgroundColor: config.colors.primary,
                  color: adaptiveColors.primaryText,
                  fontWeight: config.typography.fontWeight.semibold,
                  fontFamily: config.typography.fontFamily
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.colors.primaryDark}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.colors.primary}
              >
                {contactConfig.form.submitButton}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
