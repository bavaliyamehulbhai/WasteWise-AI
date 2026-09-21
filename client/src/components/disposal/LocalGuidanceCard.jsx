import { MapPin } from "lucide-react";

function LocalGuidanceCard({ hasLocalGuidance }) {
  // Currently MVP behavior: Just tell user to check local rules.
  // In future, this could use actual location data.

  return (
    <div className="bg-surface-page border border-border-default rounded-xl p-5 mt-6 flex gap-4 items-start">
      <div className="shrink-0 mt-0.5">
        <MapPin size={24} className="text-brand" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-text-primary">
          Local disposal guidance
        </h3>
        <p className="text-sm text-text-muted mt-1 leading-relaxed">
          Disposal rules can vary by location. Always follow your local waste-management authority's guidance.
        </p>
      </div>
    </div>
  );
}

export default LocalGuidanceCard;
