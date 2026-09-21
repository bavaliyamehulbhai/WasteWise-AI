function Badge({
  children,
  variant = "neutral",
  className = "",
}) {
  const variants = {
    ai: "bg-success-bg text-success-text",
    success: "bg-success-bg text-success-text",
    warning: "bg-[#FFF8E8] text-[#80672D]",
    danger: "bg-[#FFF7F7] text-[#A53E3E]",
    neutral: "bg-[#F1F5F2] text-text-muted",
    category: "bg-success-bg text-success-text",
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
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
