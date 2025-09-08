# MVP Sistema de Inmobiliarias

Sistema SaaS que permite a inmobiliarias crear su propia web personalizada para publicar propiedades según su plan de suscripción.

## 🚀 Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (Estado global)
- React Hook Form + Zod
- Mercado Pago
- Axios

## 📦 Instalación

```bash
npm install
```

## 🔧 Configuración

1. Copia `.env.example` a `.env.local`
2. Configura las variables de entorno
3. Ejecuta el proyecto: `npm run dev`

## 📁 Estructura

- `/src/app` - Rutas y páginas (App Router)
- `/src/components` - Componentes reutilizables
- `/src/lib` - Utilidades y configuraciones
- `/src/hooks` - Custom hooks
- `/src/types` - Definiciones TypeScript

## 🌐 Rutas Principales

- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro
- `/dashboard` - Panel de administración
- `/site/[domain]` - Sitios públicos de inmobiliarias
