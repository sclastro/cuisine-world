'use client'

import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center rounded-full border border-green-200 overflow-hidden text-sm font-medium">
      <button
        onClick={() => setLang('en')}
        className={cn(
          'px-3 py-1 transition-colors',
          lang === 'en' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-700'
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLang('zh')}
        className={cn(
          'px-3 py-1 transition-colors',
          lang === 'zh' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-700'
        )}
      >
        中
      </button>
    </div>
  )
}
