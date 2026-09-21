import { useState } from "react";

const CATEGORY_STYLES = {
  Plastic: { color: "text-[#42B0C8]", bg: "bg-[#42B0C8]", stroke: "#42B0C8" },
  Paper: { color: "text-[#C8A042]", bg: "bg-[#C8A042]", stroke: "#C8A042" },
  Glass: { color: "text-[#9B42C8]", bg: "bg-[#9B42C8]", stroke: "#9B42C8" },
  Organic: { color: "text-[#81C842]", bg: "bg-[#81C842]", stroke: "#81C842" },
  Metal: { color: "text-[#64748B]", bg: "bg-[#64748B]", stroke: "#64748B" },
  "E-Waste": { color: "text-[#EF4444]", bg: "bg-[#EF4444]", stroke: "#EF4444" },
  "General Waste": { color: "text-[#A8A29E]", bg: "bg-[#A8A29E]", stroke: "#A8A29E" },
  Other: { color: "text-[#F59E0B]", bg: "bg-[#F59E0B]", stroke: "#F59E0B" },
};

const formatPercentage = (val) => {
  if (val > 0 && val < 1) return "<1%";
  return `${val}%`;
};

const WasteBreakdown = ({ data = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Geometry
  const radius = 70;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;
  
  let accumulatedPercentage = 0;

  return (
    <section className="rounded-2xl border border-border-default bg-surface-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Waste Breakdown
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            By category
          </p>
        </div>
        
        {/* Placeholder for router link to /analytics */}
        <button
          className="text-sm font-medium text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
          onClick={() => { /* In Phase 17, navigate to /analytics */ }}
        >
          View Details <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 || total === 0 ? (
        <div className="flex flex-1 items-center justify-center text-center py-10">
          <div>
            <div className="text-4xl text-text-muted mb-3">◯</div>
            <p className="font-medium text-text-primary">
              No scan data yet
            </p>
            <p className="mt-1 text-sm text-text-muted max-w-[200px] mx-auto">
              Scan waste to build your waste breakdown.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {/* Donut Chart */}
          <div className="relative mx-auto mt-6 mb-8 h-56 w-56">
            <svg
              viewBox="0 0 180 180"
              className="h-full w-full -rotate-90"
              role="img"
              aria-label="Waste category breakdown donut chart"
            >
              {/* Background ring (only visible if there are gaps, but our math guarantees 100%) */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-surface-hover"
                strokeWidth={strokeWidth}
              />

              {/* Segments */}
              {data.map((item, index) => {
                const precisePercentage = (item.count / total) * 100;
                // Calculate segment length
                const dashLength = circumference * (precisePercentage / 100);
                const dashOffset = -(circumference * (accumulatedPercentage / 100));

                accumulatedPercentage += precisePercentage;

                const isHovered = hoveredCategory === item.category;
                const isMuted = hoveredCategory !== null && !isHovered;
                
                const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Other;

                return (
                  <circle
                    key={`segment-${item.category}`}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="butt"
                    className="transition-all duration-300 ease-out cursor-pointer"
                    style={{ opacity: isMuted ? 0.3 : 1 }}
                    onMouseEnter={() => setHoveredCategory(item.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onTouchStart={() => setHoveredCategory(item.category)}
                  >
                    <title>{`${item.category}: ${item.count} scans (${item.percentage}%)`}</title>
                  </circle>
                );
              })}
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl font-bold text-text-primary">
                  {hoveredCategory 
                    ? data.find(d => d.category === hoveredCategory)?.percentage + "%" 
                    : new Intl.NumberFormat("en-IN").format(total)}
                </p>
                <p className="mt-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {hoveredCategory 
                    ? hoveredCategory 
                    : "Total Scans"}
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-auto space-y-3 px-2 max-h-[160px] overflow-y-auto">
            {data.map((item) => {
              const isHovered = hoveredCategory === item.category;
              const isMuted = hoveredCategory !== null && !isHovered;
              const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Other;

              return (
                <div
                  key={`legend-${item.category}`}
                  className={`flex items-center justify-between gap-3 p-1 rounded-md transition-colors cursor-pointer ${
                    isHovered ? "bg-surface-hover" : ""
                  }`}
                  style={{ opacity: isMuted ? 0.4 : 1 }}
                  onMouseEnter={() => setHoveredCategory(item.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${style.bg}`}
                    />
                    <span className="truncate text-sm font-medium text-text-primary">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <span className="text-sm font-medium text-text-muted w-10 text-right">
                      {new Intl.NumberFormat("en-IN").format(item.count)}
                    </span>
                    <span className="w-12 text-right text-sm font-bold text-text-primary">
                      {formatPercentage(item.percentage)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default WasteBreakdown;
