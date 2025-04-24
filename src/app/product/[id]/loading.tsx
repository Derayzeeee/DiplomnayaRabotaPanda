export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-square rounded-xl bg-gray-200" />

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        <div className="h-10 bg-gray-200 rounded w-1/3" />

        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>

        <div className="h-12 bg-gray-200 rounded" />
      </div>
    </div>
  );
}