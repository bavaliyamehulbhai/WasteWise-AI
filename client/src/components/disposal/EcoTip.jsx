import {
  Leaf,
} from "lucide-react";

function EcoTip({ tip }) {
  return (
    <div className="rounded-[20px] bg-brand p-5 text-white lg:p-6">

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-card">
          <Leaf
            size={19}
            className="text-brand"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-[#DDF3E5]">
            Eco Tip
          </p>

          <h2 className="mt-0.5 text-base font-semibold">
            Make a little more impact
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#E7F4EB]">
        {tip}
      </p>

    </div>
  );
}

export default EcoTip;
