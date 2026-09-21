function ConfidenceBadge({
  value,
}) {
  const variant =
    value >= 90
      ? "high"
      : value >= 75
        ? "medium"
        : "low";

  const styles = {
    high: "bg-success-bg text-success-text",
    medium: "bg-[#FFF8E8] text-[#80672D]",
    low: "bg-[#FFF7F7] text-[#A53E3E]",
  };

  const labels = {
    high: "High confidence",
    medium: "Medium confidence",
    low: "Low confidence",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-semibold
        ${styles[variant]}
      `}
    >
      {value}%
      <span>•</span>
      {labels[variant]}
    </span>
  );
}

export default ConfidenceBadge;
