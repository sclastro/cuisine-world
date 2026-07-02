'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useT } from '@/hooks/useT'
import { favoritesToShareUrl } from '@/lib/utils'

// Mirrors ShareMenuButton.tsx: no accounts, just a copyable link that encodes
// the favorite ids. Opening it on another device merges into (never wipes)
// whatever's already favorited there — see FavoritesContext.importFavorites.
export function ShareFavoritesButton() {
  const { favorites } = useFavorites()
  const t = useT()
  const [copied, setCopied] = useState(false)

  if (favorites.size === 0) return null

  function handleShare() {
    const url = favoritesToShareUrl([...favorites], window.location.origin)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-white text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition-colors shadow-sm"
    >
      {copied ? <Check size={15} className="text-green-600" /> : <Share2 size={15} />}
      {copied ? t('fav.linkCopied') : t('fav.share')}
    </button>
  )
}
