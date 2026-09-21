import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", scans: 5 },
  { day: "Tue", scans: 8 },
  { day: "Wed", scans: 6 },
  { day: "Thu", scans: 11 },
  { day: "Fri", scans: 9 },
  { day: "Sat", scans: 13 },
  { day: "Sun", scans: 10 },
];

function ScanTrendChart() {
  return (
    <div className="
      h-[200px]
      w-full
      lg:h-[240px]
    ">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="scans"
            stroke="#2F8F5B"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScanTrendChart;
