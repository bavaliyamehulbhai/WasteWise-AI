import { AlertTriangle } from "lucide-react";

function ConfidenceIndicator({ confidence, variant = "full" }) {
  if (confidence === undefined || confidence === null) return null;

  // Determine threshold
  let level = "low";
  let color = "text-error-text";
  let bgColor = "bg-error-text";
  let label = "Low confidence";
  let message = "Please verify the result before disposal.";

  if (confidence >= 85) {
    level = "high";
    color = "text-brand";
    bgColor = "bg-brand";
    label = "High confidence";
    message = null;
  } else if (confidence >= 60) {
    level = "medium";
    color = "text-[#D9A05B]";
    bgColor = "bg-[#D9A05B]";
    label = "Moderate confidence";
    message = "Verify before disposal.";
  }

  if (variant === "compact") {
    return (
      <span className={`font-semibold ${color}`}>
        {confidence}%
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          AI-reported confidence
        </h3>
        <span className="text-sm font-bold text-text-primary">{confidence}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-[#E5ECE8] rounded-full overflow-hidden">
        <div 
          className={`h-full ${bgColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${confidence}%` }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {message && (
          <div className="flex items-start gap-1.5 mt-1 text-[#B25E09]">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfidenceIndicator;
