import { Star } from 'lucide-react'
import type { DifficultyScore } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  difficulty: DifficultyScore
  size?: 'sm' | 'md'
}

export function DifficultyStars({ difficulty, size = 'sm' }: Props) {
  const iconSize = size === 'sm' ? 12 : 16
  return (
    <span className="flex items-center gap-0.5" title={difficulty.label}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={iconSize}
          className={cn(
            i < difficulty.stars ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300'
          )}
        />
      ))}
    </span>
  )
}
