'use client'

import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <div
      role="group"
      aria-label="Language / 語言"
      className="flex items-center rounded-full border border-green-200 dark:border-gray-700 overflow-hidden text-sm font-medium"
    >
      <button
        onClick={() => setLang('en')}
        aria-label="English"
        aria-pressed={lang === 'en'}
        className={cn(
          'px-3 py-1 cursor-pointer transition-colors',
          lang === 'en' ? 'bg-green-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400'
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLang('zh')}
        aria-label="中文"
        aria-pressed={lang === 'zh'}
        className={cn(
          'px-3 py-1 cursor-pointer transition-colors',
          lang === 'zh' ? 'bg-green-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400'
        )}
      >
        中
      </button>
    </div>
  )
}
