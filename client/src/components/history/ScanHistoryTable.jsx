import { Image as ImageIcon, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import ConfidenceIndicator from "../result/ConfidenceIndicator";

function ScanHistoryTable({ scans, onClick, onDelete }) {
  return (
    <div className="bg-surface-card border border-border-default rounded-[24px] overflow-hidden shadow-sm hidden lg:block w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-page border-b border-border-default">
            <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide w-16">Image</th>
            <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Waste</th>
            <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Category</th>
            <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
            <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide text-center">Confidence</th>
            <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Date</th>
            <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide w-12"></th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan, index) => {
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
            
            const formattedDate = new Date(scan.createdAt).toLocaleDateString(undefined, {
              month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
            });

            return (
              <tr 
                key={index} 
                onClick={() => onClick(scan)}
                className="border-b border-[#F7FAF8] hover:bg-surface-page transition-colors cursor-pointer group"
              >
                <td className="py-3 px-6">
                  <div className="w-10 h-10 bg-surface-page rounded-lg border border-border-default flex items-center justify-center group-hover:border-brand transition-colors overflow-hidden relative">
                    {scan.imageUrl ? (
                      <img src={scan.imageUrl} alt={scan.wasteName} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={16} className="text-text-muted opacity-50" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm font-bold text-text-primary">{scan.wasteName}</td>
                <td className="py-4 px-6 text-sm font-medium text-text-muted">{scan.category}</td>
                <td className="py-4 px-6">
                  <Badge variant="neutral" className={`${status.bg} ${status.text} border-none font-semibold flex w-fit items-center gap-1.5`}>
                    <span>{status.icon}</span> {status.label}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-center text-sm">
                  <ConfidenceIndicator confidence={scan.confidence} variant="compact" />
                </td>
                <td className="py-4 px-6 text-sm font-medium text-text-muted whitespace-nowrap">
                  {formattedDate}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={(e) => onDelete && onDelete(scan._id, e)}
                    className="text-text-muted hover:text-error-text transition-colors p-2 rounded-lg hover:bg-error-bg/50"
                    title="Delete scan"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ScanHistoryTable;
