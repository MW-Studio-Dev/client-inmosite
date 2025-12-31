'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type DashboardTheme = 'light' | 'dark'

interface DashboardThemeContextType {
  theme: DashboardTheme
  toggleTheme: () => void
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined)

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<DashboardTheme>('light')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('dashboard-theme') as DashboardTheme
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme)
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error)
    }
    setMounted(true)
  }, [])

  // Save theme to localStorage and apply to HTML element when it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('dashboard-theme', theme)

        // Apply or remove 'dark' class to html element
        const html = document.documentElement
        html.setAttribute('data-theme', theme)

        if (theme === 'dark') {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
        }
      } catch (error) {
        console.error('Error saving theme to localStorage:', error)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <DashboardThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  )
}

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext)
  if (context === undefined) {
    throw new Error('useDashboardTheme must be used within a DashboardThemeProvider')
  }
  return context
}
