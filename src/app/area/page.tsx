import Link from 'next/link'
import { getAllAreas } from '@/lib/api'
import { getAreaInfo } from '@/lib/areas'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Browse by Region — Cuisine World',
  description: 'Explore recipes from every corner of the world.',
}

export default async function AreaIndexPage() {
  const areas = await getAllAreas()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Explore by Region</h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover authentic recipes from {areas.length} cuisines around the world
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {areas.map((area) => (
          <Link
            key={area.name}
            href={`/area/${encodeURIComponent(area.name)}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-white border border-green-100 hover:border-green-400 hover:bg-green-50 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">{getAreaInfo(area.name).flag}</span>
            <span className="text-sm font-medium text-gray-700">{area.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
