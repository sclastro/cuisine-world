'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'

// Drop-in replacement for next/image (fill usage) that shows a branded
// placeholder instead of an empty box when a thumbnail URL 404s or fails to
// load. Parent must be `relative` (same requirement as next/image fill).
export function RecipeImage({ alt, className, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-green-50 dark:bg-green-950/40">
        <UtensilsCrossed className="text-green-300 dark:text-green-700" size={28} />
      </div>
    )
  }

  return (
    <Image
      alt={alt}
      className={cn(className)}
      onError={() => setFailed(true)}
      {...props}
    />
  )
}
