function ActivityStatCard({ value, label }) {
  return (
    <div className="flex-1 bg-surface-card border border-border-default rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center min-h-[100px]">
      <span className="text-3xl font-bold text-text-primary leading-none mb-2">
        {value}
      </span>
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function ActivityStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-text-primary">Your Activity</h3>
      
      <div className="flex flex-wrap md:flex-nowrap gap-3">
        <ActivityStatCard value={stats.totalScans || 0} label="Total Scans" />
        <ActivityStatCard value={stats.recyclable || 0} label="Recyclable" />
        <ActivityStatCard value={stats.other || 0} label="Other" />
      </div>
    </div>
  );
}

export default ActivityStats;
