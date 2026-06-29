'use client'

import { useLanguage } from '@/context/LanguageContext'

interface Props {
  en: string
  zh?: string
  className?: string
}

// Renders the right language for a server-translated string. Both EN and ZH are
// shipped from the server, so toggling is instant with no fetch or flicker.
export function LocalizedText({ en, zh, className }: Props) {
  const { lang } = useLanguage()
  const text = lang === 'zh' && zh ? zh : en
  return <span className={className}>{text}</span>
}
