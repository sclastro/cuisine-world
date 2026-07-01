'use client'

import { Flame, Beef, Droplet, Wheat } from 'lucide-react'
import type { NutritionData } from '@/lib/types'
import { useT } from '@/hooks/useT'

interface Props {
  nutrition: NutritionData
}

// Four-macro nutrition panel shown on the recipe detail page. Spoonacular data
// is per serving; Open Food Facts data is a per-100g approximation — labelled
// "estimated" with a source note so users know it's a guide, not exact.
export function NutritionPanel({ nutrition }: Props) {
  const t = useT()
  const approx = nutrition.source === 'openfoodfacts'

  const tiles = [
    { icon: Flame,   label: t('nutrition.cal'),     value: nutrition.calories, unit: t('nutrition.kcal'), color: 'text-orange-500 bg-orange-50' },
    { icon: Beef,    label: t('nutrition.protein'), value: nutrition.protein,  unit: t('nutrition.g'),    color: 'text-red-500 bg-red-50' },
    { icon: Droplet, label: t('nutrition.fat'),     value: nutrition.fat,      unit: t('nutrition.g'),    color: 'text-amber-500 bg-amber-50' },
    { icon: Wheat,   label: t('nutrition.carbs'),   value: nutrition.carbs,    unit: t('nutrition.g'),    color: 'text-green-600 bg-green-50' },
  ]

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Flame size={18} className="text-orange-500" />
        {t('nutrition.title')}
        {approx && (
          <span className="text-xs font-normal text-gray-400">({t('nutrition.est')})</span>
        )}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {tiles.map(({ icon: Icon, label, value, unit, color }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
          >
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${color}`}>
              <Icon size={16} />
            </span>
            <span className="text-lg font-bold text-gray-800">{value}</span>
            <span className="text-[11px] text-gray-400">{unit}</span>
            <span className="text-xs font-medium text-gray-500">{label}</span>
          </div>
        ))}
      </div>
      {approx && (
        <p className="text-[11px] text-gray-400">{t('nutrition.source')}</p>
      )}
    </section>
  )
}
