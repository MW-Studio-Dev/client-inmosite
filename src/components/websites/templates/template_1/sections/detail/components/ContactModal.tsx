'use client';

import React from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ContactFormData } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  templateConfig: any;
  apiProperty?: any;
  contactFormData: ContactFormData;
  onContactFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onContactSubmit: (e: React.FormEvent) => void;
  isSubmittingContact: boolean;
  contactSubmitted: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  property,
  templateConfig,
  apiProperty,
  contactFormData,
  onContactFormChange,
  onContactSubmit,
  isSubmittingContact,
  contactSubmitted
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4" style={{ color: templateConfig.colors.text }}>
          Contactar por esta propiedad
        </h2>

        {property && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${templateConfig.colors.primary}10` }}>
            <h3 className="font-semibold" style={{ color: templateConfig.colors.primary }}>
              {property.title}
            </h3>
            <p className="text-sm text-gray-600">
              {property.location.address}, {property.location.neighborhood}
            </p>
            <p className="text-sm text-gray-600">
              Código: {apiProperty?.internal_code || property.id}
            </p>
          </div>
        )}

        {contactSubmitted ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Mensaje enviado!</h3>
            <p className="text-gray-600">Nos pondremos en contacto contigo pronto.</p>
          </div>
        ) : (
          <form onSubmit={onContactSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={contactFormData.name}
                onChange={onContactFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={contactFormData.phone}
                onChange={onContactFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+54 11 1234-5678"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                name="message"
                value={contactFormData.message}
                onChange={onContactFormChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hola, estoy interesado en esta propiedad..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingContact}
              style={{ backgroundColor: templateConfig.colors.primary }}
              className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmittingContact ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;