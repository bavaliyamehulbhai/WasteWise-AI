import StatCard from "./StatCard";

const stats = [
  {
    value: "24",
    label: "Total Scans",
    description: "+12% this month",
  },
  {
    value: "21",
    label: "High-confidence",
    description: "88% of scans",
  },
  {
    value: "18",
    label: "Eco Actions",
    description: "+5 this month",
  },
  {
    value: "82",
    label: "Eco Score",
    description: "Great progress",
  },
];

function StatsSection() {
  return (
    <section className="mt-5 lg:mt-6">
      <div
        className="
          grid
          grid-cols-2
          gap-3
          md:grid-cols-4
          lg:gap-4
        "
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            description={stat.description}
          />
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
