function ImpactMetric({ value, label, trend, icon: Icon }) {
  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-4 lg:p-5 flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-success-bg flex items-center justify-center text-brand">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[28px] lg:text-[32px] font-bold text-text-primary leading-none">
          {value}
        </span>
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1.5">
          <span 
            className={`text-xs font-semibold ${
              trend.isPositive ? "text-brand" : "text-error-text"
            }`}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-text-muted">vs last month</span>
        </div>
      )}
    </div>
  );
}

export default ImpactMetric;
