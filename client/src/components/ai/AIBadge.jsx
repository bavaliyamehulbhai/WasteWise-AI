import { Sparkles } from "lucide-react";

function AIBadge({ label = "AI Analysis", className = "" }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-semibold text-success-text ${className}`}>
      <Sparkles size={13} className="text-brand" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default AIBadge;
