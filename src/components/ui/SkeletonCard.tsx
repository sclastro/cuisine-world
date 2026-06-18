export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-green-50">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3.5 rounded-full w-4/5" />
        <div className="skeleton h-3 rounded-full w-3/5" />
        <div className="skeleton h-3 rounded-full w-2/5" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
