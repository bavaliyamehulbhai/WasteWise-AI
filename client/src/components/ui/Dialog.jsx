import { X } from "lucide-react";
import { useEffect, useId } from "react";

function Dialog({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
}) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descId = `${dialogId}-desc`;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const maxWidths = {
    sm: "max-w-[400px]",
    md: "max-w-[480px]",
    lg: "max-w-[720px]",
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0F231B]/45 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className={`
          relative
          w-full
          ${maxWidths[size]}
          transform
          overflow-hidden
          rounded-[20px]
          bg-surface-card
          p-5
          sm:p-6
          shadow-[0_20px_60px_rgba(15,35,27,0.1)]
          transition-all
        `}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-[#F1F5F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Header */}
        {(title || description) && (
          <div className="mb-6 pr-8">
            {title && (
              <h2 id={titleId} className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="mt-1 text-[13px] text-text-muted">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body & Footer */}
        {children}
      </div>
    </div>
  );
}

export default Dialog;
