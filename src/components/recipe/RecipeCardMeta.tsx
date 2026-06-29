'use client'

import { Clock, Users } from 'lucide-react'
import { useT } from '@/hooks/useT'

interface Props {
  minutes: number
  servings: number
}

// Compact, bilingual cook-time + servings line shown on each recipe card.
// Labels switch instantly with the EN/ZH toggle via useT().
export function RecipeCardMeta({ minutes, servings }: Props) {
  const t = useT()
  return (
    <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
      <span className="flex items-center gap-0.5">
        <Clock size={11} />~{minutes} {t('recipe.min')}
      </span>
      <span className="flex items-center gap-0.5">
        <Users size={11} />{t('recipe.serves')} {servings}
      </span>
    </div>
  )
}
