import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { GlobalLoaderProvider } from "@/context/GlobalLoaderContext";
import { AuthProvider } from "@/providers/AuthProvider";
import { AuthMonitor } from "@/components/auth/AuthMonitor";
import { GlobalLoaderWithHook } from "@/components/common/Loading";
import "./globals.css";

// Poppins para textos generales
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});



const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inmosite.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "InmoSite - Gestión Inmobiliaria",
    template: "%s | InmoSite"
  },
  description: "Plataforma completa para la gestión de propiedades inmobiliarias. Administra tus propiedades, clientes y sitios web desde un solo lugar.",
  keywords: ["inmobiliaria", "gestión inmobiliaria", "propiedades", "casas", "departamentos", "alquileres", "ventas", "inmobiliarias"],
  authors: [{ name: "InmoSite" }],
  creator: "InmoSite",
  publisher: "InmoSite",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: "InmoSite",
    title: "InmoSite - Gestión Inmobiliaria",
    description: "Plataforma completa para la gestión de propiedades inmobiliarias",
    images: [
      {
        url: "/hero-image.webp",
        width: 1200,
        height: 630,
        alt: "InmoSite - Gestión Inmobiliaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InmoSite - Gestión Inmobiliaria",
    description: "Plataforma completa para la gestión de propiedades inmobiliarias",
    images: ["/hero-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/favicon-256x256.png',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-256x256.png" />
      </head>
      <body
        className={`${poppins.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-poppins`}
        suppressHydrationWarning
      >
        <GlobalLoaderProvider>
          <AuthProvider>
            <AuthMonitor />
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
          <GlobalLoaderWithHook />
        </GlobalLoaderProvider>
      </body>
    </html>
  );
}