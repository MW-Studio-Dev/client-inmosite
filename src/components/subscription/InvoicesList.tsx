'use client'

import { useEffect, useState } from 'react'
import { subscriptionService } from '@/services/subscriptionService'
import type { Invoice } from '@/types/subscription'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import { HiDownload, HiDocumentText } from 'react-icons/hi'

export default function InvoicesList() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)
    const [downloadingId, setDownloadingId] = useState<string | null>(null)
    const { theme } = useDashboardTheme()
    const isDark = theme === 'dark'

    useEffect(() => {
        loadInvoices()
    }, [])

    const loadInvoices = async () => {
        try {
            const response = await subscriptionService.getInvoices({ page_size: 10 })
            setInvoices(response?.results || [])
        } catch (error) {
            console.error('Error loading invoices:', error)
            setInvoices([])
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
        setDownloadingId(invoiceId)
        try {
            const blob = await subscriptionService.downloadInvoice(invoiceId)

            // Crear un enlace temporal para descargar el PDF
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${invoiceNumber}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading invoice:', error)
            alert('Error al descargar la factura')
        } finally {
            setDownloadingId(null)
        }
    }

    if (loading) {
        return (
            <div className={`rounded-2xl p-6 border animate-pulse ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (!invoices || invoices.length === 0) {
        return null // O mostrar mensaje de "No hay facturas"
    }

    return (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <HiDocumentText className="text-blue-500" />
                    Historial de Facturas
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className={`text-xs uppercase ${isDark ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                        <tr>
                            <th className="px-6 py-3 font-medium">Número</th>
                            <th className="px-6 py-3 font-medium">Fecha</th>
                            <th className="px-6 py-3 font-medium">Período</th>
                            <th className="px-6 py-3 font-medium">Monto</th>
                            <th className="px-6 py-3 font-medium">Estado</th>
                            <th className="px-6 py-3 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                                <td className={`px-6 py-4 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {invoice.invoice_number}
                                </td>
                                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {new Date(invoice.created_at).toLocaleDateString()}
                                </td>
                                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {new Date(invoice.period_start).toLocaleDateString()} - {new Date(invoice.period_end).toLocaleDateString()}
                                </td>
                                <td className={`px-6 py-4 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {invoice.total_display}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${invoice.status === 'paid'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : invoice.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }
                  `}>
                                        {invoice.status === 'paid' ? 'Pagada' : invoice.status === 'pending' ? 'Pendiente' : 'Fallida'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                                        disabled={downloadingId === invoice.id}
                                        className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${isDark
                                            ? 'text-blue-400 hover:text-blue-300 disabled:text-gray-600'
                                            : 'text-blue-600 hover:text-blue-700 disabled:text-gray-400'
                                            }`}
                                    >
                                        {downloadingId === invoice.id ? (
                                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                        ) : (
                                            <HiDownload className="h-4 w-4" />
                                        )}
                                        PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
