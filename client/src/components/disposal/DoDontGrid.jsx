import { Check, X } from "lucide-react";

function DoDontGrid({ doList, dontList }) {
  if (!doList?.length && !dontList?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      
      {/* DO Section */}
      {doList?.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border-default pb-2">
            <Check size={20} className="text-brand" />
            <h3 className="font-semibold text-text-primary">Do</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {doList.map((item, index) => (
              <li key={index} className="flex gap-2 items-start text-sm text-text-primary">
                <span className="text-brand mt-1 shrink-0">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* DON'T Section */}
      {dontList?.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border-default pb-2">
            <X size={20} className="text-error-text" />
            <h3 className="font-semibold text-text-primary">Don't</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {dontList.map((item, index) => (
              <li key={index} className="flex gap-2 items-start text-sm text-text-primary">
                <span className="text-error-text mt-1 shrink-0">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default DoDontGrid;
