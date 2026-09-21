function AnalyticsBreakdown({ categories }) {
  if (!categories || categories.length === 0) return null;

  // Take top 6 categories that have a percentage > 0
  const activeCategories = categories.filter(c => c.percentage > 0).slice(0, 6);

  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border-default shadow-sm h-full">
      <h3 className="font-bold text-text-primary text-lg mb-6">Waste Breakdown</h3>
      
      <div className="flex flex-col gap-4">
        {activeCategories.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-text-muted">No category data yet.</p>
          </div>
        ) : (
          activeCategories.map((cat, index) => (
            <div key={cat.category} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full opacity-${90 - index * 10} bg-brand`} />
                <span className="font-semibold text-text-primary text-sm">{cat.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-muted">{cat.count} items</span>
                <span className="font-bold text-text-primary text-sm w-10 text-right">{cat.percentage}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AnalyticsBreakdown;
