// constants/adminMenu.ts
import { 
    HiHome, 
    HiOfficeBuilding, 
    HiGlobe, 
    HiCog
  } from 'react-icons/hi'
  import { MenuItem } from '@/types/dashboard'
  
  export const menuItems: MenuItem[] = [
    {
      name: 'Propiedades',
      href: '/dashboard/properties',
      icon: HiHome,
      description: 'Gestiona tu catálogo de propiedades',
      // badge:1
    },
    {
      name: 'Sitio Web',
      href: '/dashboard/website',
      icon: HiGlobe,
      description: 'Personaliza tu página web',
      // badge:2
    },
    {
      name: 'Configuración',
      href: '/dashboard/config',
      icon: HiCog,
      description: 'Ajustes generales de tu cuenta',
      // badge:3
    },
    {
      name: 'Inmobiliaria',
      href: '/dashboard/profile',
      icon: HiOfficeBuilding,
      description: 'Información de tu empresa',
      // badge:4
    }
  ]