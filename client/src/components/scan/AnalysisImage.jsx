import { Sparkles } from "lucide-react";

function AnalysisImage({ image }) {
  return (
    <div
      className="
        relative
        mx-auto
        w-full
        max-w-[420px]
        overflow-hidden
        rounded-[24px]
        border
        border-border-default
        bg-success-bg
      "
    >
      <img
        src={image}
        alt="Waste item being analyzed"
        className="
          h-[300px]
          w-full
          object-contain
          lg:h-[360px]
        "
      />

      {/* AI scanning overlay */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-1
          animate-[scan_2.5s_ease-in-out_infinite]
          bg-brand
          shadow-[0_0_15px_rgba(47,143,91,0.8)]
        "
      />

      <div
        className="
          absolute
          bottom-4
          left-4
          right-4
          flex
          items-center
          gap-2
          rounded-xl
          bg-black/60
          px-4
          py-3
          backdrop-blur-sm
        "
      >
        <Sparkles
          size={16}
          className="text-white"
        />

        <span className="text-xs font-medium text-white">
          AI is analyzing this image
        </span>
      </div>
    </div>
  );
}

export default AnalysisImage;
