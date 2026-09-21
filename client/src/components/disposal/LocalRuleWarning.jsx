import {
  Info,
} from "lucide-react";

function LocalRuleWarning({ message }) {
  return (
    <div
      className="
        rounded-[20px]
        border
        border-[#E9D8A6]
        bg-[#FFF8E8]
        p-5
      "
    >
      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-card">
          <Info
            size={18}
            className="text-[#8A641E]"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#6F5218]">
            Check local rules
          </h2>

          <p className="mt-2 text-xs leading-5 text-[#80672D]">
            {message}
          </p>
        </div>

      </div>
    </div>
  );
}

export default LocalRuleWarning;
