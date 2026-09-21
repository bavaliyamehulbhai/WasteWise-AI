import { Link } from "react-router-dom";
import { Recycle, Image as ImageIcon } from "lucide-react";

function RecentScanItem({ scan }) {
  // Determine if it's today
  const scanDate = new Date(scan.scannedAt);
  const isToday = scanDate.toDateString() === new Date().toDateString();
  const dateDisplay = isToday 
    ? "Today" 
    : scanDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  return (
    <Link 
      to={`/result/${scan.id}`}
      className="group flex flex-col md:flex-row md:items-center bg-surface-card border border-border-default rounded-[16px] md:rounded-[12px] p-4 hover:border-brand/30 hover:bg-surface-page transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      aria-label={`${scan.item.name}, ${scan.item.category}, ${scan.confidence} percent confidence, ${dateDisplay}`}
    >
      <div className="flex items-start md:items-center gap-4 w-full">
        
        {/* Thumbnail Placeholder */}
        <div className="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center shrink-0">
          <ImageIcon size={20} className="text-brand/60" />
        </div>

        {/* Info Area */}
        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
          
          {/* Item Name */}
          <p className="text-sm font-semibold text-text-primary truncate md:w-1/3">
            {scan.item.name}
          </p>

          {/* Metadata Row (Mobile) / Columns (Desktop) */}
          <div className="flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap md:flex-1 md:justify-between">
            
            {/* Category Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-success-bg w-fit">
              <Recycle size={12} className="text-brand" />
              <span className="text-[11px] font-semibold text-success-text uppercase tracking-wider">
                {scan.item.category}
              </span>
            </div>

            <span className="hidden md:inline text-xs text-[#D8E6DD]">•</span>

            {/* Confidence */}
            <span className="text-xs font-medium text-text-muted">
              {scan.confidence}%
              <span className="md:hidden"> conf</span>
            </span>

            <span className="hidden md:inline text-xs text-[#D8E6DD]">•</span>

            {/* Date */}
            <span className="text-xs text-text-muted w-full md:w-auto md:text-right mt-1 md:mt-0">
              {dateDisplay}
            </span>

          </div>

        </div>
      </div>
    </Link>
  );
}

export default RecentScanItem;
