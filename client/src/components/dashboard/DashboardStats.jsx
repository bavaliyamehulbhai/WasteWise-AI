import { memo } from "react";
import MetricCard from "./MetricCard";
import { ScanLine, Recycle, Leaf, Trash2 } from "lucide-react";

const DashboardStats = ({ metrics, comparisons }) => {
  const total = metrics?.totalScans || 0;
  const recyclable = metrics?.recyclable || 0;

  const compost = metrics?.compost || 0;
  const generalWaste = metrics?.generalWaste || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
      {/* Real Data Cards */}
      <MetricCard
        title="Total Scans"
        value={total}
        icon={ScanLine}
        trend={comparisons?.totalScans}
        trendLabel="this month"
        isPlaceholder={false}
      />
      <MetricCard
        title="Recyclable"
        value={recyclable}
        icon={Recycle}
        trend={comparisons?.recyclable}
        trendLabel="this month"
        isPlaceholder={false}
      />
      <MetricCard
        title="Compost"
        value={compost}
        icon={Leaf}
        trend={comparisons?.compost}
        trendLabel="this month"
        isPlaceholder={false}
      />
      <MetricCard
        title="General Waste"
        value={generalWaste}
        icon={Trash2}
        trend={comparisons?.generalWaste}
        trendLabel="this month"
        isPlaceholder={false}
      />
    </div>
  );
};

export default memo(DashboardStats);
