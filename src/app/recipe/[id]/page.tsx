import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getMealById } from '@/lib/api'
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
  const meal = await getMealById(id)

  if (!meal) notFound()

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
