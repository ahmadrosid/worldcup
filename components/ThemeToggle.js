import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Auto' },
]

const triggerClass =
  'flex items-center justify-center rounded-full border border-gray-300/80 bg-white/90 p-2 text-gray-700 shadow-none backdrop-blur transition hover:bg-gray-100 dark:border-gray-600/80 dark:bg-black/90 dark:text-gray-200 dark:hover:bg-gray-800'

function ThemeIcon({ theme }) {
  if (theme === 'light') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" clipRule="evenodd" />
      </svg>
    )
  }

  if (theme === 'dark') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3v7.5a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-7.5zM5.25 4.5a.75.75 0 00-.75.75v7.5c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-7.5a.75.75 0 00-.75-.75H5.25zM3 12.75A.75.75 0 013.75 12h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm.25 3.75a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75h18.5a.75.75 0 00.75-.75v-.75a.75.75 0 00-.75-.75H3.5z" clipRule="evenodd" />
    </svg>
  )
}

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
          <span className="h-4 w-4 opacity-0" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Theme: ${activeLabel}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={triggerClass}
      >
        <ThemeIcon theme={theme} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme options"
          className="absolute right-0 mt-1 min-w-[5.5rem] rounded-lg border border-gray-200 bg-white py-0.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900"
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
