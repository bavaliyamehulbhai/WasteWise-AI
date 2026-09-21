import { Link } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";

const STATUS_LABELS = {
  "recyclable": "Recyclable",
  "compost": "Compost",
  "general-waste": "General Waste",
  "special-disposal": "Special Disposal",
  "reuse": "Reuse",
  "unknown": "Unknown",
};

const STATUS_COLORS = {
  "recyclable": "text-brand bg-brand/10 border-brand/20",
  "compost": "text-success-text bg-success-text/10 border-success-text/20",
  "general-waste": "text-error-text bg-error-text/10 border-error-text/20",
  "special-disposal": "text-warning-text bg-warning-text/10 border-warning-text/20",
  "reuse": "text-blue-600 bg-blue-100 border-blue-200",
  "unknown": "text-gray-600 bg-gray-100 border-gray-200",
};

function HistoryTable({ scans, onDeleteRequest }) {
  if (!scans || scans.length === 0) return null;

  return (
    <div className="bg-surface-card border border-border-default rounded-2xl overflow-hidden shadow-sm hidden lg:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-page/50 border-b border-border-default">
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Item</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Prediction</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {scans.map((scan) => {
              const date = new Date(scan.createdAt);
              const formattedDate = date.toLocaleDateString(undefined, { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric'
              });
              const formattedTime = date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <tr key={scan._id} className="hover:bg-surface-page/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-page border border-border-default">
                        {scan.imageUrl ? (
                          <img src={scan.imageUrl} alt={scan.wasteName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#F0FAF4] text-brand text-[10px] font-bold">IMG</div>
                        )}
                      </div>
                      <span className="font-semibold text-text-primary text-sm">{scan.wasteName}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">{formattedDate}</span>
                      <span className="text-xs text-text-muted">{formattedTime}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">{scan.category}</span>
                      <span className="text-xs text-text-muted">{scan.material || "Unknown"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-page rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand rounded-full"
                          style={{ width: `${scan.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-text-primary">{scan.confidence}%</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${STATUS_COLORS[scan.disposalStatus] || STATUS_COLORS["unknown"]}`}>
                      {STATUS_LABELS[scan.disposalStatus] || scan.disposalStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onDeleteRequest(scan)}
                        className="p-2 text-text-muted hover:text-error-text hover:bg-error-bg rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Scan"
                        aria-label="Delete Scan"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Link 
                        to={`/result/${scan._id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-surface-page border border-border-default text-text-primary text-xs font-semibold rounded-lg hover:bg-brand hover:text-white hover:border-brand transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;
