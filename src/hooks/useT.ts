'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t, type TranslationKey } from '@/lib/i18n'

// Returns a translator bound to the current language.
export function useT() {
  const { lang } = useLanguage()
  return (key: TranslationKey) => t(key, lang)
}
