import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Auto' },
]

const triggerClass =
  'flex items-center gap-1 rounded-full border border-gray-300/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-none backdrop-blur transition hover:bg-gray-100 dark:border-gray-600/80 dark:bg-black/90 dark:text-gray-200 dark:hover:bg-gray-800'

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const activeLabel = OPTIONS.find((option) => option.value === theme)?.label ?? 'Auto'

  useEffect(() => {
    if (!open) return

    const handleClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button type="button" aria-label="Theme" className={triggerClass}>
          <span className="opacity-0">Auto</span>
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className={triggerClass}
      >
        {activeLabel}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3 w-3 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme options"
          className="absolute right-0 mt-1 min-w-full rounded-lg border border-gray-200 bg-white py-0.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              onClick={() => {
                setTheme(option.value)
                setOpen(false)
              }}
              className={`block w-full px-2.5 py-1 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                theme === option.value
                  ? 'font-medium text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
