import { FileImage } from "lucide-react";
import Button from "../ui/Button";

function HistoryEmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center bg-surface-card rounded-2xl border border-border-default shadow-sm w-full">
      <div className="w-16 h-16 bg-[#F0FAF4] rounded-full flex items-center justify-center text-brand mb-4">
        <FileImage size={32} />
      </div>
      
      {hasFilters ? (
        <>
          <h3 className="text-xl font-bold text-text-primary mb-2">No matching scans</h3>
          <p className="text-sm text-text-muted max-w-[280px] leading-relaxed mb-6">
            Try changing your search or filters to find what you're looking for.
          </p>
          <Button onClick={onClearFilters}>Clear Filters</Button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold text-text-primary mb-2">No scans yet</h3>
          <p className="text-sm text-text-muted max-w-[280px] leading-relaxed mb-6">
            Start by scanning your first waste item to build your history.
          </p>
          <Button href="/scan">Scan Waste</Button>
        </>
      )}
    </div>
  );
}

export default HistoryEmptyState;
