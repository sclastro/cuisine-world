'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

interface Chip {
  href: string
  en: string
  zh?: string
  prefix?: string // e.g. a flag emoji, shown before the (localized) label
}

interface Props {
  chips: Chip[]
  activeHref?: string
  titleEn?: string
  titleZh?: string
}

// Horizontal, scrollable chip selector with instant EN/ZH labels. The active
// chip is matched by href (not label) so localization doesn't break highlighting.
export function FilterChips({ chips, activeHref, titleEn, titleZh }: Props) {
  const { lang } = useLanguage()
  const zh = lang === 'zh'

  return (
    <div className="space-y-2">
      {titleEn && (
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          {zh && titleZh ? titleZh : titleEn}
        </p>
      )}
      <div className="chips-scroll">
        {chips.map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors shadow-sm',
              chip.href === activeHref
                ? 'bg-green-600 text-white border-green-600 shadow-green-200'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-green-100 dark:border-gray-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700'
            )}
          >
            {chip.prefix ? `${chip.prefix} ` : ''}
            {zh && chip.zh ? chip.zh : chip.en}
          </Link>
        ))}
      </div>
    </div>
  )
}
