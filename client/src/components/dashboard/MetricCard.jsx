import { memo } from "react";
import { MoreVertical } from "lucide-react";
const formatNumber = (value) => {
  if (typeof value !== "number") return value;
  return new Intl.NumberFormat("en-IN").format(value);
};

const MetricCard = memo(({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend, 
  trendLabel,
  isPlaceholder = false 
}) => {
  return (
    <div className={`rounded-xl md:rounded-2xl border border-border-default bg-surface-card p-3 md:p-4 lg:p-5 shadow-sm transition-all duration-300 h-full flex flex-col ${isPlaceholder ? "opacity-70" : "hover:shadow-lg hover:-translate-y-1"}`}>
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 md:h-10 md:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-lg md:rounded-xl bg-success-bg text-brand shrink-0">
          {Icon && <Icon className="w-4 h-4 md:w-[22px] md:h-[22px]" />}
        </div>
        {!isPlaceholder && (
          <button 
            type="button"
            aria-label={`${title} options`}
            className="text-text-muted hover:text-text-primary p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md -mr-1 -mt-1"
          >
            <MoreVertical size={16} />
          </button>
        )}
      </div>
      
      <p className="mt-3 md:mt-4 text-[11px] md:text-xs lg:text-sm font-medium text-text-muted truncate">
        {title}
      </p>
      
      <div className="mt-0.5 md:mt-1 flex items-baseline">
        <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold truncate ${isPlaceholder ? 'text-text-muted opacity-50' : 'text-text-primary'}`}>
          {isPlaceholder ? "—" : formatNumber(value)}
        </h3>
      </div>
      
      <div className="mt-2 md:mt-3 text-[10px] md:text-xs">
        {isPlaceholder ? (
          <p className="text-text-muted/60 leading-tight truncate">{description || "Calculation coming soon"}</p>
        ) : trend === null || trend === undefined ? (
          <p className="text-text-muted font-medium truncate">New this month</p>
        ) : (
          <p className="text-text-muted font-medium truncate">
            {trend > 0 ? (
              <span className="text-success-text shrink-0">↑ {trend}%</span>
            ) : trend < 0 ? (
              <span className="text-error-text shrink-0">↓ {Math.abs(trend)}%</span>
            ) : (
              <span className="shrink-0">→ 0%</span>
            )}{" "}
            {trendLabel && <span className="font-normal shrink-0">{trendLabel}</span>}
          </p>
        )}
      </div>
    </div>
  );
});

export default MetricCard;
