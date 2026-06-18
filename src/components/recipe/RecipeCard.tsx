import Image from 'next/image'
import Link from 'next/link'
import type { MealSummary, DifficultyScore } from '@/lib/types'
import { DifficultyStars } from '@/components/ui/DifficultyStars'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'

interface Props {
  meal: MealSummary
  difficulty?: DifficultyScore
  snippet?: string
}

export function RecipeCard({ meal, difficulty, snippet }: Props) {
  return (
    <Link
      href={`/recipe/${meal.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-green-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-green-50">
        <Image
          src={meal.thumbnail}
          alt={meal.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton mealId={meal.id} />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {meal.name}
        </h3>

        {snippet && (
          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
            {snippet}
          </p>
        )}

        <div className="flex items-center justify-between mt-0.5">
          <div className="flex flex-wrap gap-1">
            {meal.area && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                {meal.area}
              </span>
            )}
            {meal.category && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                {meal.category}
              </span>
            )}
          </div>
          {difficulty && <DifficultyStars difficulty={difficulty} size="sm" />}
        </div>
      </div>
    </Link>
  )
}
