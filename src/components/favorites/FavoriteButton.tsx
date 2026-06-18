'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { cn } from '@/lib/utils'

interface Props {
  mealId: string
  className?: string
}

export function FavoriteButton({ mealId, className }: Props) {
  const { isFavorite, toggleFavorite, mounted } = useFavorites()
  const saved = mounted && isFavorite(mealId)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(mealId)
      }}
      aria-label={saved ? 'Remove from favorites' : 'Add to favorites'}
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full',
        'bg-white/80 backdrop-blur hover:bg-white transition-colors shadow-sm',
        className
      )}
    >
      <Heart
        size={16}
        className={cn(
          'transition-colors',
          saved ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400 hover:text-red-400'
        )}
      />
    </button>
  )
}
