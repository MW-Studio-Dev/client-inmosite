// constants/dashboardMenu.ts - Configuración del menú del dashboard
import {
  HiHome,
  HiOfficeBuilding,
  HiDesktopComputer,
  HiUsers,
  HiCurrencyDollar,
  HiCog,
  HiSupport,
  HiChartBar,
  HiMail,
  HiDocumentReport,
  HiCash,
  HiBell
} from 'react-icons/hi'
import type { MenuItem } from '@/types/dashboard'

export const dashboardMenuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HiHome,
    description: 'Vista general del sistema',
  },
  {
    name: 'Notificaciones',
    href: '/dashboard/notifications',
    icon: HiBell,
    description: 'Centro de notificaciones',
    badge: 'NEW',
  },
  {
    name: 'Propiedades',
    href: '/dashboard/properties',
    icon: HiOfficeBuilding,
    description: 'Gestionar inmuebles',
    subItems: [
      { name: 'Todas las Propiedades', href: '/dashboard/properties' },
      { name: 'Crear Propiedad', href: '/dashboard/properties/new/' },
      { name: 'En Alquiler', href: '/dashboard/properties/?operation_type=alquiler' },
      { name: 'En Venta', href: '/dashboard/properties/?operation_type=venta' },

    ]
  },
  {
    name: 'Clientes',
    href: '/dashboard/clients',
    icon: HiUsers,
    description: 'Base de datos de clientes',
    subItems: [
      { name: 'Todos los Clientes', href: '/dashboard/clients' },
      { name: 'Inquilinos', href: '/dashboard/clients/tenants' },
      { name: 'Propietarios', href: '/dashboard/clients/owners' },
      { name: 'Compradores', href: '/dashboard/clients/buyers' },
      { name: 'Interesados', href: '/dashboard/clients/leads' },
    ]
  },
  {
    name: 'Alquileres',
    href: '/dashboard/rents',
    icon: HiCurrencyDollar,
    description: 'Gestión de alquileres',
    subItems: [
      { name: 'Contratos Activos', href: '/dashboard/rents/active' },
      { name: 'Solicitudes Pendientes', href: '/dashboard/rents/pending' },
      { name: 'Próximos Vencimientos', href: '/dashboard/rents/expiring' },
      { name: 'Gestión de Cobranzas', href: '/dashboard/rents/payments' },
      { name: 'Contratos Finalizados', href: '/dashboard/rents/finished' },
      { name: 'Crear Contrato', href: '/dashboard/rents/contracts/new' },
    ]
  },
  {
    name: 'Ventas',
    href: '/dashboard/sales',
    icon: HiChartBar,
    description: 'Gestión de ventas',
    subItems: [
      { name: 'Ventas Activas', href: '/dashboard/sales/active' },
      { name: 'Reservas', href: '/dashboard/sales/reservations' },
      { name: 'Boletos de Compraventa', href: '/dashboard/sales/receipts' },
      { name: 'Escrituras', href: '/dashboard/sales/deeds' },
      { name: 'Ventas Concretadas', href: '/dashboard/sales/completed' },
    ]
  },
  {
    name: 'Cobranzas',
    href: '/dashboard/collections',
    icon: HiCash, // o el que prefieras
    description: 'Control de pagos',
    subItems: [
      { name: 'Pagos Pendientes', href: '/dashboard/collections/pending' },
      { name: 'Pagos Realizados', href: '/dashboard/collections/completed' },
      { name: 'Morosos', href: '/dashboard/collections/overdue' },
      { name: 'Reportes de Cobranza', href: '/dashboard/collections/reports' },
    ]
  },
  {
    name: 'Sitio Web',
    href: '/dashboard/website',
    icon: HiDesktopComputer,
    description: 'Administrar sitio web',
    subItems: [
      { name: 'Editor del Sitio', href: '/dashboard/website' },
      { name: 'Vista Previa', href: '/dashboard/website/preview' },
    ]
  },
  {
    name: 'Consultas',
    href: '/dashboard/contact',
    icon: HiMail,
    description: 'Consultas del formulario',
    badge: 'NEW',
    subItems: [
      { name: 'Nuevas', href: '/dashboard/contact/new' },
      { name: 'En Seguimiento', href: '/dashboard/contact/following' },
      { name: 'Finalizadas', href: '/dashboard/contact/closed' },
    ]
  },
  {
    name: 'Reportes',
    href: '/dashboard/reports',
    icon: HiDocumentReport,
    description: 'Informes y estadísticas',
    subItems: [
      { name: 'Dashboard Ejecutivo', href: '/dashboard/reports/executive' },
      { name: 'Alquileres', href: '/dashboard/reports/rents' },
      { name: 'Ventas', href: '/dashboard/reports/sales' },
      { name: 'Propiedades', href: '/dashboard/reports/properties' },
    ]
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