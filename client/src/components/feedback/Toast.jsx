import { 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  XCircle, 
  X 
} from "lucide-react";

const toastConfig = {
  success: {
    bg: "bg-success-bg",
    text: "text-success-text",
    icon: <CheckCircle2 size={18} className="text-brand" />,
  },
  info: {
    bg: "bg-[#EEF5F7]",
    text: "text-[#35616A]",
    icon: <Info size={18} className="text-[#43808A]" />,
  },
  warning: {
    bg: "bg-warning-bg",
    text: "text-warning-text",
    icon: <AlertTriangle size={18} className="text-[#B88428]" />,
  },
  error: {
    bg: "bg-error-bg",
    text: "text-[#9B3838]",
    icon: <XCircle size={18} className="text-[#C94F4F]" />,
  },
};

function Toast({ toast, onClose }) {
  const config = toastConfig[toast.type] || toastConfig.info;

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={`
        flex items-center justify-between gap-3
        p-3 px-4 rounded-xl shadow-sm
        animate-in fade-in slide-in-from-top-2 duration-200
        ${config.bg} ${config.text}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0">{config.icon}</div>
        <p className="text-[13px] font-medium truncate">
          {toast.message}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="text-[13px] font-semibold hover:opacity-80 transition-opacity"
          >
            {toast.action.label}
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default Toast;
