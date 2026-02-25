'use client'

import { DashboardThemeProvider, useDashboardTheme } from '@/context/DashboardThemeContext'
import { NotificationProvider } from '@/providers/NotificationProvider'
import { HiArrowLeft } from 'react-icons/hi'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

function SubscriptionContent({ children }: { children: React.ReactNode }) {
    const { theme } = useDashboardTheme()
    const isDark = theme === 'dark'
    const { company } = useAuth()

    return (
        <div className={`min-h-screen transition-colors duration-300 font-poppins font-light ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className={`flex items-center gap-2 font-medium hover:opacity-80 transition-opacity ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <HiArrowLeft /> Volver al Dashboard
                    </Link>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {children}
            </main>
        </div>
    )
}

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
    return (
        <NotificationProvider>
            <DashboardThemeProvider>
                <SubscriptionContent>{children}</SubscriptionContent>
            </DashboardThemeProvider>
        </NotificationProvider>
    )
}
