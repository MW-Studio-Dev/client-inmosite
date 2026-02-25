import React, { useState, useRef, useEffect } from 'react';
import { WebsiteConfig } from '@/types/website';
import { AddressAutocomplete } from '@/components/dashboard/properties/form-fields/AddressAutocomplete';

interface WebsiteOnboardingProps {
    initialConfig: Partial<WebsiteConfig>;
    onComplete: (config: Partial<WebsiteConfig>) => Promise<void>;
}

export const WebsiteOnboarding: React.FC<WebsiteOnboardingProps> = ({ initialConfig, onComplete }) => {
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);

    const [config, setConfig] = useState<Partial<WebsiteConfig>>({
        company_name: '',
        company_phone: '',
        company_email: '',
        company_whatsapp: '',
        company_address: '',
        primary_color: '#dc2626',
        secondary_color: '#b91c1c',
        ...initialConfig
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [extractedColors, setExtractedColors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFieldChange = (field: keyof WebsiteConfig, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const setFieldValue = (field: string, value: string) => {
        handleFieldChange(field as keyof WebsiteConfig, value);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setLogoPreview(dataUrl);
            handleFieldChange('logo' as any, dataUrl); // We pass base64 to backend
            extractColors(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const extractColors = (dataUrl: string) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const colorBuckets: Record<string, { r: number, g: number, b: number, count: number }> = {};

                for (let i = 0; i < imageData.length; i += 4 * 10) { // step by 10 pixels for speed
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    const a = imageData[i + 3];

                    if (a < 128) continue; // ignore transparent

                    // Simple color bucketing by downsampling color space
                    const rBucket = Math.round(r / 24) * 24;
                    const gBucket = Math.round(g / 24) * 24;
                    const bBucket = Math.round(b / 24) * 24;

                    const bucketKey = `${rBucket},${gBucket},${bBucket}`;
                    if (!colorBuckets[bucketKey]) {
                        colorBuckets[bucketKey] = { r: 0, g: 0, b: 0, count: 0 };
                    }

                    colorBuckets[bucketKey].r += r;
                    colorBuckets[bucketKey].g += g;
                    colorBuckets[bucketKey].b += b;
                    colorBuckets[bucketKey].count++;
                }

                // Calculate scores to find dominant/vibrant colors
                const sortedBuckets = Object.values(colorBuckets).map(bucket => {
                    const avgR = Math.round(bucket.r / bucket.count);
                    const avgG = Math.round(bucket.g / bucket.count);
                    const avgB = Math.round(bucket.b / bucket.count);

                    const maxCh = Math.max(avgR, avgG, avgB);
                    const minCh = Math.min(avgR, avgG, avgB);

                    // Penalize whites/light grays heavily
                    let scorePenalty = 1;
                    if (maxCh > 230 && minCh > 230) {
                        scorePenalty = 0.01; // bright whites
                    } else if (maxCh < 30 && minCh < 30) {
                        scorePenalty = 0.1; // dark blacks
                    } else if (maxCh - minCh < 20) {
                        scorePenalty = 0.2; // neutral grays
                    }

                    const saturation = maxCh === 0 ? 0 : (maxCh - minCh) / maxCh;

                    // Score = frequency * (base + saturation) * penalty
                    const score = bucket.count * (saturation + 0.1) * scorePenalty;

                    return { avgR, avgG, avgB, count: bucket.count, score };
                }).sort((a, b) => b.score - a.score);

                // Filter out too similar colors in the top selection
                const topColors: string[] = [];
                for (const bucket of sortedBuckets) {
                    if (topColors.length >= 4) break;

                    let tooSimilar = false;
                    for (const existingColor of topColors) {
                        const r1 = bucket.avgR;
                        const g1 = bucket.avgG;
                        const b1 = bucket.avgB;

                        const r2 = parseInt(existingColor.slice(1, 3), 16);
                        const g2 = parseInt(existingColor.slice(3, 5), 16);
                        const b2 = parseInt(existingColor.slice(5, 7), 16);

                        const dist = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
                        if (dist < 50) {
                            tooSimilar = true;
                            break;
                        }
                    }

                    if (!tooSimilar) {
                        const rHex = bucket.avgR.toString(16).padStart(2, '0');
                        const gHex = bucket.avgG.toString(16).padStart(2, '0');
                        const bHex = bucket.avgB.toString(16).padStart(2, '0');
                        topColors.push(`#${rHex}${gHex}${bHex}`);
                    }
                }

                if (topColors.length > 0) {
                    setExtractedColors(topColors);
                    handleFieldChange('primary_color', topColors[0]);
                    if (topColors.length > 1) {
                        handleFieldChange('secondary_color', topColors[1]);
                    }
                }
            } catch (err) {
                console.error("Could not extract colors from logo");
            }
        };
    };

    const validateStep1 = () => {
        return config.company_name && config.company_phone && config.company_email && config.company_address;
    };

    const validateStep2 = () => {
        return !!logoPreview;
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onComplete(config);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 mt-10">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido a tu Creador de Sitios Web!</h2>
                <p className="text-gray-600">Vamos a configurar los detalles básicos para crear una experiencia increíble.</p>
            </div>

            <div className="flex gap-4 mb-8">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                ))}
            </div>

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">1. Información de la Empresa</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa *</label>
                            <input
                                type="text"
                                value={config.company_name || ''}
                                onChange={(e) => handleFieldChange('company_name', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Inmobiliaria Central"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Principal *</label>
                            <input
                                type="text"
                                value={config.company_phone || ''}
                                onChange={(e) => handleFieldChange('company_phone', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="+54 11 1234-5678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto *</label>
                            <input
                                type="email"
                                value={config.company_email || ''}
                                onChange={(e) => handleFieldChange('company_email', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="contacto@empresa.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                            <input
                                type="text"
                                value={config.company_whatsapp || ''}
                                onChange={(e) => handleFieldChange('company_whatsapp', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="+54 9 11 1234-5678"
                            />
                        </div>
                    </div>

                    <div className="mt-4 border p-4 rounded-lg bg-gray-50">
                        <h4 className="font-medium text-gray-700 mb-3">Dirección Principal *</h4>
                        <AddressAutocomplete
                            setFieldValue={setFieldValue}
                            fieldMap={{ address: 'company_address' }}
                        >
                            <input
                                type="text"
                                value={config.company_address || ''}
                                onChange={(e) => handleFieldChange('company_address', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ingresar manualmente si es necesario"
                            />
                        </AddressAutocomplete>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            onClick={() => setStep(2)}
                            disabled={!validateStep1()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 transition"
                        >
                            Siguiente Paso
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">2. Identidad Visual</h3>
                    <p className="text-gray-600 text-sm">Sube el logo de tu empresa. Usaremos esta imagen para sugerirte una paleta de colores nativa.</p>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo de la Empresa *</label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleLogoUpload}
                                className="hidden"
                                accept="image/png, image/jpeg, image/svg+xml"
                            />
                            {logoPreview ? (
                                <img src={logoPreview} alt="Preview" className="max-h-32 object-contain" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="mt-1">Clic o arrastra para subir un archivo</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Volver
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            disabled={!validateStep2()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 transition"
                        >
                            Extraer Colores
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">3. Paleta de Colores</h3>

                    {extractedColors.length > 0 && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Colores Extraídos de tu Logo:</h4>
                            <div className="flex gap-4">
                                {extractedColors.map(color => (
                                    <div
                                        key={color}
                                        onClick={() => {
                                            handleFieldChange('primary_color', color);
                                        }}
                                        className="w-12 h-12 rounded-full cursor-pointer shadow-sm border-2 border-white ring-2 ring-transparent hover:ring-blue-400 transition"
                                        style={{ backgroundColor: color }}
                                        title={`Usar como primario: ${color}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Haz clic en un color para usarlo como Color Primario</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color Primario</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={config.primary_color || '#dc2626'}
                                    onChange={(e) => handleFieldChange('primary_color', e.target.value)}
                                    className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                                />
                                <input
                                    type="text"
                                    value={config.primary_color || '#dc2626'}
                                    onChange={(e) => handleFieldChange('primary_color', e.target.value)}
                                    className="px-3 py-2 border rounded-lg font-mono text-sm w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color Secundario</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={config.secondary_color || '#b91c1c'}
                                    onChange={(e) => handleFieldChange('secondary_color', e.target.value)}
                                    className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                                />
                                <input
                                    type="text"
                                    value={config.secondary_color || '#b91c1c'}
                                    onChange={(e) => handleFieldChange('secondary_color', e.target.value)}
                                    className="px-3 py-2 border rounded-lg font-mono text-sm w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg mt-4 text-sm">
                        <p><strong>Nota:</strong> Estos colores se usarán para construir la identidad base de tu sitio web. Podrás modificar todos los demás colores avanzados (textos, fondos, botones de éxito, etc.) más adelante en el panel completo.</p>
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(2)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="px-8 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center min-w-[160px]"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                                'Finalizar Configuración'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
