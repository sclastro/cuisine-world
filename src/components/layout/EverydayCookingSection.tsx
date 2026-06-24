'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useT } from '@/hooks/useT'

const CARDS = [
  {
    type: 'quick',
    emoji: '⚡',
    titleKey: 'everyday.quick' as const,
    descKey: 'everyday.quickDesc' as const,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
  {
    type: 'asian',
    emoji: '🥢',
    titleKey: 'everyday.asian' as const,
    descKey: 'everyday.asianDesc' as const,
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  {
    type: 'world',
    emoji: '🌍',
    titleKey: 'everyday.world' as const,
    descKey: 'everyday.worldDesc' as const,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
]

export function EverydayCookingSection() {
  const t = useT()
  const { lang } = useLanguage()

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t('everyday.title')}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{t('everyday.subtitle')}</p>
        </div>
        <Link
          href="/everyday"
          className="text-sm text-green-600 hover:underline flex items-center gap-0.5"
        >
          {lang === 'zh' ? '瀏覽全部' : 'Browse all'} <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        {CARDS.map((card) => (
          <Link
            key={card.type}
            href={`/everyday/${card.type}`}
            className={[
              'group flex flex-col items-center gap-2 p-5 rounded-2xl border text-center',
              'hover:shadow-lg hover:-translate-y-1 transition-all duration-250',
              card.bg, card.border,
            ].join(' ')}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
              {card.emoji}
            </span>
            <div>
              <p className="font-bold text-gray-800 text-sm">{t(card.titleKey)}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{t(card.descKey)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
