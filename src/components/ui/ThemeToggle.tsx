'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  const { lang } = useLanguage()

  const isDark = mounted && theme === 'dark'
  const label = isDark
    ? (lang === 'zh' ? '切換至淺色' : 'Switch to light')
    : (lang === 'zh' ? '切換至深色' : 'Switch to dark')

  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-9 h-9 rounded-full border border-green-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}
