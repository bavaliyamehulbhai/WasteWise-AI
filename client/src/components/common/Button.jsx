const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-hover",

  secondary:
    "bg-surface-card text-success-text border border-border-default hover:bg-success-bg",

  danger:
    "bg-surface-card text-[#C94F4F] border border-border-default",
};

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        min-h-12
        px-5
        rounded-[14px]
        text-sm
        font-semibold
        transition
        duration-200
        active:scale-[0.98]
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
