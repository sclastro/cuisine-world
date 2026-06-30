'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'
import type { MealSummary, CourseType } from '@/lib/types'
import { useMenu } from '@/context/MenuContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

const COURSE_CONFIG: Record<CourseType, {
  label: string
  labelZh: string
  emoji: string
  browseHref: string
  bg: string
  border: string
  badgeBg: string
}> = {
  starter: {
    label: 'Starter', labelZh: '前菜', emoji: '🥗',
    browseHref: '/category/Starter',
    bg: 'bg-lime-50', border: 'border-lime-200', badgeBg: 'bg-lime-100 text-lime-700',
  },
  soup: {
    label: 'Soup', labelZh: '湯品', emoji: '🍲',
    browseHref: '/search?q=soup',
    bg: 'bg-orange-50', border: 'border-orange-200', badgeBg: 'bg-orange-100 text-orange-700',
  },
  main: {
    label: 'Main Course', labelZh: '主菜', emoji: '🍽️',
    browseHref: '/category/Beef',
    bg: 'bg-green-50', border: 'border-green-200', badgeBg: 'bg-green-100 text-green-700',
  },
  dessert: {
    label: 'Dessert', labelZh: '甜品', emoji: '🍰',
    browseHref: '/category/Dessert',
    bg: 'bg-pink-50', border: 'border-pink-200', badgeBg: 'bg-pink-100 text-pink-700',
  },
}

interface Props {
  course: CourseType
}

export function MenuSlot({ course }: Props) {
  const { menu, setSlot } = useMenu()
  const { lang } = useLanguage()
  const config = COURSE_CONFIG[course]
  const meal: MealSummary | null = menu[course]
  const courseLabel = lang === 'zh' ? config.labelZh : config.label

  if (!meal) {
    return (
      <div className={cn(
        'relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center min-h-[180px] transition-all',
        config.bg, config.border,
        'hover:shadow-sm'
      )}>
        <span className="text-4xl">{config.emoji}</span>
        <div>
          <p className="font-semibold text-gray-700 text-sm">{config.label}</p>
          <p className="text-xs text-gray-400">{config.labelZh}</p>
        </div>
        <Link
          href={config.browseHref}
          className={cn(
            'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-colors',
            'bg-white border shadow-sm hover:shadow-md',
            config.badgeBg
          )}
        >
          <Plus size={12} />
          {lang === 'zh' ? `揀${config.labelZh}` : `Browse ${config.label}`}
        </Link>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-white border border-green-100 shadow-sm group">
      {/* Meal image */}
      <div className="relative aspect-video">
        <Image
          src={meal.thumbnail}
          alt={meal.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
        {/* Course badge */}
        <span className={cn(
          'absolute top-2 left-2 text-xs font-semibold px-2.5 py-0.5 rounded-full',
          config.badgeBg
        )}>
          {config.emoji} {courseLabel}
        </span>
        {/* Remove button */}
        <button
          onClick={() => setSlot(course, null)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Remove"
        >
          <X size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <Link
          href={`/recipe/${meal.id}`}
          className="block text-sm font-semibold text-gray-800 hover:text-green-700 line-clamp-1 transition-colors"
        >
          {meal.name}
        </Link>
        <div className="flex items-center gap-1.5">
          {meal.area && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
              {meal.area}
            </span>
          )}
          <button
            onClick={() => setSlot(course, null)}
            className="ml-auto text-[11px] text-gray-400 hover:text-red-500 transition-colors"
          >
            {lang === 'zh' ? '更換' : 'Change'}
          </button>
        </div>
      </div>
    </div>
  )
}
