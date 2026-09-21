function HistoryHeader({ onClearFilters, showClear }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Scan History</h1>
        <p className="text-sm text-text-muted">Track and review your waste classifications</p>
      </div>

      {showClear && (
        <button
          onClick={onClearFilters}
          className="self-start sm:self-auto px-4 py-2 text-sm font-semibold text-text-primary border border-border-default rounded-xl bg-surface-card hover:bg-surface-page transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default HistoryHeader;
