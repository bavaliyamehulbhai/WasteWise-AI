import { useState, useMemo, memo } from "react";

const CATEGORY_STYLES = {
  total: "text-brand", // Brand Green
  Plastic: "text-[#42B0C8]", // Cyan
  Paper: "text-[#C8A042]", // Orange
  Glass: "text-[#9B42C8]", // Purple
  Organic: "text-[#81C842]", // Lime Green
  Metal: "text-[#64748B]", // Slate
  "E-Waste": "text-[#EF4444]", // Red
  "General Waste": "text-[#A8A29E]", // Stone
  Other: "text-[#F59E0B]", // Amber
};

const formatAxisValue = (value) => {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }
  return String(value);
};

const formatDateShort = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const WasteTrendChart = ({ data = [], range, onRangeChange, loading, error }) => {
  const [visibleCategories, setVisibleCategories] = useState([
    "total",
    "Plastic",
    "Paper",
    "Glass",
    "Organic",
  ]);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const toggleCategory = (category) => {
    setVisibleCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Dimensions
  const width = 760;
  const height = 300;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Derived values
  const { maxValue, points } = useMemo(() => {
    if (!data || data.length === 0) return { maxValue: 1, points: [] };

    // Find global max value among visible categories to scale the Y axis
    let max = 1;
    data.forEach((item) => {
      visibleCategories.forEach((cat) => {
        if (item[cat] > max) max = item[cat];
      });
    });

    // Make max a nice round number for the grid
    const niceMax = Math.ceil(max / 5) * 5;

    // Precompute X and Y coordinates
    const computedPoints = data.map((item, index) => {
      const x = paddingLeft + (index * chartWidth) / (data.length - 1 || 1);
      
      const values = {};
      visibleCategories.forEach((cat) => {
        const val = item[cat] || 0;
        values[cat] = {
          value: val,
          y: paddingTop + chartHeight - (val / niceMax) * chartHeight,
        };
      });

      return { x, date: item.date, values };
    });

    return { maxValue: niceMax, points: computedPoints };
  }, [data, visibleCategories, chartWidth, chartHeight, paddingLeft, paddingTop]);

  const buildPath = (category) => {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.values[category]?.y || 0}`)
      .join(" ");
  };

  // Label Step Calculation
  const labelStep = range === 7 ? 1 : range === 30 ? Math.ceil(30 / 6) : Math.ceil(90 / 8);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Use scaling factor in case the SVG is responsive
    const scaleX = width / rect.width;
    const svgX = (e.clientX - rect.left) * scaleX;
    
    // Find closest point by X coordinate
    let closestIndex = 0;
    let minDiff = Infinity;
    
    points.forEach((p, index) => {
      const diff = Math.abs(p.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    setHoveredIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border-default bg-surface-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full min-h-[450px] flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Waste Sorting Trends
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {data.length > 0 
              ? `${formatDateShort(data[0].date)} – ${formatDateShort(data[data.length - 1].date)}`
              : "Last 30 days"}
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => onRangeChange(Number(e.target.value))}
          disabled={loading || !!error}
          className="rounded-xl border border-border-default bg-surface-card px-3 py-2 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-brand/30 cursor-pointer disabled:opacity-50"
        >
          <option value={7}>7 Days</option>
          <option value={30}>30 Days</option>
          <option value={90}>90 Days</option>
        </select>
      </div>

      {/* State Overlays */}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-card/90 backdrop-blur-sm">
          <p className="text-error-text font-medium mb-3">{error}</p>
          <button 
            onClick={() => onRangeChange(range)}
            className="px-4 py-2 bg-brand/10 text-brand font-medium rounded-lg hover:bg-brand/20 transition"
          >
            Retry
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-card/50 backdrop-blur-[2px]">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-card">
          <div className="text-center">
             <div className="text-4xl mb-3">📉</div>
             <p className="font-medium text-text-primary">No scan activity yet.</p>
             <p className="text-sm text-text-muted mt-1">Start scanning waste to see your sorting trends.</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="mt-2 w-full overflow-x-auto scrollbar-hide flex-grow relative" style={{ minHeight: '300px' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[650px] w-full h-[300px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handleMouseMove({ clientX: touch.clientX, currentTarget: e.currentTarget });
          }}
          onTouchEnd={handleMouseLeave}
        >
          {/* Horizontal Grid & Y-Axis Labels */}
          {[0, 1, 2, 3, 4].map((lineIndex) => {
            const y = paddingTop + (lineIndex * chartHeight) / 4;
            const value = maxValue - (lineIndex * maxValue) / 4;
            return (
              <g key={`grid-${lineIndex}`}>
                <text
                  x={paddingLeft - 10}
                  y={y + 4} // Center vertically
                  textAnchor="end"
                  className="text-text-muted text-[11px] font-medium"
                  fill="currentColor"
                >
                  {formatAxisValue(value)}
                </text>
                <line
                  x1={paddingLeft}
                  x2={width - paddingRight}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-border-default opacity-50"
                  strokeDasharray="4 5"
                />
              </g>
            );
          })}

          {/* X-Axis Labels */}
          {points.map((p, index) => {
            if (index % labelStep !== 0 && index !== points.length - 1) return null;
            return (
              <text
                key={`x-label-${p.date}`}
                x={p.x}
                y={height - 5}
                textAnchor="middle"
                className="text-text-muted text-[11px] font-medium"
                fill="currentColor"
              >
                {formatDateShort(p.date)}
              </text>
            );
          })}

          {/* Data Lines */}
          {visibleCategories.map((category) => {
            const strokeColor = CATEGORY_STYLES[category] || "text-text-muted";
            const isTotal = category === "total";
            return (
              <g key={`line-${category}`}>
                <path
                  d={buildPath(category)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isTotal ? "3" : "2"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={strokeColor}
                  strokeDasharray={isTotal ? "0" : "4 4"}
                />
              </g>
            );
          })}

          {/* Hover Overlay Point Indicator */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <g>
              <line
                x1={points[hoveredIndex].x}
                x2={points[hoveredIndex].x}
                y1={paddingTop}
                y2={paddingTop + chartHeight}
                stroke="currentColor"
                className="text-text-muted opacity-30"
                strokeDasharray="4 4"
              />
              {visibleCategories.map((cat) => {
                const pointData = points[hoveredIndex].values[cat];
                if (!pointData) return null;
                const strokeColor = CATEGORY_STYLES[cat] || "text-text-muted";
                return (
                  <circle
                    key={`hover-point-${cat}`}
                    cx={points[hoveredIndex].x}
                    cy={pointData.y}
                    r="4"
                    fill="currentColor"
                    className={`${strokeColor} ring-2 ring-surface-card`}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* HTML Tooltip (Absolutely positioned over SVG container) */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div 
            className="absolute z-20 bg-surface-card border border-border-default shadow-lg rounded-xl p-3 text-sm pointer-events-none min-w-[140px]"
            style={{
              left: Math.min(Math.max(40, (points[hoveredIndex].x / width) * 100), 70) + '%',
              top: '15%',
              transform: 'translateX(-50%)'
            }}
          >
            <p className="font-semibold text-text-primary mb-2 border-b border-border-default pb-1">
              {new Date(points[hoveredIndex].date).toLocaleDateString("en-IN", {
                weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
              })}
            </p>
            <div className="flex flex-col gap-1">
              {visibleCategories.map((cat) => {
                const val = points[hoveredIndex].values[cat]?.value || 0;
                // Don't show zeros for sub-categories to keep tooltip clean
                if (val === 0 && cat !== 'total') return null;
                
                // For Total, display Total Waste instead of 'total'
                const label = cat === 'total' ? 'Total Waste' : cat;
                const colorClass = CATEGORY_STYLES[cat]?.replace('text-', 'bg-') || 'bg-text-muted';
                
                return (
                  <div key={`tooltip-${cat}`} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
                      <span className="text-text-muted capitalize">{label}</span>
                    </div>
                    <span className="font-medium text-text-primary">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 px-2 border-t border-border-default pt-4">
        {Object.keys(CATEGORY_STYLES).map((category) => {
          const isVisible = visibleCategories.includes(category);
          const label = category === 'total' ? 'Total Waste' : category;
          const bgClass = CATEGORY_STYLES[category]?.replace('text-', 'bg-');
          const borderClass = CATEGORY_STYLES[category]?.replace('text-', 'border-');

          return (
            <button
              key={`legend-${category}`}
              onClick={() => toggleCategory(category)}
              className={`flex items-center gap-2 text-[13px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                isVisible 
                  ? `${borderClass} bg-surface-card text-text-primary shadow-sm` 
                  : 'border-transparent text-text-muted hover:bg-surface-hover opacity-50'
              }`}
              type="button"
              aria-pressed={isVisible}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${bgClass}`} />
              <span className="capitalize">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default memo(WasteTrendChart);
