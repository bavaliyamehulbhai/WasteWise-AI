import { useState } from "react";

const CATEGORY_COLORS = {
  Plastic: "#3B82F6", // blue-500
  Paper: "#10B981", // emerald-500
  Glass: "#F59E0B", // amber-500
  Metal: "#6366F1", // indigo-500
  Organic: "#84CC16", // lime-500
  "E-Waste": "#8B5CF6", // violet-500
  "General Waste": "#EF4444", // red-500
  Other: "#6B7280", // gray-500
};

function AnalyticsTrendChart({ trends }) {
  // Always show total by default, plus a few popular categories
  const [visibleLines, setVisibleLines] = useState(new Set(["total", "Plastic", "Paper", "Organic"]));

  if (!trends || trends.length === 0) return null;

  // Find max value for Y-axis scaling
  let maxValue = 0;
  trends.forEach((d) => {
    visibleLines.forEach((key) => {
      if (d[key] > maxValue) maxValue = d[key];
    });
  });

  // Ensure minimum scale of 5 to avoid flat charts for low numbers
  maxValue = Math.max(maxValue, 5);
  // Round up to nearest nice number (5, 10, 15, 20...)
  maxValue = Math.ceil(maxValue / 5) * 5;

  const toggleLine = (key) => {
    const newSet = new Set(visibleLines);
    if (newSet.has(key)) {
      if (newSet.size > 1) { // Prevent hiding all lines
        newSet.delete(key);
      }
    } else {
      newSet.add(key);
    }
    setVisibleLines(newSet);
  };

  const getPoints = (key) => {
    return trends.map((d, i) => {
      const x = (i / (trends.length - 1)) * 100;
      const y = 100 - (d[key] / maxValue) * 100;
      return `${x},${y}`;
    }).join(" ");
  };

  const categories = Object.keys(CATEGORY_COLORS);

  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-border-default shadow-sm w-full h-full">
      <div className="mb-6">
        <h3 className="font-bold text-text-primary text-lg">Waste Sorting Trends</h3>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => toggleLine("total")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
            visibleLines.has("total")
              ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
              : "bg-surface-page text-text-muted border-border-default hover:text-text-primary"
          }`}
        >
          Total
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleLine(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border flex items-center gap-1.5 ${
              visibleLines.has(cat)
                ? "bg-white border-border-default"
                : "bg-surface-page text-text-muted border-border-default opacity-60 hover:opacity-100"
            }`}
            style={visibleLines.has(cat) ? { color: CATEGORY_COLORS[cat] } : {}}
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: visibleLines.has(cat) ? CATEGORY_COLORS[cat] : "currentColor" }}
            />
            {cat}
          </button>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="relative h-[200px] w-full mt-4">
        {/* Y-Axis lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[maxValue, (maxValue * 2) / 3, maxValue / 3, 0].map((val, i) => (
            <div key={i} className="flex items-center w-full transform -translate-y-1/2">
              <span className="text-[10px] text-text-muted w-8 font-medium">
                {Math.round(val)}
              </span>
              <div className="flex-1 border-b border-border-default border-dashed opacity-50"></div>
            </div>
          ))}
        </div>

        {/* Lines */}
        <div className="absolute inset-0 left-8 right-0 bottom-0 h-[200px]">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Draw Total line first so it's in the background */}
            {visibleLines.has("total") && (
              <polyline
                points={getPoints("total")}
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 drop-shadow-sm opacity-20"
              />
            )}
            
            {/* Draw Category lines */}
            {categories.map(cat => {
              if (!visibleLines.has(cat)) return null;
              return (
                <polyline
                  key={cat}
                  points={getPoints(cat)}
                  fill="none"
                  stroke={CATEGORY_COLORS[cat]}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300 drop-shadow-sm"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between mt-3 text-[10px] text-text-muted font-medium pl-8">
        <span>{new Date(trends[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(trends[Math.floor(trends.length / 2)].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(trends[trends.length - 1].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}

export default AnalyticsTrendChart;
