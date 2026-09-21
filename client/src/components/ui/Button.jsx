import {
  LoaderCircle,
} from "lucide-react";

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  isLoading = false,
  loadingText = "Processing...",
  disabled = false,
  iconLeft,
  iconRight,
  type = "button",
  onClick,
  className = "",
  "aria-label": ariaLabel,
  ...props
}) {
  const variants = {
    primary: `
      bg-brand
      text-white
      hover:bg-brand-hover
      active:bg-[#1E5A3A]
    `,

    secondary: `
      border
      border-border-default
      bg-surface-card
      text-success-text
      hover:bg-surface-page
    `,

    ghost: `
      bg-transparent
      text-success-text
      hover:bg-success-bg
    `,

    danger: `
      bg-[#C94F4F]
      text-white
      hover:bg-[#A53E3E]
    `,
  };

  const sizes = {
    sm: `
      h-9
      px-3
      text-xs
      rounded-[10px]
    `,

    md: `
      h-11
      px-4
      text-sm
      rounded-[12px]
    `,

    lg: `
      h-12
      px-5
      text-[15px]
      rounded-[12px]
    `,
  };

  const isCurrentlyLoading = loading || isLoading;

  return (
    <button
      type={type}
      disabled={disabled || isCurrentlyLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        font-semibold
        outline-none
        transition
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >

      {isCurrentlyLoading ? (
        <>
          <LoaderCircle
            size={17}
            className="animate-spin"
          />

          <span>
            {loadingText}
          </span>
        </>

      ) : (
        <>
          {iconLeft}

          <span>
            {children}
          </span>

          {iconRight}
        </>
      )}

    </button>
  );
}

export default Button;
