import { FridgeSearch } from '@/components/explore/FridgeSearch'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Cook From Your Fridge — Cuisine World',
    description: 'Find recipes from the ingredients you already have.',
  }
}

export default function FridgePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <FridgeSearch />
    </div>
  )
}
