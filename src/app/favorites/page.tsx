import type { Metadata } from 'next'
import { FavoritesView } from '@/components/favorites/FavoritesView'

export const metadata: Metadata = {
  title: 'My Favorites — Cuisine World',
  description: 'Your saved recipes, all in one place.',
}

export default function FavoritesPage() {
  return <FavoritesView />
}
