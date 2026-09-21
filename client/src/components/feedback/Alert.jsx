import { 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  XCircle 
} from "lucide-react";

const alertConfig = {
  success: {
    bg: "bg-success-bg",
    border: "border-border-default",
    text: "text-text-primary",
    desc: "text-success-text",
    icon: <CheckCircle2 size={20} className="text-brand" />,
  },
  info: {
    bg: "bg-[#EEF5F7]",
    border: "border-[#DDECEF]",
    text: "text-[#1B363C]",
    desc: "text-[#35616A]",
    icon: <Info size={20} className="text-[#43808A]" />,
  },
  warning: {
    bg: "bg-warning-bg",
    border: "border-[#F5E6CC]",
    text: "text-[#4A3610]",
    desc: "text-warning-text",
    icon: <AlertTriangle size={20} className="text-[#B88428]" />,
  },
  error: {
    bg: "bg-error-bg",
    border: "border-[#F5DCDC]",
    text: "text-[#5D2121]",
    desc: "text-[#9B3838]",
    icon: <XCircle size={20} className="text-[#C94F4F]" />,
  },
};

function Alert({
  type = "info",
  title,
  description,
  action,
  className = "",
}) {
  const config = alertConfig[type];

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`
        flex items-start gap-3
        p-4 rounded-[16px] border
        ${config.bg} ${config.border}
        ${className}
      `}
    >
      <div className="shrink-0 mt-0.5">
        {config.icon}
      </div>

      <div className="min-w-0 flex-1">
        {title && (
          <h3 className={`text-[13px] font-semibold ${config.text}`}>
            {title}
          </h3>
        )}
        
        {description && (
          <p className={`mt-1 text-xs leading-relaxed ${config.desc}`}>
            {description}
          </p>
        )}

        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export default Alert;
