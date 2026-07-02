import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Tag, MapPin, UtensilsCrossed, PlayCircle } from 'lucide-react'
import type { Meal } from '@/lib/types'
import { DifficultyStars } from '@/components/ui/DifficultyStars'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { AddToMenuButton } from '@/components/menu/AddToMenuButton'
import { LocalizedText } from '@/components/ui/LocalizedText'
import { IngredientList } from './IngredientList'
import { CookingMode } from './CookingMode'
import { RecipeEstimates } from './RecipeEstimates'
import { NutritionPanel } from './NutritionPanel'
import { getYoutubeWatchUrl, getYoutubeEmbedUrl } from '@/lib/utils'
import { buildRecipeJsonLd } from '@/lib/recipeJsonLd'

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
  const youtubeEmbed = getYoutubeEmbedUrl(meal.youtubeUrl)
  const jsonLd = buildRecipeJsonLd(meal)

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Recipe structured data for search engines (rich results: time, servings, calories) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            <LocalizedText en={meal.name} zh={meal.nameZh} />
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {meal.area && (
              <Link
                href={`/area/${encodeURIComponent(meal.area)}`}
                className="flex items-center gap-1 text-green-700 hover:underline"
              >
                <MapPin size={14} />
                <LocalizedText en={meal.area} zh={meal.areaZh} />
              </Link>
            )}
            {meal.category && (
              <Link
                href={`/category/${encodeURIComponent(meal.category)}`}
                className="flex items-center gap-1 text-amber-700 hover:underline"
              >
                <UtensilsCrossed size={14} />
                <LocalizedText en={meal.category} zh={meal.categoryZh} />
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

            {/* Estimated time + servings */}
            <RecipeEstimates minutes={meal.estTimeMinutes} servings={meal.estServings} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <CookingMode
              steps={meal.instructions}
              title={meal.name}
              stepsZh={meal.instructionsZh}
              titleZh={meal.nameZh}
            />
            <AddToMenuButton meal={{ id: meal.id, name: meal.name, thumbnail: meal.thumbnail, category: meal.category, area: meal.area }} />
          </div>

          {/* Tags */}
          {meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {meal.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs"
                >
                  <Tag size={10} />
                  <LocalizedText en={tag} zh={meal.tagsZh?.[idx]} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appealing intro blurb */}
      {meal.description && (
        <p className="text-[15px] leading-relaxed text-gray-600 border-l-4 border-green-200 pl-4 italic">
          <LocalizedText en={meal.description} zh={meal.descriptionZh} />
        </p>
      )}

      {/* Ingredients */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">
          <LocalizedText en="Ingredients" zh="食材" />
          <span className="ml-2 text-sm font-normal text-gray-400">({meal.ingredients.length})</span>
        </h2>
        <IngredientList ingredients={meal.ingredients} namesZh={meal.ingredientsZh} />
      </section>

      {/* Instructions */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">
          <LocalizedText en="Instructions" zh="烹飪步驟" />
        </h2>
        <ol className="space-y-3">
          {meal.instructions.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-gray-700 text-sm leading-relaxed">
                <LocalizedText en={step} zh={meal.instructionsZh?.[i]} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Watch on YouTube — embedded player + link (shown whenever a video exists) */}
      {youtubeEmbed && (
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <PlayCircle size={20} className="text-red-500" />
            <LocalizedText en="Watch & Cook" zh="睇片學整" />
          </h2>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
            <iframe
              src={youtubeEmbed}
              title="Recipe video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline font-medium"
            >
              <LocalizedText en="Open on YouTube" zh="喺 YouTube 開啟" />
              <ExternalLink size={11} />
            </a>
          )}
        </section>
      )}

      {/* Nutrition — Spoonacular (per serving) or Open Food Facts (estimated) */}
      {meal.nutrition && <NutritionPanel nutrition={meal.nutrition} />}

      {/* Source link — always shown when present, alongside the video */}
      {meal.sourceUrl && (
        <p className="text-xs text-gray-400">
          <LocalizedText en="Original recipe:" zh="原始食譜：" />{' '}
          <a
            href={meal.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline break-all"
          >
            {meal.sourceUrl}
          </a>
        </p>
      )}

    </article>
  )
}
