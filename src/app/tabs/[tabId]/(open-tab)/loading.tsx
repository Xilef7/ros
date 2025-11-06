export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-orange-50">
      <div className="animate-pulse space-y-4">
        {/* Search bar skeleton */}
        <div className="bg-white rounded-lg h-16 mb-6"></div>

        {/* Menu items skeleton */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg h-40"></div>
        ))}
      </div>
    </div>
  )
}
