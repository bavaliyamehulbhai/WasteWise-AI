import { Recycle, Trash2, AlertTriangle, HelpCircle } from "lucide-react";

function RecommendedActionCard({ action }) {
  let config = {
    icon: <HelpCircle size={28} className="text-text-muted" />,
    title: "Unknown Disposal",
    desc: "We couldn't determine a reliable disposal method. Please check your local waste authority's guidance.",
    bg: "bg-surface-page",
    border: "border-border-default",
    text: "text-text-primary"
  };

  if (action === "recycle") {
    config = {
      icon: <Recycle size={28} className="text-brand" />,
      title: "Recycle",
      desc: "Prepare the item according to your local recycling requirements.",
      bg: "bg-success-bg",
      border: "border-border-default",
      text: "text-success-text"
    };
  } else if (action === "trash") {
    config = {
      icon: <Trash2 size={28} className="text-text-muted" />,
      title: "General Waste",
      desc: "Place this item in the appropriate general-waste stream according to local guidance.",
      bg: "bg-surface-page",
      border: "border-border-default",
      text: "text-text-primary"
    };
  } else if (action === "special") {
    config = {
      icon: <AlertTriangle size={28} className="text-[#B25E09]" />,
      title: "Special Disposal",
      desc: "Do not place this item in regular household waste or recycling. Take it to an appropriate collection point.",
      bg: "bg-[#FFF4E5]",
      border: "border-[#F5D6B8]",
      text: "text-[#8C4A07]"
    };
  }

  return (
    <div className={`p-6 md:p-8 rounded-[24px] border shadow-sm flex flex-col gap-4 ${config.bg} ${config.border}`}>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        Recommended Action
      </h2>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {config.icon}
          <h3 className={`text-2xl md:text-[28px] font-bold ${config.text}`}>
            {config.title}
          </h3>
        </div>
        <p className="text-sm md:text-base text-text-primary leading-relaxed max-w-[400px]">
          {config.desc}
        </p>
      </div>
    </div>
  );
}

export default RecommendedActionCard;
