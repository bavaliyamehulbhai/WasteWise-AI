import {
  Recycle,
  ArrowRight,
} from "lucide-react";

import Card from "../common/Card";

function DashboardActivity({ activities }) {
  return (
    <Card className="mt-5 p-5 lg:mt-6 lg:p-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Activity
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            Your latest waste scans.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="mt-6 divide-y divide-border-default">

        {activities.map((activity) => (
          <div
            key={activity.id}
            className="
              flex
              items-center
              gap-3
              py-4
              first:pt-0
              last:pb-0
            "
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-bg">
              <Recycle
                size={17}
                className="text-brand"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-text-primary">
                {activity.item}
              </p>

              <p className="mt-1 truncate text-[10px] text-text-muted">
                {activity.category} • {activity.confidence}% confidence
              </p>
            </div>

            <div className="hidden shrink-0 text-right sm:block">
              <p className="text-[10px] font-medium text-success-text">
                {activity.action}
              </p>

              <p className="mt-1 text-[10px] text-text-muted">
                {activity.time}
              </p>
            </div>

          </div>
        ))}

      </div>

    </Card>
  );
}

export default DashboardActivity;
