import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Tag, MapPin, UtensilsCrossed, PlayCircle } from 'lucide-react'
import type { Meal } from '@/lib/types'
import { DifficultyStars } from '@/components/ui/DifficultyStars'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { IngredientList } from './IngredientList'
import { getYoutubeWatchUrl } from '@/lib/utils'

interface Props {
  meal: Meal
}

const DIFFICULTY_LABELS: Record<string, string> = {
  Easy: '初級',
  'Medium-Easy': '初中級',
  Medium: '中級',
  'Medium-Hard': '中高級',
  Hard: '高級',
}

export function RecipeDetail({ meal }: Props) {
  const youtubeUrl = getYoutubeWatchUrl(meal.youtubeUrl)

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 space-y-8">

      {/* Hero image + title */}
      <div className="space-y-4">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-green-50 shadow-sm">
          <Image
            src={meal.thumbnail}
            alt={meal.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute top-3 right-3">
            <FavoriteButton mealId={meal.id} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{meal.name}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {meal.area && (
              <Link
                href={`/area/${encodeURIComponent(meal.area)}`}
                className="flex items-center gap-1 text-green-700 hover:underline"
              >
                <MapPin size={14} />
                {meal.area}
              </Link>
            )}
            {meal.category && (
              <Link
                href={`/category/${encodeURIComponent(meal.category)}`}
                className="flex items-center gap-1 text-amber-700 hover:underline"
              >
                <UtensilsCrossed size={14} />
                {meal.category}
              </Link>
            )}
            <div className="flex items-center gap-1.5 text-gray-500">
              <DifficultyStars difficulty={meal.difficulty} size="md" />
              <span className="text-xs">
                {meal.difficulty.label}
                {' '}
                <span className="text-gray-400">/ {DIFFICULTY_LABELS[meal.difficulty.label]}</span>
              </span>
            </div>
          </div>

          {/* Tags */}
          {meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {meal.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">
          Ingredients
          <span className="ml-2 text-sm font-normal text-gray-400">({meal.ingredients.length} items)</span>
        </h2>
        <IngredientList ingredients={meal.ingredients} />
      </section>

      {/* Instructions */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">Instructions</h2>
        <ol className="space-y-3">
          {meal.instructions.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* YouTube link */}
      {youtubeUrl && (
        <section className="rounded-xl border border-red-100 bg-red-50 p-4 flex items-start gap-3">
          <PlayCircle size={22} className="text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-800">Watch on YouTube</p>
            <p className="text-xs text-gray-500">
              See a video walkthrough of this recipe for extra tips and technique guidance.
            </p>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline font-medium mt-1"
            >
              Open video <ExternalLink size={11} />
            </a>
          </div>
        </section>
      )}

      {/* Source link */}
      {meal.sourceUrl && (
        <p className="text-xs text-gray-400">
          Original recipe:{' '}
          <a
            href={meal.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            {meal.sourceUrl}
          </a>
        </p>
      )}

    </article>
  )
}
