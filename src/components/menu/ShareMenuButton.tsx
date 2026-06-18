'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { useMenu } from '@/context/MenuContext'

export function ShareMenuButton() {
  const { menu } = useMenu()
  const [copied, setCopied] = useState(false)

  const filled = [menu.starter, menu.soup, menu.main, menu.dessert].filter(Boolean)

  function handleShare() {
    const params = new URLSearchParams()
    if (menu.starter)  params.set('s', menu.starter.id)
    if (menu.soup)     params.set('w', menu.soup.id)
    if (menu.main)     params.set('m', menu.main.id)
    if (menu.dessert)  params.set('d', menu.dessert.id)
    params.set('name', menu.name)

    const url = `${window.location.origin}/menu?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (filled.length === 0) return null

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-white text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition-colors shadow-sm"
    >
      {copied ? <Check size={15} className="text-green-600" /> : <Share2 size={15} />}
      {copied ? 'Link copied!' : 'Share menu'}
    </button>
  )
}
