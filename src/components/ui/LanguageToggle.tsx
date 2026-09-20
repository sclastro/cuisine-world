'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  const isZh = lang === 'zh'
  const label = isZh ? '切換至英文' : 'Switch to 中文'

  return (
    <button
      onClick={() => setLang(isZh ? 'en' : 'zh')}
      aria-label={label}
      title={label}
      className="shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-full border border-green-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
    >
      <Languages size={17} />
      {isZh ? '中' : 'EN'}
    </button>
  )
}
