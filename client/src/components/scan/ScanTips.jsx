import {
  Sun,
  Focus,
  Maximize2,
  Sparkles,
} from "lucide-react";

import Card from "../common/Card";

const tips = [
  {
    icon: Focus,
    title: "Keep the item centered",
    description: "Place the waste clearly inside the frame.",
  },
  {
    icon: Sun,
    title: "Use good lighting",
    description: "Avoid dark or heavily shadowed images.",
  },
  {
    icon: Maximize2,
    title: "Show the whole item",
    description: "Keep important details visible.",
  },
  {
    icon: Sparkles,
    title: "Avoid blurry photos",
    description: "A sharp image improves AI recognition.",
  },
];

function ScanTips() {
  return (
    <Card className="p-5 lg:p-6">
      <h2 className="text-lg font-semibold text-text-primary">
        Tips for a better scan
      </h2>

      <div className="mt-6 space-y-5">
        {tips.map((tip) => {
          const Icon = tip.icon;

          return (
            <div
              key={tip.title}
              className="flex gap-3"
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-success-bg
                "
              >
                <Icon
                  size={18}
                  className="text-brand"
                />
              </div>

              <div>
                <h3 className="text-xs font-semibold text-text-primary">
                  {tip.title}
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-text-muted">
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-7 border-t border-border-default pt-5">
        <p className="text-xs font-semibold text-success-text">
          AI will return
        </p>

        <ul className="mt-3 space-y-2 text-xs text-text-muted">
          <li>• Waste category</li>
          <li>• AI confidence</li>
          <li>• Recyclability status</li>
          <li>• Disposal guidance</li>
        </ul>
      </div>
    </Card>
  );
}

export default ScanTips;
