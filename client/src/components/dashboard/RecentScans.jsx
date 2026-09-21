import { useNavigate } from "react-router-dom";
import Badge from "../ui/Badge";
import { Image as ImageIcon } from "lucide-react";

function RecentScanCard({ item }) {
  // Map disposal status to semantic colors
  const statusColorMap = {
    recyclable: { bg: "bg-success-bg", text: "text-success-text", label: "Recyclable" },
    "general-waste": { bg: "bg-surface-page", text: "text-text-primary", label: "General Waste" },
    trash: { bg: "bg-surface-page", text: "text-text-primary", label: "General Waste" },
    compost: { bg: "bg-[#E5F5E0]", text: "text-[#1A531B]", label: "Compostable" },
    "special-disposal": { bg: "bg-[#FFF4E5]", text: "text-[#8C4A07]", label: "Special Disposal" },
    special: { bg: "bg-[#FFF4E5]", text: "text-[#8C4A07]", label: "Special Disposal" },
    unknown: { bg: "bg-[#F1F3F5]", text: "text-[#495057]", label: "Unknown" },
  };

  const status = statusColorMap[item.disposalStatus] || statusColorMap.unknown;
  const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
  });

  return (
    <div className="flex items-center gap-4 p-4 bg-surface-card border border-border-default rounded-xl shadow-sm hover:border-brand transition-colors cursor-pointer">
      <div className="w-14 h-14 shrink-0 bg-surface-page rounded-xl border border-border-default flex items-center justify-center overflow-hidden relative">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.wasteName} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={20} className="text-text-muted opacity-50" />
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h4 className="text-[15px] font-bold text-text-primary truncate">{item.wasteName}</h4>
        <div className="flex items-center justify-between text-xs w-full">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-medium text-text-muted truncate">{item.category}</span>
            <span className="text-[#D8E6DD] shrink-0">•</span>
            <span className={`font-medium ${status.text} shrink-0`}>{status.label}</span>
          </div>
        </div>
      </div>
      <div className="text-xs font-medium text-text-muted shrink-0 text-right w-16">
        {item.confidence}%
      </div>
    </div>
  );
}

function RecentScans({ scans, totalScans }) {
  const navigate = useNavigate();

  if (totalScans === 0 || !scans || scans.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-text-primary">Recent Scans</h3>
        <div className="bg-surface-page border border-border-default border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <p className="text-text-primary font-medium mb-1">No recent scans</p>
          <p className="text-sm text-text-muted">Your analyzed items will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Recent Scans</h3>
        <button 
          onClick={() => navigate("/history")}
          className="text-sm font-semibold text-brand hover:text-brand-hover transition-colors flex items-center gap-1"
        >
          View All <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-surface-card border border-border-default rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-page border-b border-border-default">
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide w-16">Image</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Item</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Category</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Confidence</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((item, index) => {
              const statusColorMap = {
                recyclable: { bg: "bg-success-bg", text: "text-success-text", label: "Recyclable" },
                "general-waste": { bg: "bg-surface-page", text: "text-text-primary", label: "General Waste" },
                trash: { bg: "bg-surface-page", text: "text-text-primary", label: "General Waste" },
                compost: { bg: "bg-[#E5F5E0]", text: "text-[#1A531B]", label: "Compostable" },
                "special-disposal": { bg: "bg-[#FFF4E5]", text: "text-[#8C4A07]", label: "Special Disposal" },
                special: { bg: "bg-[#FFF4E5]", text: "text-[#8C4A07]", label: "Special Disposal" },
                unknown: { bg: "bg-[#F1F3F5]", text: "text-[#495057]", label: "Unknown" },
              };
              const status = statusColorMap[item.disposalStatus] || statusColorMap.unknown;
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short", day: "numeric"
              });

              return (
                <tr key={index} onClick={() => navigate("/history")} className="border-b border-[#F7FAF8] hover:bg-surface-page transition-colors cursor-pointer group">
                  <td className="py-3 px-6">
                    <div className="w-10 h-10 bg-surface-page rounded-lg border border-border-default flex items-center justify-center group-hover:border-brand transition-colors overflow-hidden relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.wasteName} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-text-muted opacity-50" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-text-primary">{item.wasteName}</td>
                  <td className="py-4 px-6 text-sm font-medium text-text-muted">{item.category}</td>
                  <td className="py-4 px-6">
                    <Badge variant="neutral" className={`${status.bg} ${status.text} border-none`}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-text-muted">{item.confidence}%</td>
                  <td className="py-4 px-6 text-sm font-medium text-text-muted whitespace-nowrap">{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="flex flex-col gap-3 lg:hidden">
        {scans.map((item, index) => (
          <RecentScanCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default RecentScans;
