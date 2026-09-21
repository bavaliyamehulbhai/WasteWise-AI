function HistorySkeleton() {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mobile Skeleton */}
      <div className="lg:hidden flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-surface-card border border-border-default rounded-2xl p-4 flex gap-4 animate-pulse">
            <div className="w-20 h-20 bg-surface-page rounded-xl shrink-0" />
            <div className="flex flex-col flex-1 justify-center gap-2">
              <div className="h-4 bg-surface-page rounded w-3/4" />
              <div className="h-3 bg-surface-page rounded w-1/2" />
              <div className="h-3 bg-surface-page rounded w-1/4 mt-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:block bg-surface-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-page/50 border-b border-border-default">
          <div className="col-span-3 h-4 bg-surface-page rounded animate-pulse w-1/2" />
          <div className="col-span-2 h-4 bg-surface-page rounded animate-pulse w-2/3" />
          <div className="col-span-2 h-4 bg-surface-page rounded animate-pulse w-3/4" />
          <div className="col-span-2 h-4 bg-surface-page rounded animate-pulse w-2/3" />
          <div className="col-span-2 h-4 bg-surface-page rounded animate-pulse w-1/2" />
          <div className="col-span-1 h-4 bg-surface-page rounded animate-pulse w-full" />
        </div>
        <div className="flex flex-col">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-default items-center">
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-surface-page rounded-xl shrink-0 animate-pulse" />
                <div className="flex flex-col gap-1 w-full">
                  <div className="h-4 bg-surface-page rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-surface-page rounded w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="col-span-2 h-4 bg-surface-page rounded animate-pulse w-1/2" />
              <div className="col-span-2 h-4 bg-surface-page rounded animate-pulse w-2/3" />
              <div className="col-span-2 h-6 bg-surface-page rounded-full animate-pulse w-16" />
              <div className="col-span-2 h-6 bg-surface-page rounded-full animate-pulse w-20" />
              <div className="col-span-1 h-8 bg-surface-page rounded-lg animate-pulse w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistorySkeleton;
