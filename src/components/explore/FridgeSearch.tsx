'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { Plus, X, Search, Refrigerator } from 'lucide-react'
import { searchByIngredients } from '@/app/actions'
import { useT } from '@/hooks/useT'
import { cn } from '@/lib/utils'
import type { Meal } from '@/lib/types'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { SkeletonGrid } from '@/components/ui/SkeletonCard'

// TheMealDB matches ingredient names in English, so quick-picks are English
// (the recipe cards themselves still localize normally).
const POPULAR = ['Chicken', 'Egg', 'Rice', 'Tomato', 'Onion', 'Garlic', 'Potato', 'Beef', 'Cheese', 'Mushroom', 'Salmon', 'Pork']

export function FridgeSearch() {
  const t = useT()
  const [ingredients, setIngredients] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [meals, setMeals] = useState<Meal[]>([])
  const [searched, setSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  function add(raw: string) {
    const v = raw.trim()
    if (!v) return
    setIngredients((prev) =>
      prev.some((x) => x.toLowerCase() === v.toLowerCase()) ? prev : [...prev, v]
    )
    setInput('')
  }

  function remove(v: string) {
    setIngredients((prev) => prev.filter((x) => x !== v))
  }

  function onSubmitInput(e: FormEvent) {
    e.preventDefault()
    add(input)
  }

  function find() {
    if (ingredients.length === 0) return
    startTransition(async () => {
      const results = await searchByIngredients(ingredients)
      setMeals(results)
      setSearched(true)
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/60 flex items-center justify-center">
          <Refrigerator size={18} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('fridge.title')}</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">{t('fridge.subtitle')}</p>
        </div>
      </div>

      {/* Selected ingredient chips */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing) => (
            <span
              key={ing}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-green-600 text-white text-sm"
            >
              {ing}
              <button onClick={() => remove(ing)} aria-label={`Remove ${ing}`} className="hover:bg-white/20 rounded-full p-0.5">
                <X size={13} />
              </button>
            </span>
          ))}
          <button
            onClick={() => { setIngredients([]); setSearched(false); setMeals([]) }}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 px-2"
          >
            {t('fridge.clear')}
          </button>
        </div>
      )}

      {/* Add ingredient input */}
      <form onSubmit={onSubmitInput} className="flex gap-2">
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
          onClick={find}
          disabled={ingredients.length === 0 || isPending}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
        >
          <Search size={15} />
          {isPending ? t('fridge.finding') : t('fridge.find')}
        </button>
      </form>

      {/* Popular ingredient quick-picks */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('fridge.popular')}</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR.filter((p) => !ingredients.some((x) => x.toLowerCase() === p.toLowerCase())).map((p) => (
            <button
              key={p}
              onClick={() => add(p)}
              className={cn(
                'px-3 py-1 rounded-full text-sm border transition-colors',
                'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-green-100 dark:border-gray-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700'
              )}
            >
              + {p}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isPending ? (
        <SkeletonGrid />
      ) : searched ? (
        <RecipeGrid meals={meals} showSnippet emptyMessage={t('fridge.empty')} />
      ) : (
        <p className="text-center text-gray-400 dark:text-gray-500 py-12 text-sm">{t('fridge.hint')}</p>
      )}
    </div>
  )
}
