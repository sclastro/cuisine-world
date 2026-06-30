'use client'

import { useState, useRef, useEffect } from 'react'
import { BookMarked, ChevronDown, Check } from 'lucide-react'
import { useMenu } from '@/context/MenuContext'
import { useLanguage } from '@/context/LanguageContext'
import type { MealSummary, CourseType } from '@/lib/types'
import { cn } from '@/lib/utils'

const COURSES: { key: CourseType; label: string; labelZh: string; emoji: string }[] = [
  { key: 'starter', label: 'Starter',     labelZh: '前菜', emoji: '🥗' },
  { key: 'soup',    label: 'Soup',        labelZh: '湯品', emoji: '🍲' },
  { key: 'main',    label: 'Main Course', labelZh: '主菜', emoji: '🍽️' },
  { key: 'dessert', label: 'Dessert',     labelZh: '甜品', emoji: '🍰' },
]

interface Props {
  meal: MealSummary
}

export function AddToMenuButton({ meal }: Props) {
  const { menu, setSlot } = useMenu()
  const { lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(course: CourseType) {
    setSlot(course, meal)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-white text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition-colors shadow-sm"
      >
        <BookMarked size={15} />
        {lang === 'zh' ? '加入菜單' : 'Add to Menu'}
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-green-100 py-2 z-50 overflow-hidden">
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide px-3 pb-1.5">
            {lang === 'zh' ? '選擇課題' : 'Choose a course'}
          </p>
          {COURSES.map(({ key, label, labelZh, emoji }) => {
            const alreadySet = menu[key]?.id === meal.id
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-green-50 transition-colors',
                  alreadySet && 'text-green-600 font-medium'
                )}
              >
                <span>{emoji}</span>
                <span className="flex-1 text-left">{lang === 'zh' ? labelZh : label}</span>
                {alreadySet && <Check size={13} className="text-green-500" />}
                {menu[key] && !alreadySet && (
                  <span className="text-[10px] text-gray-300 truncate max-w-[60px]">
                    {menu[key]!.name}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
