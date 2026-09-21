import { useNavigate } from "react-router-dom";
import { SearchX, Recycle } from "lucide-react";
import Button from "../ui/Button";

export function EmptyHistorySearch({ onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 mt-4 lg:mt-8 bg-surface-card border border-border-default rounded-[24px] text-center w-full min-h-[300px]">
      <div className="w-16 h-16 bg-surface-page rounded-full flex items-center justify-center mb-4">
        <SearchX size={32} className="text-text-muted" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">No matching scans</h3>
      <p className="text-sm text-text-muted mb-6 max-w-[280px]">
        Try a different search term or clear your active filters.
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}

export function EmptyHistoryTotal() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-4 lg:mt-8 bg-surface-card border border-border-default rounded-[24px] text-center w-full min-h-[340px]">
      <div className="text-5xl mb-4">♻️</div>
      <h3 className="text-xl font-bold text-text-primary mb-2">No scans yet</h3>
      <p className="text-sm text-text-muted mb-6 max-w-[300px]">
        Your analyzed waste items will appear here. Start scanning to build your history.
      </p>
      <Button onClick={() => navigate("/scan")}>
        Scan Waste
      </Button>
    </div>
  );
}
