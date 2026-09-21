import {
  ArrowRight,
  Recycle,
} from "lucide-react";

function DesktopHistoryTable({
  scans,
  onOpen,
}) {
  return (
    <div className="mt-5 hidden overflow-hidden rounded-[20px] border border-border-default bg-surface-card lg:block">

      <table className="w-full border-collapse">

        <thead>
          <tr className="border-b border-border-default bg-surface-page">

            <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted">
              Item
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted">
              Category
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted">
              Confidence
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted">
              Disposal
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted">
              Date
            </th>

            <th className="px-5 py-4" />

          </tr>
        </thead>

        <tbody>

          {scans.map((scan) => (
            <tr
              key={scan.id}
              className="
                border-b
                border-[#EEF3F0]
                last:border-b-0
                hover:bg-surface-page
              "
            >

              {/* Item */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-bg">
                    <Recycle
                      size={18}
                      className="text-brand"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {scan.item.name}
                    </p>

                    <p className="mt-0.5 text-xs text-text-muted">
                      {scan.item.material}
                    </p>
                  </div>

                </div>

              </td>

              {/* Category */}
              <td className="px-5 py-4">
                <span className="rounded-full bg-success-bg px-3 py-1.5 text-xs font-medium text-success-text">
                  {scan.item.category}
                </span>
              </td>

              {/* Confidence */}
              <td className="px-5 py-4">

                <span
                  className={`
                    text-sm
                    font-semibold
                    ${
                      scan.confidence >= 90
                        ? "text-brand"
                        : scan.confidence >= 75
                          ? "text-[#9A741E]"
                          : "text-[#C94F4F]"
                    }
                  `}
                >
                  {scan.confidence}%
                </span>

              </td>

              {/* Disposal */}
              <td className="px-5 py-4">

                <p className="text-xs font-semibold text-success-text">
                  {scan.disposal.stream}
                </p>

                <p className="mt-1 text-[10px] text-text-muted">
                  {scan.disposal.action}
                </p>

              </td>

              {/* Date */}
              <td className="px-5 py-4">

                <span className="text-xs text-text-muted">
                  {formatDate(scan.scannedAt)}
                </span>

              </td>

              {/* Action */}
              <td className="px-5 py-4 text-right">

                <button
                  type="button"
                  onClick={() => onOpen(scan)}
                  aria-label={`Open ${scan.item.name}`}
                  className="
                    inline-flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-text-muted
                    hover:bg-success-bg
                    hover:text-brand
                  "
                >
                  <ArrowRight size={16} />
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default DesktopHistoryTable;
