import { ScanLine, Recycle, Leaf, Trash2 } from "lucide-react";
import MetricCard from "../dashboard/MetricCard";

function AnalyticsMetrics({ summary, comparison }) {
  if (!summary) return null;

  const getTrendProps = (currentValue, previousTotal) => {
    // We only show trend for Total Scans since we didn't calculate previous for each category yet
    // But we can just use the comparison.totalChange for the main one.
    return {};
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="Total Scans"
        value={summary.totalScans}
        icon={ScanLine}
        trend={comparison?.totalChange !== null ? comparison.totalChange : undefined}
        trendLabel="vs previous period"
        isPositive={comparison?.totalChange > 0}
      />
      <MetricCard
        title="Recyclable"
        value={summary.recyclable}
        icon={Recycle}
        color="brand"
      />
      <MetricCard
        title="Compost"
        value={summary.compost}
        icon={Leaf}
        color="success"
      />
      <MetricCard
        title="General Waste"
        value={summary.generalWaste}
        icon={Trash2}
        color="error"
      />
    </div>
  );
}

export default AnalyticsMetrics;
