import Link from 'next/link'
import { getAllAreas } from '@/lib/api'
import { getAreaInfo, curatedAreaList } from '@/lib/areas'
import { LocalizedText } from '@/components/ui/LocalizedText'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Browse by Region — Cuisine World',
  description: 'Explore recipes from popular cuisines around the world.',
}

export default async function AreaIndexPage() {
  const all = await getAllAreas()
  const regions = curatedAreaList(all.map((a) => a.name))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          <LocalizedText en="Explore by Region" zh="按地區探索" />
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          <LocalizedText
            en="Discover home-style recipes from popular cuisines around the world"
            zh="探索世界各地熱門菜系嘅家常食譜"
          />
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {regions.map((name) => {
          const info = getAreaInfo(name)
          return (
            <Link
              key={name}
              href={`/area/${encodeURIComponent(name)}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-white border border-green-100 hover:border-green-400 hover:bg-green-50 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{info.flag}</span>
              <span className="text-sm font-medium text-gray-700">
                <LocalizedText en={name} zh={info.nameZh} />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
