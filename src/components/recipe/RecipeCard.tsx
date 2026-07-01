import Image from 'next/image'
import Link from 'next/link'
import type { MealSummary, DifficultyScore } from '@/lib/types'
import { DifficultyStars } from '@/components/ui/DifficultyStars'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { LocalizedText } from '@/components/ui/LocalizedText'
import { RecipeCardMeta } from './RecipeCardMeta'

interface Props {
  meal: MealSummary
  difficulty?: DifficultyScore
  snippet?: string
  description?: string
  minutes?: number
  servings?: number
  calories?: number
  // Server-provided Chinese translations (optional; falls back to English).
  nameZh?: string
  snippetZh?: string
  descriptionZh?: string
  areaZh?: string
  categoryZh?: string
}

export function RecipeCard({
  meal, difficulty, snippet, description, minutes, servings, calories,
  nameZh, snippetZh, descriptionZh, areaZh, categoryZh,
}: Props) {
  // Prefer the appealing blurb; fall back to the raw instruction snippet.
  const blurb = description ?? snippet
  const blurbZh = description ? descriptionZh : snippetZh
  return (
    <Link
      href={`/recipe/${meal.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-250"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-green-50 img-zoom">
        <Image
          src={meal.thumbnail}
          alt={meal.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton mealId={meal.id} />
        </div>
        {calories !== undefined && (
          <span className="absolute bottom-2 left-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-black/55 text-white text-[10px] font-medium backdrop-blur-sm">
            🔥 {calories} kcal
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          <LocalizedText en={meal.name} zh={nameZh} />
        </h3>

        {blurb && (
          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
            <LocalizedText en={blurb} zh={blurbZh} />
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {meal.area && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
              <LocalizedText en={meal.area} zh={areaZh} />
            </span>
          )}
          {meal.category && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              <LocalizedText en={meal.category} zh={categoryZh} />
            </span>
          )}
        </div>

        {/* Cook time + servings + difficulty */}
        {(minutes !== undefined || difficulty) && (
          <div className="flex items-center justify-between mt-0.5 gap-2">
            {minutes !== undefined && servings !== undefined ? (
              <RecipeCardMeta minutes={minutes} servings={servings} />
            ) : (
              <span />
            )}
            {difficulty && <DifficultyStars difficulty={difficulty} size="sm" />}
          </div>
        )}
      </div>
    </Link>
  )
}
