import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

function DisposalStatus({ status }) {
  if (!status) return null;

  let config = {
    icon: <Info size={20} className="text-text-muted" />,
    title: "Unknown Status",
    desc: "Check local disposal requirements.",
    bg: "bg-surface-page",
    border: "border-border-default",
    text: "text-text-primary"
  };

  if (status === "recyclable") {
    config = {
      icon: <CheckCircle2 size={20} className="text-brand" />,
      title: "Recyclable",
      desc: "Check local recycling requirements before disposal.",
      bg: "bg-success-bg",
      border: "border-border-default",
      text: "text-success-text"
    };
  } else if (status === "non-recyclable") {
    config = {
      icon: <XCircle size={20} className="text-text-muted" />,
      title: "Not Recyclable",
      desc: "See disposal guidance for the recommended method.",
      bg: "bg-surface-page",
      border: "border-border-default",
      text: "text-text-primary"
    };
  } else if (status === "special") {
    config = {
      icon: <AlertTriangle size={20} className="text-[#B25E09]" />,
      title: "Special Disposal",
      desc: "Do not place this item in regular recycling.",
      bg: "bg-[#FFF4E5]",
      border: "border-[#F5D6B8]",
      text: "text-[#8C4A07]"
    };
  }

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${config.bg} ${config.border}`}>
      <div className="shrink-0 mt-0.5">
        {config.icon}
      </div>
      <div>
        <p className={`font-semibold text-sm ${config.text}`}>
          {config.title}
        </p>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">
          {config.desc}
        </p>
      </div>
    </div>
  );
}

export default DisposalStatus;
