import { X } from "lucide-react";

function FilterBottomSheet({ isOpen, onClose, category, setCategory, status, setStatus, sort, setSort, onApply, onClear }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#16352A]/20 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-card rounded-t-[32px] p-6 pb-10 flex flex-col gap-6 animate-in slide-in-from-bottom duration-300">
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Filters & Sort</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-page flex items-center justify-center text-text-muted hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Category</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "Plastic",
              "Paper",
              "Glass",
              "Metal",
              "Organic",
              "E-Waste",
              "General Waste",
              "Other",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                  category === cat
                    ? "bg-brand text-white border-brand"
                    : "bg-surface-card text-text-muted border-border-default hover:bg-surface-page"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Disposal Status</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "recyclable",
              "general-waste",
              "compost",
              "special-disposal",
              "reuse",
              "unknown",
            ].map((s) => {
              const labelMap = {
                all: "All Statuses",
                recyclable: "Recyclable",
                "general-waste": "General Waste",
                compost: "Compost",
                "special-disposal": "Special Disposal",
                reuse: "Reuse",
                unknown: "Unknown",
              };
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    status === s
                      ? "bg-brand text-white border-brand"
                      : "bg-surface-card text-text-muted border-border-default hover:bg-surface-page"
                  }`}
                >
                  {labelMap[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSort(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                  sort === option.value
                    ? "bg-brand text-white border-brand"
                    : "bg-surface-card text-text-muted border-border-default hover:bg-surface-page"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button 
            onClick={onClear}
            className="flex-1 py-4 rounded-xl font-bold text-text-muted bg-surface-page hover:bg-success-bg transition-colors"
          >
            Clear Filters
          </button>
          <button 
            onClick={onApply}
            className="flex-1 py-4 rounded-xl font-bold text-white bg-brand hover:bg-brand-hover transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

export default FilterBottomSheet;
