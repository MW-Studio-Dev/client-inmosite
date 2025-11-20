// components/admin/AdminHeader.tsx - Header del admin rediseñado
'use client'

import {
  HiMenu,
  HiLogout,
  HiEye,
  HiStatusOnline
} from 'react-icons/hi'
import { User } from '@/interfaces'
import type { Company } from '@/interfaces/company'
import { UserAvatar } from '@/components/dashboard/admin/UserAvatar'
import { NotificationBadge } from '@/components/common/NotificationBadge'

interface AdminHeaderProps {
  onMenuClick: () => void
  onLogout: () => void
  onViewSite: () => void
  user: User | null
  company: Company | null
  subdomain: string
}

export function AdminHeader({
  onMenuClick,
  onLogout,
  onViewSite,
  user,
  company,
  subdomain
}: AdminHeaderProps) {
    return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:text-red-600 transition-colors duration-200"
        onClick={onMenuClick}
      >
        <HiMenu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      {/* Company info */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden lg:block">
            {/* <h1 className="text-lg font-semibold text-gray-900">
              {company?.name}
            </h1> */}
            {subdomain && (
              <div className="flex items-center gap-x-1 mt-0.5">
                <HiStatusOnline className="h-3 w-3 text-red-500" />
                <span className="text-xs text-gray-500 font-medium">
                  {subdomain}.mwstudiodigital.com
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
          {/* View site button */}
          {subdomain && (
            <button
              type="button"
              onClick={onViewSite}
              className="relative rounded-full bg-white p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-200"
              title="Ver sitio público"
            >
              <HiEye className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          {/* Notifications button */}
          <NotificationBadge
            className="relative rounded-full bg-white p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-200"
          />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* User menu */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* User info - only on larger screens */}
            <div className="hidden min-w-0 flex-auto lg:block">
              <div className="text-right">
                <p className="text-sm font-medium leading-6 text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs leading-5 text-gray-500 truncate">
                  {user?.company.subscription_plan}
                </p>
              </div>
            </div>

            {/* User avatar */}
            <UserAvatar
              firstName={user?.first_name}
              lastName={user?.last_name}
              size="sm"
            />

            {/* Logout button */}
            <button
              type="button"
              onClick={onLogout}
              className="relative rounded-full bg-white p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-200"
              title="Cerrar sesión"
            >
              <HiLogout className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}