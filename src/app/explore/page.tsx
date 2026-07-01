import { getRandomMeals } from '@/lib/api'
import { localizeMealsForList } from '@/lib/localize'
import { ExploreWizard } from '@/components/explore/ExploreWizard'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Explore Recipes — Cuisine World',
    description: 'Find recipes by dietary preference, health goal and cooking style.',
  }
}

export default async function ExplorePage() {
  // Seed the page with a handful of random recipes so it never looks empty
  // before the user runs a search.
  const initial = await localizeMealsForList(await getRandomMeals(8))
  return <ExploreWizard initialMeals={initial} />
}
