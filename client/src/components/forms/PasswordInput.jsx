import { useState, forwardRef, useId } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(({
  label,
  error,
  helperText,
  id: providedId,
  className = "",
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
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

      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          type={showPassword ? "text" : "password"}
          className={`
            h-12 lg:h-11
            w-full
            rounded-xl
            border
            bg-surface-card
            pl-4
            pr-12
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

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-md
            p-1
            text-[#94A39B]
            hover:bg-success-bg
            hover:text-brand
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-brand
            focus-visible:ring-offset-2
            transition-colors
          "
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

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

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
