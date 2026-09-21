import {
  ArrowRight,
  Recycle,
} from "lucide-react";

function MobileHistoryList({
  scans,
  onOpen,
}) {
  return (
    <div className="mt-5 space-y-3 lg:hidden">

      {scans.map((scan) => (
        <button
          key={scan.id}
          type="button"
          onClick={() => onOpen(scan)}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-[18px]
            border
            border-border-default
            bg-surface-card
            p-4
            text-left
            transition
            hover:bg-surface-page
          "
        >

          {/* Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success-bg">
            <Recycle
              size={19}
              className="text-brand"
            />
          </div>

          {/* Main */}
          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-text-primary">
              {scan.item.name}
            </p>

            <p className="mt-1 truncate text-xs text-text-muted">
              {scan.item.category}
              {" • "}
              {scan.confidence}% confidence
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span className="text-[10px] font-semibold text-success-text">
                {scan.disposal.stream}
              </span>

              <span className="text-[10px] text-[#94A39B]">
                •
              </span>

              <span className="text-[10px] text-text-muted">
                {formatRelativeDate(scan.scannedAt)}
              </span>

            </div>

          </div>

          <ArrowRight
            size={16}
            className="shrink-0 text-[#94A39B]"
          />

        </button>
      ))}

    </div>
  );
}

function formatRelativeDate(date) {
  const now = new Date();
  const value = new Date(date);

  const diff =
    now.getTime() - value.getTime();

  const day =
    1000 * 60 * 60 * 24;

  if (diff < day) {
    return "Today";
  }

  if (diff < day * 2) {
    return "Yesterday";
  }

  return value.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
}

export default MobileHistoryList;
