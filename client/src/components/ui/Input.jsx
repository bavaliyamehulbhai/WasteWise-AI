import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = forwardRef(
  ({ label, id, error, type = "text", className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-text-primary">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`
              w-full h-12 px-4 rounded-xl text-sm transition-all duration-200 outline-none
              bg-surface-page border
              ${error 
                ? "border-[#E54D4D] focus:border-[#E54D4D] focus:ring-2 focus:ring-[#E54D4D]/20 text-error-text" 
                : "border-border-default focus:border-brand focus:ring-2 focus:ring-brand/20 text-text-primary"
              }
              placeholder:text-text-muted disabled:opacity-50 disabled:cursor-not-allowed
              ${isPassword ? "pr-12" : (error ? "pr-10" : "")}
            `}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          
          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {/* Error Icon (Only if not password) */}
          {error && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error-text pointer-events-none">
              <AlertCircle size={18} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p id={`${id}-error`} className="text-xs text-error-text font-medium mt-0.5 flex items-start gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
