import { Leaf, AlertCircle } from "lucide-react";

const EnvironmentalImpact = () => {
  return (
    <section className="rounded-2xl border border-border-default bg-surface-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Environmental Impact
          </h2>
          <p className="text-sm text-text-muted">
            Your real-world contribution
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-default rounded-xl bg-surface-page">
        <div className="w-12 h-12 bg-success-bg rounded-full flex items-center justify-center mb-4 text-brand">
          <Leaf size={24} />
        </div>
        <h3 className="text-text-primary font-medium text-base mb-2">
          Tracking under development
        </h3>
        <p className="text-sm text-text-muted max-w-sm mb-4">
          Verified environmental metrics (CO₂ emissions prevented, water saved) will appear here once our calculation methodology is finalized.
        </p>
        <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
          <AlertCircle size={14} />
          <span>No fake data guaranteed</span>
        </div>
      </div>
    </section>
  );
};

export default EnvironmentalImpact;
