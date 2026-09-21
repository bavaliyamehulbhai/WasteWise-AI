const STATUS_LABELS = {
  "recyclable": "Recyclable",
  "compost": "Compost",
  "general-waste": "General Waste",
  "special-disposal": "Special Disposal",
  "reuse": "Reuse",
  "unknown": "Check Guidance",
};

const STATUS_COLORS = {
  "recyclable": "bg-brand",
  "compost": "bg-success-text",
  "general-waste": "bg-error-text",
  "special-disposal": "bg-warning-text",
  "reuse": "bg-blue-500",
  "unknown": "bg-gray-400",
};

function DisposalAnalysis({ disposal }) {
  if (!disposal || disposal.length === 0) return null;

  const activeDisposal = disposal.filter(d => d.percentage > 0);

  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border-default shadow-sm h-full">
      <h3 className="font-bold text-text-primary text-lg mb-6">Disposal Analysis</h3>

      <div className="flex flex-col gap-5">
        {activeDisposal.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-text-muted">No disposal data yet.</p>
          </div>
        ) : (
          activeDisposal.map((item) => (
            <div key={item.status} className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-text-primary">
                  {STATUS_LABELS[item.status] || item.status}
                </span>
                <span className="text-xs font-bold text-text-muted">
                  {item.percentage}% ({item.count})
                </span>
              </div>
              <div className="h-2 w-full bg-surface-page rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${STATUS_COLORS[item.status] || "bg-brand"}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DisposalAnalysis;
