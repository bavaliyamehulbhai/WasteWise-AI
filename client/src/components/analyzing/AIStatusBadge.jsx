import { Sparkles } from "lucide-react";

function AIStatusBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-bg rounded-full border border-border-default/60 shadow-sm">
      <Sparkles size={14} className="text-brand" />
      <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
        AI Analysis
      </span>
    </div>
  );
}

export default AIStatusBadge;
