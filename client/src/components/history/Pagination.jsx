import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, limit, total } = pagination;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-text-muted">
        Showing <span className="font-semibold text-text-primary">{start}–{end}</span> of <span className="font-semibold text-text-primary">{total}</span> scans
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="p-2 rounded-xl bg-surface-card border border-border-default text-text-primary hover:bg-surface-page transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1;
            // Simplified pagination display to avoid too many buttons
            if (
              p === 1 ||
              p === totalPages ||
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    page === p
                      ? "bg-brand text-white border-transparent"
                      : "bg-surface-card border border-border-default text-text-primary hover:bg-surface-page"
                  }`}
                >
                  {p}
                </button>
              );
            } else if (
              (p === page - 2 && page > 3) ||
              (p === page + 2 && page < totalPages - 2)
            ) {
              return <span key={p} className="text-text-muted text-sm px-1">...</span>;
            }
            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          aria-label="Next page"
          className="p-2 rounded-xl bg-surface-card border border-border-default text-text-primary hover:bg-surface-page transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
