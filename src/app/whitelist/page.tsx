'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { marketingService } from '@/services/marketingService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from 'sileo';

function WhitelistForm() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Capturar UTM params y guardarlos en cookie si existen
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        const metadata: Record<string, string> = {};

        utmParams.forEach(param => {
            const value = searchParams.get(param);
            if (value) {
                metadata[param] = value;
            }
        });

        if (Object.keys(metadata).length > 0) {
            // Guardar en cookie por 30 días
            const d = new Date();
            d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toUTCString();
            document.cookie = `marketing_info=${JSON.stringify(metadata)};${expires};path=/`;
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Recuperar metadata de la cookie si existe
            let metadata = {};
            const match = document.cookie.match(new RegExp('(^| )marketing_info=([^;]+)'));
            if (match) {
                try {
                    metadata = JSON.parse(match[2]);
                } catch (e) {
                    console.error("Error parsing marketing cookie", e);
                }
            }

            await marketingService.joinWhitelist(email, name, metadata);
            setSubmitted(true);
            toast.success("¡Gracias por registrarte!");
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al registrarte. Por favor intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Card className="w-full max-w-md mx-auto mt-20 text-center">
                <CardHeader>
                    <CardTitle className="text-2xl text-green-600">¡Registro Exitoso!</CardTitle>
                    <CardDescription>
                        Gracias por unirte a nuestra lista de espera.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6">Te hemos enviado un correo de confirmación.</p>
                    <p className="text-sm text-gray-500">Pronto recibirás noticias nuestras.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-20">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Únete a la Lista de Espera</CardTitle>
                <CardDescription className="text-center">
                    Regístrate para obtener acceso anticipado y beneficios exclusivos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Nombre (Opcional)</label>
                        <Input
                            id="name"
                            placeholder="Tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Registrando...' : 'Unirme a la lista'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function WhitelistPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
            <Suspense fallback={<div>Cargando...</div>}>
                <WhitelistForm />
            </Suspense>
        </div>
    );
}
