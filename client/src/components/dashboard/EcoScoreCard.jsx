import {
  Leaf,
  TrendingUp,
} from "lucide-react";

function EcoScoreCard({
  score,
  label,
  change,
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const progress =
    circumference - (score / 100) * circumference;

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
        lg:items-center
        lg:justify-between
        lg:px-8
        lg:py-7
      "
    >
      <div>
        <div className="flex items-center gap-2">
          <Leaf
            size={18}
            className="text-[#DDF3E5]"
          />

          <p className="text-xs font-semibold uppercase tracking-wide text-[#DDF3E5]">
            Your Eco Score
          </p>
        </div>

        <div className="mt-3 flex items-end gap-3">
          <span className="text-5xl font-semibold">
            {score}
          </span>

          <span className="pb-2 text-sm text-[#DDF3E5]">
            / 100
          </span>
        </div>

        <p className="mt-2 text-sm font-medium">
          {label}
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-card/10 px-3 py-1.5">
          <TrendingUp size={14} />

          <span className="text-xs font-semibold">
            {change} this month
          </span>
        </div>
      </div>

      {/* Score ring */}
      <div className="mt-6 flex justify-center lg:mt-0">
        <div className="relative h-[140px] w-[140px]">

          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            className="-rotate-90"
          >
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="10"
            />

            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-semibold">
              {score}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

export default EcoScoreCard;
