import { SkeletonGrid } from '@/components/ui/SkeletonCard'

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="h-10 bg-gray-100 rounded-full w-full max-w-lg animate-pulse" />
      <SkeletonGrid />
    </div>
  )
}
