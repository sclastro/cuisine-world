import { SkeletonGrid } from '@/components/ui/SkeletonCard'

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <div className="h-7 bg-gray-100 rounded w-48 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
      </div>
      <SkeletonGrid />
    </div>
  )
}
