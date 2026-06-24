const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3'

// Returns the YouTube video ID for a cooking search query, or null if the API
// key is missing / the search returns nothing.  Results are cached for 24h so
// the same recipe lookup only costs quota on the first view.
export async function searchCookingVideo(query: string): Promise<string | null> {
  const API_KEY = process.env.YOUTUBE_API_KEY
  if (!API_KEY) return null

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: `${query} recipe`,
      type: 'video',
      videoCategoryId: '26',
      maxResults: '1',
      key: API_KEY,
    })
    const res = await fetch(`${YOUTUBE_BASE}/search?${params}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const data = await res.json() as { items?: { id?: { videoId?: string } }[] }
    return data.items?.[0]?.id?.videoId ?? null
  } catch {
    return null
  }
}
