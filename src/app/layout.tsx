import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import DynamicFavicon from "@/components/common/DynamicFavicon";
import "./globals.css";

// Poppins para textos generales
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Inter como alternativa a Gotham (similar estilo geométrico)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InmoSite - Gestión Inmobiliaria",
  description: "Plataforma completa para la gestión de propiedades inmobiliarias",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/favicon-256x256.png',
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
        className={`${poppins.variable} ${inter.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans`}
        suppressHydrationWarning
      >
        <DynamicFavicon />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}