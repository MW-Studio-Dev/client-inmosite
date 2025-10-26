// components/admin/CompanyInfo.tsx
'use client'

import Image from 'next/image'
import { HiOfficeBuilding } from 'react-icons/hi'
import type { Company } from '@/interfaces/company'

interface CompanyInfoProps {
  company: Company | null
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  if (!company) return null

  return (
    <div className="rounded-lg bg-red-50 p-4 border border-red-200">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center">
              <HiOfficeBuilding className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-900 truncate">
            {company.name}
          </p>
          <p className="text-xs text-red-700">
            {company.phone || 'Sin teléfono'}
          </p>
        </div>
      </div>
    </div>
  )
}