'use client'

import { Clock, Users } from 'lucide-react'
import { useT } from '@/hooks/useT'

interface Props {
  minutes: number
  servings: number
}

export function RecipeEstimates({ minutes, servings }: Props) {
  const t = useT()
  return (
    <div className="flex items-center gap-3 text-gray-500">
      <span className="flex items-center gap-1">
        <Clock size={14} />~{minutes} {t('recipe.min')}
      </span>
      <span className="flex items-center gap-1">
        <Users size={14} />{t('recipe.serves')} {servings}
      </span>
      <span className="text-[11px] text-gray-400 italic">({t('recipe.estimated')})</span>
    </div>
  )
}
