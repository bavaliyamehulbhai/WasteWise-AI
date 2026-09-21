import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AIStatusBadge from "../analyzing/AIStatusBadge";

const STATUS_LABELS = {
  "recyclable": "Recyclable",
  "compost": "Compost",
  "general-waste": "General Waste",
  "special-disposal": "Special Disposal",
  "reuse": "Reuse",
  "unknown": "Check Guidance",
};

const STATUS_COLORS = {
  "recyclable": "text-brand bg-brand/10 border-brand/20",
  "compost": "text-success-text bg-success-text/10 border-success-text/20",
  "general-waste": "text-error-text bg-error-text/10 border-error-text/20",
  "special-disposal": "text-warning-text bg-warning-text/10 border-warning-text/20",
  "reuse": "text-blue-600 bg-blue-100 border-blue-200",
  "unknown": "text-gray-600 bg-gray-100 border-gray-200",
};

function HistoryMobileCard({ scan }) {
  const date = new Date(scan.createdAt);
  const formattedDate = date.toLocaleDateString(undefined, { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-surface-card border border-border-default rounded-[20px] p-4 flex flex-col gap-3 shadow-sm relative overflow-hidden">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-page border border-border-default relative">
          {scan.imageUrl ? (
            <img src={scan.imageUrl} alt={scan.wasteName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F0FAF4] text-brand text-xs font-semibold">Image</div>
          )}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <h4 className="font-bold text-text-primary truncate">{scan.wasteName}</h4>
          <p className="text-xs text-text-muted mt-0.5 truncate">{scan.category} • {scan.material || "Unknown"}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[10px] font-semibold text-text-primary px-2 py-1 bg-surface-page rounded-md border border-border-default">
              {scan.confidence}% confidence
            </span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${STATUS_COLORS[scan.disposalStatus] || STATUS_COLORS["unknown"]}`}>
              {STATUS_LABELS[scan.disposalStatus] || scan.disposalStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border-default pt-3 mt-1">
        <span className="text-xs font-medium text-text-muted">{formattedDate}</span>
        
        <Link 
          to={`/result/${scan._id}`}
          className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default HistoryMobileCard;
