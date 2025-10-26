// components/admin/AdminSidebar.tsx - Sidebar profesional con diseño limpio y modo oscuro
'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'
import { User } from '@/interfaces'
import type { Company } from '@/interfaces/company'
import type { MenuItem } from '@/types/dashboard'
import { useDashboardTheme } from '@/context/DashboardThemeContext'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  menuItems: MenuItem[]
  bottomMenuItems: MenuItem[]
  pathname: string
  user: User | null
  company: Company | null
}

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  }
}

const overlayVariants = {
  open: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
}

export function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  menuItems,
  bottomMenuItems,
  pathname,
  user,
  company
}: AdminSidebarProps) {
  const { theme } = useDashboardTheme()
  const isDark = theme === 'dark'

  return (
    <>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="relative z-50 lg:hidden">
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Sidebar panel */}
            <div className="fixed inset-0 flex">
              <motion.div
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="relative mr-16 flex w-full max-w-xs flex-1"
              >
                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  type="button"
                  className={`absolute -right-14 top-5 flex h-12 w-12 items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-400'
                      : 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500'
                  } focus:ring-offset-2`}
                  onClick={onClose}
                >
                  <HiX className="h-6 w-6" />
                </motion.button>

                <SidebarContent
                  menuItems={menuItems}
                  bottomMenuItems={bottomMenuItems}
                  pathname={pathname}
                  company={company}
                  isDark={isDark}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Static sidebar for desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <SidebarContent
          menuItems={menuItems}
          bottomMenuItems={bottomMenuItems}
          pathname={pathname}
          company={company}
          isCollapsed={isCollapsed}
          isDark={isDark}
        />
      </div>
    </>
  )
}

function SidebarContent({
  menuItems,
  bottomMenuItems,
  pathname,
  company,
  isCollapsed = false,
  isDark = false
}: {
  menuItems: MenuItem[]
  bottomMenuItems: MenuItem[]
  pathname: string
  company: Company | null
  isCollapsed?: boolean
  isDark?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex grow flex-col overflow-y-auto shadow-sm transition-colors duration-300 ${
        isDark
          ? 'bg-gray-900 border-r border-gray-700'
          : 'bg-white border-r border-gray-200'
      }`}
    >
      {/* Header section with logo */}
      <div className={`py-5 transition-colors duration-300 ${
        isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'
      } ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          {isCollapsed ? (
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <span className={`font-bold text-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>I</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Image
                className="items-center justify-center"
                src={isDark ? "/logo.png" : "/logo_white.png"}
                alt="InmoSite"
                width={120}
                height={90}
                priority
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <EnhancedSidebarNavigation
            menuItems={menuItems}
            pathname={pathname}
            isCollapsed={isCollapsed}
            isDark={isDark}
          />
        </motion.div>
      </nav>

      {/* Bottom Menu Items (Settings & Support) */}
      <div className={`py-3 transition-colors duration-300 ${
        isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'
      } ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <EnhancedSidebarNavigation
            menuItems={bottomMenuItems}
            pathname={pathname}
            isCollapsed={isCollapsed}
            isDark={isDark}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className={`py-3 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-800 border-t border-gray-700'
            : 'bg-gray-50 border-t border-gray-200'
        } ${isCollapsed ? 'px-2' : 'px-6'}`}
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          {!isCollapsed && (
            <p className={`text-xs font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>© 2025 InmoSite</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function EnhancedSidebarNavigation({
  menuItems,
  pathname,
  isCollapsed = false,
  isDark = false
}: {
  menuItems: MenuItem[]
  pathname: string
  isCollapsed?: boolean
  isDark?: boolean
}) {
  return (
    <ul role="list" className="space-y-1">
      {menuItems.map((item, index) => (
        <MenuItem
          key={item.href}
          item={item}
          pathname={pathname}
          isCollapsed={isCollapsed}
          isDark={isDark}
          index={index}
        />
      ))}
    </ul>
  )
}

function MenuItem({
  item,
  pathname,
  isCollapsed,
  isDark,
  index
}: {
  item: MenuItem
  pathname: string
  isCollapsed: boolean
  isDark: boolean
  index: number
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const hasSubItems = item.subItems && item.subItems.length > 0

  // Check if any subitem is active
  const isSubItemActive = hasSubItems && item.subItems?.some(
    subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/')
  )

  // Para el Dashboard, solo activar si es exactamente /dashboard
  // Para otros items, activar si comienza con la ruta
  const isActive = item.href === '/dashboard'
    ? pathname === '/dashboard'
    : pathname === item.href || pathname.startsWith(item.href + '/') || isSubItemActive

  React.useEffect(() => {
    // Auto-open if a subitem is active
    if (isSubItemActive) {
      setIsOpen(true)
    }
  }, [isSubItemActive])

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={hasSubItems ? '#' : item.href}
        onClick={handleClick}
        className={`
          group flex items-center rounded-lg transition-all duration-200 relative
          ${isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2.5'}
          ${isActive
            ? isDark
              ? 'bg-gray-700 text-white shadow-sm'
              : 'bg-gray-900 text-white shadow-sm'
            : isDark
              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
        title={isCollapsed ? item.name : undefined}
      >
        {/* Icon */}
        <div className={`
          flex h-6 w-6 items-center justify-center transition-all duration-200
          ${isCollapsed ? '' : 'mr-3'}
          ${isActive
            ? 'text-white'
            : isDark
              ? 'text-gray-400 group-hover:text-gray-200'
              : 'text-gray-500 group-hover:text-gray-700'
          }
        `}>
          {item.icon && <item.icon className="h-5 w-5" />}
        </div>

        {/* Text - Hidden when collapsed */}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-sm font-medium">
              {item.name}
            </span>

            {/* Badge */}
            {item.badge && (
              <span className={`
                ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                ${isActive
                  ? 'bg-white/20 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                }
              `}>
                {item.badge}
              </span>
            )}

            {/* Dropdown arrow for items with subitems */}
            {hasSubItems && (
              <motion.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={`ml-2 h-4 w-4 ${
                  isActive
                    ? 'text-white'
                    : isDark
                      ? 'text-gray-400'
                      : 'text-gray-500'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            )}
          </>
        )}
      </Link>

      {/* SubItems */}
      {hasSubItems && !isCollapsed && (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 ml-9 space-y-1 overflow-hidden"
            >
              {item.subItems?.map((subItem) => {
                const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                return (
                  <li key={subItem.href}>
                    <Link
                      href={subItem.href}
                      className={`
                        flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200
                        ${isSubActive
                          ? isDark
                            ? 'bg-gray-800 text-white font-medium'
                            : 'bg-gray-100 text-gray-900 font-medium'
                          : isDark
                            ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className="flex-1">{subItem.name}</span>
                      {subItem.badge && (
                        <span className={`
                          ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                          ${isSubActive
                            ? isDark
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-900 text-white'
                            : isDark
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                          }
                        `}>
                          {subItem.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </motion.li>
  )
}
