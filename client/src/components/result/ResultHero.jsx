import {
  CheckCircle2,
  Recycle,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";

function ResultHero({ result }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-success-bg p-5 lg:p-6">

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={18}
            className="text-brand"
          />

          <span className="text-xs font-semibold text-success-text">
            AI Result
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr] lg:items-center">

          {/* Image */}
          <div className="relative overflow-hidden rounded-[20px] bg-surface-card">
            {result.image ? (
              <img
                src={result.image}
                alt={result.item.name}
                className="h-[210px] w-full object-contain lg:h-[190px]"
              />
            ) : (
              <div className="flex h-[210px] items-center justify-center lg:h-[190px]">
                <Recycle
                  size={60}
                  className="text-brand"
                />
              </div>
            )}
          </div>

          {/* Result */}
          <div>
            <p className="text-xs font-medium text-text-muted">
              Detected item
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-text-primary lg:text-[28px]">
              {result.item.name}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>
                {result.item.category}
              </Badge>

              <span className="inline-flex items-center rounded-full bg-surface-card px-3 py-1.5 text-xs font-semibold text-success-text">
                {result.item.material}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-text-muted">
              {result.disposal.shortDescription}
            </p>
          </div>

        </div>
      </div>
    </Card>
  );
}

export default ResultHero;
