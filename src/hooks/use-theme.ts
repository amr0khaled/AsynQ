'use client'
import { useEffect, useState } from "react"


export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  // detect the browser default theme
  useEffect(() => {
    // Get initial theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const initialTheme = mediaQuery.matches ? 'dark' : 'light'
    setTheme(initialTheme)

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // modify the web app theme according to client's theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return {
    theme,
    setTheme
  }
}
