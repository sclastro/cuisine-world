'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5 animate-fade-up">
      <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
        <AlertTriangle size={34} className="text-amber-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-700">Something went wrong</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          We couldn&apos;t load this page. It might be a network issue —
          give it another try.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <RotateCcw size={14} />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:border-green-300 hover:text-green-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
