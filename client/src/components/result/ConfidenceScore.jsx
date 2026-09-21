import { ShieldCheck } from "lucide-react";

function ConfidenceScore({ confidence }) {
  const getConfidenceLabel = () => {
    if (confidence >= 90) {
      return "High confidence";
    }

    if (confidence >= 75) {
      return "Good confidence";
    }

    return "Low confidence";
  };

  const getConfidenceColor = () => {
    if (confidence >= 90) {
      return "bg-brand";
    }

    if (confidence >= 75) {
      return "bg-[#F2B84B]";
    }

    return "bg-[#C94F4F]";
  };

  return (
    <div className="rounded-[20px] border border-border-default bg-surface-card p-5">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck
            size={18}
            className="text-brand"
          />

          <h2 className="text-sm font-semibold text-text-primary">
            AI Confidence
          </h2>
        </div>

        <span className="text-xl font-semibold text-success-text">
          {confidence}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E5ECE8]">
        <div
          className={`h-full rounded-full ${getConfidenceColor()}`}
          style={{
            width: `${confidence}%`,
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Prediction reliability
        </span>

        <span className="text-xs font-semibold text-success-text">
          {getConfidenceLabel()}
        </span>
      </div>

    </div>
  );
}

export default ConfidenceScore;
