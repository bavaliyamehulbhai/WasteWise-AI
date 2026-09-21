import {
  Recycle,
  CheckCircle2,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";

function DisposalHero({ result }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-success-bg p-5 lg:p-7">

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={18}
            className="text-brand"
          />

          <span className="text-xs font-semibold text-success-text">
            Disposal recommendation
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[180px_1fr] lg:items-center">

          {/* Image */}
          <div className="flex h-[170px] items-center justify-center overflow-hidden rounded-[20px] bg-surface-card">
            {result.image ? (
              <img
                src={result.image}
                alt={result.item.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <Recycle
                size={56}
                className="text-brand"
              />
            )}
          </div>

          {/* Content */}
          <div>
            <p className="text-xs text-text-muted">
              Identified as
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-text-primary lg:text-[28px]">
              {result.item.name}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>
                {result.item.category}
              </Badge>

              <span className="rounded-full bg-surface-card px-3 py-1.5 text-xs font-semibold text-success-text">
                {result.item.material}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Recommended stream
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Recycle
                  size={20}
                  className="text-brand"
                />

                <span className="text-lg font-semibold text-success-text">
                  {result.disposal.stream}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
}

export default DisposalHero;
