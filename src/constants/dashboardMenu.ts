// constants/dashboardMenu.ts - Configuración del menú del dashboard
import {
  HiHome,
  HiOfficeBuilding,
  HiDesktopComputer,
  HiUsers,
  HiCurrencyDollar,
  HiShoppingCart,
  HiCog,
  HiSupport,
  HiChartBar,
  HiMail,
  HiBeaker
} from 'react-icons/hi'
import type { MenuItem } from '@/types/dashboard'

// Menú principal del dashboard
export const dashboardMenuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HiHome,
    description: 'Vista general del sistema',
  },
  {
    name: 'Propiedades',
    href: '/dashboard/properties',
    icon: HiOfficeBuilding,
    description: 'Gestionar inmuebles',
    subItems: [
      { name: 'Todas', href: '/dashboard/properties' },
      { name: 'En Venta', href: '/dashboard/properties/sale' },
      { name: 'En Alquiler', href: '/dashboard/properties/rent' },
    ]
  },
  {
    name: 'Sitio Web',
    href: '/dashboard/website',
    icon: HiDesktopComputer,
    description: 'Administrar sitio web',
    subItems: [
      { name: 'Configuración', href: '/dashboard/website' },
      { name: 'Preview', href: '/dashboard/website/preview' },
    ]
  },
  {
    name: 'Clientes',
    href: '/dashboard/clients',
    icon: HiUsers,
    description: 'Base de datos de clientes',
    subItems: [
      { name: 'Inquilinos', href: '/dashboard/clients/tenants' },
      { name: 'Propietarios', href: '/dashboard/clients/owners' },
      { name: 'Otros', href: '/dashboard/clients/others' },
    ]
  },
  {
    name: 'Alquileres',
    href: '/dashboard/rents',
    icon: HiCurrencyDollar,
    description: 'Gestión de alquileres',
    subItems: [
      { name: 'Alquileres', href: '/dashboard/rents' },
      { name: 'Contratos', href: '/dashboard/rents/contracts' },
      { name: 'Planes de Pago', href: '/dashboard/rents/payment-plans' },
    ]
  },
  {
    name: 'Ventas',
    href: '/dashboard/sales',
    icon: HiChartBar,
    description: 'Gestión de ventas',
    subItems: [
      { name: 'Todas', href: '/dashboard/sales' },
      { name: 'Boletos', href: '/dashboard/sales/receipts' },
    ]
  },
  {
    name: 'Contacto',
    href: '/dashboard/contact',
    icon: HiMail,
    description: 'Consultas del formulario',
    badge: 'NEW'
  },
  {
    name: 'Test',
    href: '/dashboard/test',
    icon: HiBeaker,
    description: 'Página de prueba',
  },
]

// Menú inferior (Configuración y Soporte)
export const dashboardBottomMenuItems: MenuItem[] = [
  {
    name: 'Configuración',
    href: '/dashboard/config',
    icon: HiCog,
    description: 'Ajustes del sistema',
  },
  {
    name: 'Soporte',
    href: '/dashboard/support',
    icon: HiSupport,
    description: 'Ayuda y asistencia',
  }
]