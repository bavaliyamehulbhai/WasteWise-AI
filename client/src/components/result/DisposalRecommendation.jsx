import {
  Recycle,
  ArrowRight,
} from "lucide-react";

import Button from "../common/Button";

function DisposalRecommendation({ disposal, onViewGuide }) {
  return (
    <section className="rounded-[22px] bg-brand p-5 text-white lg:p-6">

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-card">
          <Recycle
            size={24}
            className="text-brand"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-[#DDF3E5]">
            Recommended disposal
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            {disposal.stream}
          </h2>
        </div>

      </div>

      <div className="mt-5 rounded-[16px] bg-surface-card/10 p-4">
        <p className="text-sm font-semibold">
          {disposal.action}
        </p>

        <p className="mt-2 text-xs leading-5 text-[#E7F4EB]">
          {disposal.shortDescription}
        </p>
      </div>

      <Button
        className="
          mt-5
          w-full
          bg-surface-card
          !text-success-text
          hover:bg-success-bg
        "
        onClick={onViewGuide}
      >
        View Disposal Guide
        <ArrowRight
          size={16}
          className="ml-2"
        />
      </Button>

    </section>
  );
}

export default DisposalRecommendation;
