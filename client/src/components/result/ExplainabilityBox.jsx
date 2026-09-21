import { Lightbulb, Info } from "lucide-react";

export default function ExplainabilityBox({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="bg-surface-page rounded-xl p-4 mt-4 border border-border-default">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-brand" />
        <h3 className="text-sm font-semibold text-text-primary">Why we identified this</h3>
      </div>
      <ul className="space-y-2 mb-3">
        {evidence.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
            <span className="text-success-text mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-start gap-2 bg-black/5 rounded-lg p-3">
        <Info size={14} className="text-text-muted shrink-0 mt-0.5" />
        <p className="text-xs text-text-muted">
          This is an AI-generated classification based on visual evidence. Verify before disposal if uncertain.
        </p>
      </div>
    </div>
  );
}
