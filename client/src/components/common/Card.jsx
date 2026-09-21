function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-surface-card
        border border-border-default
        rounded-[16px]
        md:rounded-[20px]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
