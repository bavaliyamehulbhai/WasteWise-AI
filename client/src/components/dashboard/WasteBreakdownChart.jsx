function WasteBreakdownChart({ data, totalScans }) {
  if (totalScans === 0 || !data || data.length === 0) {
    return (
      <div className="bg-surface-card border border-border-default rounded-[24px] p-6 lg:p-8 flex flex-col justify-center min-h-[280px]">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Waste Breakdown</h3>
        <p className="text-text-muted text-sm">Scan a few items to see your waste breakdown.</p>
      </div>
    );
  }

  // Calculate percentages and sort by count descending
  const calculatedData = data.map(item => ({
    category: item._id,
    count: item.count,
    percentage: Math.round((item.count / totalScans) * 100)
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-surface-card border border-border-default rounded-[24px] p-6 lg:p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-6">Waste Breakdown</h3>
      
      <div className="flex flex-col gap-5">
        {calculatedData.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            
            {/* Label & Value */}
            <div className="flex justify-between items-end text-sm">
              <span className="font-medium text-text-primary">{item.category}</span>
              <span className="text-text-muted font-semibold">{item.percentage}% ({item.count})</span>
            </div>
            
            {/* Bar */}
            <div className="w-full h-3 bg-surface-page rounded-full overflow-hidden border border-[#E8F4EC]">
              <div 
                className="h-full bg-brand rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WasteBreakdownChart;
