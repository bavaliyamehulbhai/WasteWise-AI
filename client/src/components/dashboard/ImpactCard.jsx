import {
  Leaf,
  Recycle,
  ArrowUpRight,
} from "lucide-react";

import Card from "../common/Card";

function ImpactCard({ impact }) {
  return (
    <Card className="mt-5 p-5 lg:mt-6 lg:p-6">

      <div className="flex items-center gap-2">
        <Leaf
          size={18}
          className="text-brand"
        />

        <h2 className="text-lg font-semibold text-text-primary">
          Your Impact
        </h2>
      </div>

      <p className="mt-1 text-xs text-text-muted">
        Your activity this month.
      </p>

      <div className="mt-6 space-y-4">

        <ImpactRow
          icon={Recycle}
          label="Items recycled"
          value={impact.recycledItems}
        />

        <ImpactRow
          icon={Leaf}
          label="Diverted from landfill"
          value={impact.divertedFromLandfill}
        />

        <ImpactRow
          icon={ArrowUpRight}
          label="Eco actions"
          value={impact.ecoActions}
        />

      </div>

      <div className="mt-6 rounded-[16px] bg-success-bg p-4">
        <p className="text-xs font-semibold text-success-text">
          Keep it going 🌱
        </p>

        <p className="mt-1 text-[11px] leading-5 text-text-muted">
          Consistent small actions can make your waste habits
          more sustainable.
        </p>
      </div>

    </Card>
  );
}

function ImpactRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-bg">
        <Icon
          size={18}
          className="text-brand"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-muted">
          {label}
        </p>

        <p className="mt-1 text-base font-semibold text-text-primary">
          {value}
        </p>
      </div>

    </div>
  );
}

export default ImpactCard;
