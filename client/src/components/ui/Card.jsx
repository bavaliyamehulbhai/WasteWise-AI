function Card({
  children,
  variant = "default",
  padding = "default",
  className = "",
  onClick,
}) {
  const variants = {
    default: `
      border-border-default
      bg-surface-card
    `,

    interactive: `
      border-border-default
      bg-surface-card
      transition
      hover:bg-surface-page
    `,

    highlight: `
      border-transparent
      bg-success-bg
    `,

    warning: `
      border-[#F2D89B]
      bg-[#FFF8E8]
    `,

    danger: `
      border-[#E8C7C7]
      bg-[#FFF7F7]
    `,
  };

  const paddings = {
    compact: "p-4",
    default: "p-5 lg:p-6",
    large: "p-6 lg:p-8",
  };

  const Component = onClick
    ? "button"
    : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`
        w-full
        rounded-[16px]
        md:rounded-[20px]
        border
        text-left
        ${variants[variant]}
        ${paddings[padding]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

export default Card;
