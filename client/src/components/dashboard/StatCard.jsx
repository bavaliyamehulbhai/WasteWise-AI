function StatCard({
  value,
  label,
  description,
}) {
  return (
    <div
      className="
        rounded-[18px]
        border
        border-border-default
        bg-surface-card
        p-4
        lg:p-5
      "
    >
      <p className="text-2xl font-semibold text-text-primary lg:text-[28px]">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-text-muted">
        {label}
      </p>

      {description && (
        <p className="mt-2 text-[10px] text-brand">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;
