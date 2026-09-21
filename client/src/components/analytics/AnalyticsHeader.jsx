import { ChevronDown } from "lucide-react";

function AnalyticsHeader({ range, onRangeChange }) {
  const options = [
    { value: 7, label: "Last 7 days" },
    { value: 30, label: "Last 30 days" },
    { value: 90, label: "Last 90 days" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-sm text-text-muted">Understand your waste sorting activity</p>
      </div>

      <div className="relative inline-block">
        <select
          value={range}
          onChange={(e) => onRangeChange(Number(e.target.value))}
          className="appearance-none bg-surface-card border border-border-default text-text-primary font-semibold text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-brand shadow-sm cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>
    </div>
  );
}

export default AnalyticsHeader;
