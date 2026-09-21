import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { wasteCategories } from "../../config/wasteCategories";
import Card from "../common/Card";

function CategoryDistribution({ data, total }) {
  if (!data || data.length === 0) return null;

  return (
    <Card className="h-full p-5 lg:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-text-primary">Waste Categories</h3>
      </div>
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="h-[200px] w-[200px] lg:h-[240px] lg:w-[240px] shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="85%"
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, index) => {
                  const config = wasteCategories[entry.id] || wasteCategories.unknown;
                  return <Cell key={`cell-${index}`} fill={config.iconColor} />;
                })}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: "12px", border: "1px solid #D8E6DD", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                itemStyle={{ color: "#16352A", fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-text-primary">{total}</span>
            <span className="text-[11px] text-text-muted">Total Scans</span>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-3">
          {data.slice(0, 4).map((item) => {
            const config = wasteCategories[item.id] || wasteCategories.unknown;
            return (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.iconColor }} />
                  <span className="text-text-primary">{item.name}</span>
                </div>
                <span className="font-medium text-text-primary">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default CategoryDistribution;
