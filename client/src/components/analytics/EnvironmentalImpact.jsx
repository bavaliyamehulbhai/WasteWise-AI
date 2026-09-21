import { Leaf } from "lucide-react";

function EnvironmentalImpact({ impact }) {
  if (!impact) return null;

  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border-default shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#D8E6DD] text-brand flex items-center justify-center">
          <Leaf size={20} />
        </div>
        <div>
          <h3 className="font-bold text-text-primary">Environmental Impact</h3>
          <p className="text-sm text-text-muted">Verified impact data</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-center py-2 border-b border-border-default">
          <span className="text-text-muted font-medium">CO₂ equivalent</span>
          <span className="font-bold text-text-primary">
            {impact.available && impact.co2e ? impact.co2e.value + " " + impact.co2e.unit : "—"}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-default">
          <span className="text-text-muted font-medium">Water impact</span>
          <span className="font-bold text-text-primary">
            {impact.available && impact.waterImpact ? impact.waterImpact.value + " " + impact.waterImpact.unit : "—"}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-default">
          <span className="text-text-muted font-medium">Materials recovered</span>
          <span className="font-bold text-text-primary">
            {impact.available && impact.materialsRecovered ? impact.materialsRecovered.value + " " + impact.materialsRecovered.unit : "—"}
          </span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-surface-page rounded-xl border border-border-default">
        <h4 className="text-sm font-bold text-text-primary mb-1">Methodology</h4>
        <p className="text-xs text-text-muted leading-relaxed">
          {impact.available && impact.methodologyVersion 
            ? `Calculated using ${impact.methodologyVersion}.` 
            : "Not available for current scan data. Environmental impact estimates require quantity/mass data and documented impact factors."}
        </p>
      </div>
    </div>
  );
}

export default EnvironmentalImpact;
