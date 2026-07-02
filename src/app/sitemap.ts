import type { MetadataRoute } from 'next'
import { getAllCategories, getAllAreas } from '@/lib/api'

// Recipe detail pages are numerous and TheMealDB-rate-limited to enumerate, so
// the crawl entry points here are the static routes plus every category/area
// listing page — that's where Google actually needs to start.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cuisine-world.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, areas] = await Promise.all([getAllCategories(), getAllAreas()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/area`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/everyday`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/explore`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/menu`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/favorites`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/category/${encodeURIComponent(c.name)}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const areaRoutes: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${SITE_URL}/area/${encodeURIComponent(a.name)}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...areaRoutes]
}
