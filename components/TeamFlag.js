import { useState } from 'react'

const FLAG_URL_PREFIX = 'https://api.fifa.com/api/v3/picture/flags-sq-3/'

function FlagPlaceholder({ className = '' }) {
  return (
    <div
      className={`flex items-center justify-center bg-gray-200/80 dark:bg-gray-700/60 text-gray-400 dark:text-gray-500 rounded-md border border-gray-300 dark:border-gray-600 ${className}`}
      aria-hidden="true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 opacity-60">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    </div>
  )
}

export default function TeamFlag({ name, country, className = 'h-12 w-16' }) {
  const [failed, setFailed] = useState(false)
  const hasFlag = Boolean(country?.trim()) && !failed

  if (!hasFlag) {
    return <FlagPlaceholder className={className} />
  }

  return (
    <img
      alt={name}
      src={FLAG_URL_PREFIX + country}
      className={`object-cover rounded-md border ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
