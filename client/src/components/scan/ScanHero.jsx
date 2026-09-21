import { ScanLine, ArrowRight, Recycle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../common/Button";

function ScanHero() {
  const navigate = useNavigate();

  return (
    <section
      className="
        mt-7
        overflow-hidden
        rounded-[24px]
        bg-brand
        p-6
        text-white
        lg:mt-8
        lg:flex
        lg:min-h-[210px]
        lg:items-center
        lg:justify-between
        lg:px-8
      "
    >
      <div className="max-w-[520px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#DDF3E5]">
          WasteWise AI
        </p>

        <h2 className="mt-2 text-2xl font-semibold lg:text-[26px]">
          Don’t know where it goes?
        </h2>

        <p className="mt-3 max-w-[480px] text-sm leading-6 text-[#E7F4EB]">
          Scan a waste item and let AI identify the category,
          confidence, and next disposal step.
        </p>

        <Button
          className="mt-5 bg-surface-card !text-success-text hover:bg-success-bg"
          onClick={() => navigate("/scan")}
        >
          <span className="flex items-center justify-center gap-2">
            <ScanLine size={18} />
            Scan Waste
            <ArrowRight size={16} />
          </span>
        </Button>
      </div>

      {/* Desktop illustration */}
      <div
        className="
          hidden
          lg:flex
          lg:h-32
          lg:w-32
          lg:items-center
          lg:justify-center
          lg:rounded-full
          lg:bg-surface-card
        "
      >
        <Recycle
          size={62}
          strokeWidth={1.8}
          className="text-brand"
        />
      </div>
    </section>
  );
}

export default ScanHero;
