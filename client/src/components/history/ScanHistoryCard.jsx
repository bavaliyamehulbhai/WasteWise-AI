import { Image as ImageIcon, Trash2 } from "lucide-react";

function ScanHistoryCard({ scan, onClick, onDelete }) {
  const statusColorMap = {
    recyclable: { bg: "bg-success-bg", text: "text-success-text", label: "Recyclable", icon: "✓" },
    "general-waste": { bg: "bg-surface-page", text: "text-text-primary", label: "General Waste", icon: "•" },
    trash: { bg: "bg-surface-page", text: "text-text-primary", label: "General Waste", icon: "•" },
    compost: { bg: "bg-[#E5F5E0]", text: "text-[#1A531B]", label: "Compostable", icon: "🌱" },
    "special-disposal": { bg: "bg-[#FFF4E5]", text: "text-[#8C4A07]", label: "Special Disposal", icon: "⚠" },
    special: { bg: "bg-[#FFF4E5]", text: "text-[#8C4A07]", label: "Special Disposal", icon: "⚠" },
    unknown: { bg: "bg-[#F1F3F5]", text: "text-[#495057]", label: "Unknown", icon: "?" },
  };
  
  const status = statusColorMap[scan.disposalStatus] || statusColorMap.unknown;
  
  // Format Date safely
  const formattedDate = new Date(scan.createdAt).toLocaleDateString(undefined, {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
  });

  return (
    <div 
      onClick={() => onClick(scan)}
      className="flex gap-4 p-4 bg-surface-card border border-border-default rounded-[20px] shadow-sm hover:border-brand transition-colors cursor-pointer w-full"
    >
      {/* Thumbnail */}
      <div className="w-[72px] h-[72px] shrink-0 bg-surface-page rounded-xl border border-border-default flex items-center justify-center overflow-hidden relative">
        {scan.imageUrl ? (
          <img src={scan.imageUrl} alt={scan.wasteName} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={24} className="text-text-muted opacity-50" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-center min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-base font-bold text-text-primary truncate">
            {scan.wasteName}
          </h4>
          <button
            onClick={(e) => onDelete && onDelete(scan._id, e)}
            className="text-text-muted hover:text-error-text transition-colors p-1.5 -mr-1.5 -mt-1.5 rounded-lg hover:bg-error-bg/50 shrink-0"
            title="Delete scan"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="text-sm font-medium text-text-muted mb-1 -mt-1">
          {scan.category}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={status.text}>{status.icon} {status.label}</span>
          </div>
          <div className="text-[11px] font-medium text-text-muted">
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanHistoryCard;
