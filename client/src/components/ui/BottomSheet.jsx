import { useEffect } from "react";

function BottomSheet({ open, onClose, children }) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0F231B]/45 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div 
        className={`
          absolute bottom-0 left-0 right-0
          transform transition-transform duration-300
          bg-surface-card rounded-t-[24px] shadow-[0_-10px_40px_rgba(15,35,27,0.1)]
          flex flex-col max-h-[85vh]
        `}
      >
        {/* Handle */}
        <div className="flex w-full items-center justify-center pt-4 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-[#E4EBE7]" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default BottomSheet;
