const MetricsGrid = ({ metrics }) => {
  const total = metrics?.totalScans || 0;

  const getPercentage = (value) => {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  };

  const cards = [
    {
      title: "Total Scans",
      value: total,
      icon: "♧",
      isTotal: true,
    },
    {
      title: "Recyclable Items",
      value: metrics?.recyclable || 0,
      percentage: getPercentage(metrics?.recyclable || 0),
      icon: "♻",
    },
    {
      title: "Compost Items",
      value: metrics?.compost || 0,
      percentage: getPercentage(metrics?.compost || 0),
      icon: "🌱",
    },
    {
      title: "General Waste",
      value: metrics?.generalWaste || 0,
      percentage: getPercentage(metrics?.generalWaste || 0),
      icon: "🗑",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-border-default bg-surface-card p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-md flex flex-col"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand text-xl">
              {card.icon}
            </div>
            <button className="text-text-muted hover:text-text-primary">
              ⋮
            </button>
          </div>
          <p className="mt-4 text-sm font-medium text-text-muted">
            {card.title}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-text-primary">
              {card.value.toLocaleString()}
            </h3>
            {!card.isTotal && (
              <span className="text-sm font-medium text-text-muted">
                ({card.percentage}%)
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
