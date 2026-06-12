import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'worldcup-theme'

const ThemeContext = createContext(null)

function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(preference) {
  if (preference === 'system') return getSystemTheme()
  return preference
}

function getStoredPreference() {
  if (typeof window === 'undefined') return 'system'

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored

  return 'system'
}

function applyTheme(resolvedTheme) {
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', resolvedTheme === 'dark' ? '#000000' : '#f9fafb')
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system')
  const [resolvedTheme, setResolvedTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const preference = getStoredPreference()
    const resolved = resolveTheme(preference)
    setThemeState(preference)
    setResolvedTheme(resolved)
    applyTheme(resolved)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (nextTheme) => {
    const resolved = resolveTheme(nextTheme)
    setThemeState(nextTheme)
    setResolvedTheme(resolved)
    localStorage.setItem(STORAGE_KEY, nextTheme)
    applyTheme(resolved)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
