import { SkeletonGrid } from '@/components/ui/SkeletonCard'

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-14">

      {/* Hero skeleton */}
      <section className="text-center py-10 space-y-5">
        <div className="skeleton h-12 w-72 rounded-2xl mx-auto" />
        <div className="skeleton h-12 w-48 rounded-2xl mx-auto" />
        <div className="skeleton h-5 w-80 rounded-full mx-auto" />
        <div className="skeleton h-11 w-full max-w-md rounded-full mx-auto" />
      </section>

      {/* Course sections skeleton */}
      <section className="space-y-4">
        <div className="skeleton h-6 w-40 rounded-full" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      </section>

      {/* Today's Picks skeleton */}
      <section className="space-y-5">
        <div className="skeleton h-6 w-40 rounded-full" />
        <SkeletonGrid count={8} />
      </section>

    </div>
  )
}
