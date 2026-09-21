const variants = {
  success: "bg-success-bg text-success-text",
  warning: "bg-[#FFF8E8] text-[#8A641E]",
  danger: "bg-red-50 text-[#C94F4F]",
};

function Badge({
  children,
  variant = "success",
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        px-3
        py-1.5
        rounded-full
        text-xs
        font-semibold
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
