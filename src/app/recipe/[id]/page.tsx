import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getMealById } from '@/lib/api'
import { localizeMealFull } from '@/lib/localize'
import { searchCookingVideo } from '@/lib/youtube'
import { RecipeDetail } from '@/components/recipe/RecipeDetail'
import { SimilarRecipes } from '@/components/recipe/SimilarRecipes'
import { SkeletonGrid } from '@/components/ui/SkeletonCard'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const meal = await getMealById(id)
  if (!meal) return { title: 'Recipe Not Found — Cuisine World' }
  return {
    title: `${meal.name} — Cuisine World`,
    description: meal.snippet || `${meal.area} ${meal.category} recipe with ${meal.ingredients.length} ingredients.`,
    openGraph: {
      images: [{ url: meal.thumbnail }],
    },
  }
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params
  let rawMeal = await getMealById(id)

  if (!rawMeal) notFound()

  // Ensure a cooking video is offered even when the source recipe has none
  // (e.g. TheMealDB entries without strYoutube). Only runs on the detail view,
  // so browse pages never spend YouTube quota. No-ops without a YouTube key.
  if (!rawMeal.youtubeUrl) {
    const videoId = await searchCookingVideo(rawMeal.name)
    if (videoId) {
      rawMeal = { ...rawMeal, youtubeUrl: `https://www.youtube.com/watch?v=${videoId}` }
    }
  }

  const meal = await localizeMealFull(rawMeal)

  return (
    <>
      <RecipeDetail meal={meal} />

      {meal.category && (
        <div className="border-t border-green-100 mt-4">
          <Suspense
            fallback={
              <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="h-6 bg-gray-100 rounded w-40 mb-4 animate-pulse" />
                <SkeletonGrid count={4} />
              </div>
            }
          >
            <SimilarRecipes category={meal.category} excludeId={meal.id} />
          </Suspense>
        </div>
      )}
    </>
  )
}
