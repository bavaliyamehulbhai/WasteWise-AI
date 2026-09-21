import { useState } from "react";
import { Link } from "react-router-dom";
import { getStatusLabel, formatDateTime, getCategoryLabel, getStatusColorClass } from "../../utils/scanUtils";

// Reusable Image component with fallback handling
const ScanThumbnail = ({ src, alt }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="h-11 w-11 shrink-0 rounded-xl bg-surface-hover border border-border-default flex items-center justify-center text-text-muted text-xl">
        📷
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="h-11 w-11 shrink-0 rounded-xl object-cover bg-surface-page border border-border-default"
    />
  );
};

const RecentActivity = ({ scans = [] }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-default px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Activity
          </h2>
          <p className="text-sm text-text-muted">
            Your latest waste scans
          </p>
        </div>
        <Link 
          to="/history"
          className="text-sm font-medium text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
        >
          View All <span aria-hidden="true">&rarr;</span>
        </Link>
      </header>

      {/* Content */}
      {scans.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
          <div className="text-4xl text-text-muted mb-3">📷</div>
          <p className="font-medium text-text-primary">
            No recent scans yet
          </p>
          <p className="mt-1 text-sm text-text-muted max-w-[200px] mx-auto mb-5">
            Scan your first waste item to start building your activity.
          </p>
          <Link 
            to="/scan"
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:-translate-y-0.5"
          >
            Scan Waste
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          {/* Desktop Table (hidden on mobile) */}
          <div className="hidden md:block min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-default bg-surface-page/50">
                  <th scope="col" className="px-5 py-3 text-xs font-semibold text-text-muted tracking-wider uppercase whitespace-nowrap">Item</th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold text-text-muted tracking-wider uppercase whitespace-nowrap">Date & Time</th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold text-text-muted tracking-wider uppercase whitespace-nowrap">AI Prediction</th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold text-text-muted tracking-wider uppercase whitespace-nowrap text-center">Confidence</th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold text-text-muted tracking-wider uppercase whitespace-nowrap">Status</th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold text-text-muted tracking-wider uppercase whitespace-nowrap text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {scans.map((scan) => (
                  <tr key={scan._id} className="hover:bg-surface-hover transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ScanThumbnail src={scan.imageUrl} alt={scan.wasteName} />
                        <p className="font-medium text-text-primary max-w-[160px] truncate" title={scan.wasteName}>
                          {scan.wasteName}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-sm text-text-secondary">
                        {formatDateTime(scan.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-text-primary truncate max-w-[160px]" title={`${getCategoryLabel(scan.category)} • ${scan.material || "Unknown"}`}>
                        {getCategoryLabel(scan.category)}
                        {scan.material && <span className="text-text-muted font-normal"> • {scan.material}</span>}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <p className="text-sm font-semibold text-text-primary">
                        {scan.confidence != null ? `${Number(scan.confidence).toFixed(0)}%` : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold border ${getStatusColorClass(scan.disposalStatus)}`}>
                        {getStatusLabel(scan.disposalStatus)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link 
                        to={`/result/${scan._id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-border-default px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-card hover:text-brand bg-surface-page transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        aria-label={`View details for ${scan.wasteName}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (hidden on desktop) */}
          <div className="block md:hidden divide-y divide-border-default">
            {scans.map((scan) => (
              <div key={scan._id} className="p-4 hover:bg-surface-hover transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <ScanThumbnail src={scan.imageUrl} alt={scan.wasteName} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary line-clamp-2 leading-snug mb-1">
                      {scan.wasteName}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {getCategoryLabel(scan.category)}
                      {scan.material && ` • ${scan.material}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-text-primary">
                      {scan.confidence != null ? `${Number(scan.confidence).toFixed(0)}%` : "—"}
                    </span>
                    <span className="text-xs text-text-muted">confidence</span>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold border ${getStatusColorClass(scan.disposalStatus)}`}>
                    {getStatusLabel(scan.disposalStatus)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-3 border-t border-border-default/50">
                  <p className="text-xs text-text-secondary">
                    {formatDateTime(scan.createdAt)}
                  </p>
                  <Link 
                    to={`/result/${scan._id}`}
                    className="text-sm font-medium text-brand flex items-center gap-1 p-1 hover:underline"
                    aria-label={`View details for ${scan.wasteName}`}
                  >
                    View <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentActivity;
