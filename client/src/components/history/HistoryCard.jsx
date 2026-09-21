import { ArrowRight } from "lucide-react";
import Card from "../common/Card";
import CategoryBadge from "../waste/CategoryBadge";
import { formatScanDate } from "../../utils/formatDate";
// Note: ConfidenceBadge would be imported from the AI components folder.
// For now, assuming it exists or will be created soon.

function HistoryCard({
  scan,
  onClick,
}) {
  return (
    <Card
      variant="interactive"
      onClick={onClick}
      className="p-4"
    >
      <div className="flex gap-3">
        <img
          src={scan.image}
          alt={scan.item.name}
          className="
            h-14
            w-14
            shrink-0
            rounded-xl
            object-cover
          "
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="
                truncate
                text-sm
                font-semibold
                text-text-primary
              ">
                {scan.item.name}
              </p>
              <p className="
                mt-0.5
                text-xs
                text-text-muted
              ">
                {scan.item.material}
              </p>
            </div>

            <ArrowRight
              size={17}
              className="
                shrink-0
                text-[#94A39B]
              "
            />
          </div>

          <div className="
            mt-3
            flex
            flex-wrap
            items-center
            gap-2
          ">
            <CategoryBadge
              category={scan.item.category}
            />

            {/* Placeholder for ConfidenceBadge */}
            <span className="text-xs font-semibold text-success-text bg-success-bg px-2 py-0.5 rounded-full">
              {scan.confidence}%
            </span>
          </div>

          <div className="
            mt-2
            flex
            items-center
            justify-between
          ">
            <span className="
              text-xs
              text-text-muted
            ">
              {scan.disposal.stream}
            </span>

            <span className="
              text-xs
              text-[#94A39B]
            ">
              {formatScanDate(scan.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default HistoryCard;
