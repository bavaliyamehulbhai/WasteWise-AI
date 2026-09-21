import { forwardRef, useId } from "react";

const Input = forwardRef(({
  label,
  error,
  helperText,
  id: providedId,
  className = "",
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-text-primary">
          {label} {props.required && <span className="text-[#C94F4F]">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`
          h-12 lg:h-11
          w-full
          rounded-xl
          border
          bg-surface-card
          px-4
          text-text-primary
          placeholder:text-[#94A39B]
          transition-colors
          focus:border-brand
          focus:outline-none
          focus:ring-4
          focus:ring-brand/15
          disabled:cursor-not-allowed
          disabled:bg-[#F5F7F6]
          disabled:text-[#94A39B]
          ${error ? "border-[#C94F4F] focus:border-[#C94F4F] focus:ring-[#C94F4F]/15" : "border-border-default hover:border-[#BFD2C7]"}
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs font-medium text-[#9B3838]">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
