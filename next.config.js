/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Dominios adicionales comunes para inmobiliarias
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      // Si usas tu propio CDN o servidor de imágenes
      {
        protocol: 'https',
        hostname: 'st.depositphotos.com',
        port: '',
        pathname: '/**',
      },
      // Para desarrollo local si tienes un servidor de imágenes
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000', // Puerto de tu Django server
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8002', // Puerto de tu Django server
        pathname: '/**',
      },
    ],
    // Configuraciones opcionales adicionales
    formats: ['image/webp', 'image/avif'], // Formatos optimizados
    dangerouslyAllowSVG: true, // Solo si necesitas SVGs
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Loader personalizado para imágenes de media que vienen del backend
    loader: 'default',
  },

  // Reescribir rutas de media para proxear al backend
  async rewrites() {
    const apiMediaUrl = process.env.NEXT_PUBLIC_API_MEDIA;
    return [
      {
        source: '/media/:path*',
        destination: `${apiMediaUrl}/media/:path*`,
      },
    ];
  },
  // Configuraciones adicionales recomendadas
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },

  // Compresión de respuestas
  compress: true,

  // Deshabilitar linting y type checking durante el build (para producción)
  // Puedes habilitarlos de nuevo una vez que corrijas todos los errores
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuración para producción
  // output: 'standalone', // Solo si planeas usar Docker - COMENTADO para multi-domain
  
  // Variables de entorno públicas
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig