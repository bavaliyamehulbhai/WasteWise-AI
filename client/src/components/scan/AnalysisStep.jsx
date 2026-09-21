import {
  Check,
  LoaderCircle,
  Circle,
} from "lucide-react";

function AnalysisStep({
  label,
  status,
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
        "
      >
        {status === "complete" && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-bg">
            <Check
              size={16}
              className="text-brand"
              strokeWidth={2.5}
            />
          </div>
        )}

        {status === "active" && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand">
            <LoaderCircle
              size={16}
              className="animate-spin text-white"
            />
          </div>
        )}

        {status === "pending" && (
          <Circle
            size={18}
            className="text-[#C9DED0]"
          />
        )}
      </div>

      <span
        className={`
          text-sm
          ${
            status === "active"
              ? "font-semibold text-success-text"
              : status === "complete"
                ? "font-medium text-text-primary"
                : "text-text-muted"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}

export default AnalysisStep;
