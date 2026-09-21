import { Search, Filter, SlidersHorizontal } from "lucide-react";

function HistoryToolbar({ search, setSearch, onOpenFilter, activeFilterCount }) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center w-full">
      
      {/* Search Bar */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-text-muted" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scans..."
          className="w-full pl-11 pr-4 h-12 bg-surface-card border border-border-default rounded-xl text-sm text-text-primary placeholder-[#66756E] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
        />
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary"
          >
            <span aria-hidden="true" className="text-lg leading-none">&times;</span>
          </button>
        )}
      </div>

      {/* Filter / Sort Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={onOpenFilter}
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-12 px-6 bg-surface-card border border-border-default rounded-xl text-sm font-semibold text-text-primary hover:bg-surface-page transition-colors"
        >
          <Filter size={18} className="text-text-muted" />
          Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        
        {/* Sort button (Placeholder for MVP, acts as neutral button) */}
        <button 
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 h-12 px-6 bg-surface-card border border-border-default rounded-xl text-sm font-semibold text-text-primary hover:bg-surface-page transition-colors"
        >
          <SlidersHorizontal size={18} className="text-text-muted" />
          Sort
        </button>
      </div>

    </div>
  );
}

export default HistoryToolbar;
