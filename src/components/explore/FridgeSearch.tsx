'use client'

import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react'
import { Plus, X, Check, Search, Refrigerator } from 'lucide-react'
import { searchByIngredients } from '@/app/actions'
import { INGREDIENT_GROUPS } from '@/lib/ingredients'
import { useT } from '@/hooks/useT'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import type { Meal } from '@/lib/types'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { SkeletonGrid } from '@/components/ui/SkeletonCard'

// "Cook From Your Fridge": a curated, bilingual, grouped ingredient catalog
// (see lib/ingredients.ts) rendered as region-page-style cards. Selecting
// cards auto-searches after a short pause — no hunting for a submit button.
// A free-text input still covers anything not in the catalog.

const AUTO_SEARCH_MS = 600

export function FridgeSearch() {
  const t = useT()
  const { lang } = useLanguage()
  const zh = lang === 'zh'
  const [selected, setSelected] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [meals, setMeals] = useState<Meal[]>([])
  const [searched, setSearched] = useState(false)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Display label for a selected id: catalog entry (localized) or the raw text.
  function labelFor(id: string): string {
    for (const g of INGREDIENT_GROUPS) {
      const item = g.items.find((i) => i.id === id)
      if (item) return `${item.emoji} ${zh ? item.zh : item.en}`
    }
    return id
  }

  function runSearch(ids: string[]) {
    if (ids.length === 0) {
      setMeals([])
      setSearched(false)
      return
    }
    startTransition(async () => {
      const results = await searchByIngredients(ids)
      setMeals(results)
      setSearched(true)
    })
  }

  // Auto-search shortly after any selection change.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(selected), AUTO_SEARCH_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  function toggle(id: string) {
    setSelected((prev) =>
      prev.some((x) => x.toLowerCase() === id.toLowerCase())
        ? prev.filter((x) => x.toLowerCase() !== id.toLowerCase())
        : [...prev, id]
    )
  }

  function addFreeText(e: FormEvent) {
    e.preventDefault()
    const v = input.trim()
    if (!v) return
    setSelected((prev) =>
      prev.some((x) => x.toLowerCase() === v.toLowerCase()) ? prev : [...prev, v]
    )
    setInput('')
  }

  const isSelected = (id: string) => selected.some((x) => x.toLowerCase() === id.toLowerCase())

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/60 flex items-center justify-center">
          <Refrigerator size={18} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-50">{t('fridge.title')}</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">{t('fridge.subtitle')}</p>
        </div>
      </div>

      {/* Free-text add + explicit search trigger */}
      <form onSubmit={addFreeText} className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-full border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 px-4 py-2 focus-within:border-green-400 focus-within:bg-white dark:focus-within:bg-gray-800">
          <Plus size={16} className="text-green-500 shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('fridge.placeholder')}
            aria-label={t('fridge.placeholder')}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <button
          type="button"
          onClick={() => runSearch(selected)}
          disabled={selected.length === 0 || isPending}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
        >
          <Search size={15} />
          {isPending ? t('fridge.finding') : t('fridge.find')}
        </button>
      </form>

      {/* Selected summary strip */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40 px-3 py-2.5">
          <span className="text-xs font-semibold text-green-700 dark:text-green-400">
            {t('fridge.selected')} ({selected.length})
          </span>
          {selected.map((id) => (
            <span
              key={id}
              className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-0.5 rounded-full bg-green-600 text-white text-xs"
            >
              {labelFor(id)}
              <button onClick={() => toggle(id)} aria-label={`Remove ${id}`} className="hover:bg-white/20 rounded-full p-0.5">
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            onClick={() => setSelected([])}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 px-1.5 ml-auto"
          >
            {t('fridge.clear')}
          </button>
        </div>
      )}

      {/* Grouped ingredient catalog — region-page-style cards */}
      <div className="space-y-6">
        {INGREDIENT_GROUPS.map((group) => (
          <div key={group.id} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              {group.emoji} {zh ? group.titleZh : group.titleEn}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {group.items.map((item) => {
                const active = isSelected(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all',
                      active
                        ? 'bg-green-600 border-green-600 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 border-green-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700 hover:shadow-sm'
                    )}
                  >
                    <span className="text-xl shrink-0">{item.emoji}</span>
                    <span className="text-sm font-medium truncate">
                      {zh ? item.zh : item.en}
                    </span>
                    {active && <Check size={14} className="ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      {isPending ? (
        <SkeletonGrid />
      ) : searched ? (
        <div className="space-y-4">
          {meals.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {meals.length} {t('fridge.results')}
            </p>
          )}
          <RecipeGrid meals={meals} showSnippet emptyMessage={t('fridge.empty')} />
        </div>
      ) : (
        <p className="text-center text-gray-400 dark:text-gray-500 py-10 text-sm">{t('fridge.hint')}</p>
      )}
    </div>
  )
}
