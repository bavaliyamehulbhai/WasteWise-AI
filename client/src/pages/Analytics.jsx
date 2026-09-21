import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsMetrics from "../components/analytics/AnalyticsMetrics";
import AnalyticsTrendChart from "../components/analytics/AnalyticsTrendChart";
import AnalyticsBreakdown from "../components/analytics/AnalyticsBreakdown";
import DisposalAnalysis from "../components/analytics/DisposalAnalysis";
import EnvironmentalImpact from "../components/analytics/EnvironmentalImpact";
import { getAnalytics } from "../services/analyticsService";
import { Activity } from "lucide-react";
import Button from "../components/ui/Button";
import EmptyState from "../components/common/EmptyState";

function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRange = Number(searchParams.get("range")) || 30;
  
  const [range, setRange] = useState(initialRange);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async (selectedRange) => {
    try {
      setLoading(true);
      setError("");
      const data = await getAnalytics(selectedRange);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(range);
    setSearchParams({ range: String(range) });
  }, [range]);

  const handleRangeChange = (newRange) => {
    setRange(newRange);
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-surface-page pb-10">
        <main className="px-5 py-6 lg:px-12 lg:py-10 max-w-[1200px] mx-auto flex flex-col gap-6">
          <div className="w-48 h-8 rounded bg-[#D8E6DD] animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-[120px] rounded-2xl bg-[#D8E6DD] animate-pulse opacity-50" />)}
          </div>
          <div className="h-[300px] rounded-2xl bg-[#D8E6DD] animate-pulse opacity-50" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-page pb-10">
        <main className="px-5 py-6 lg:px-12 lg:py-10 max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center justify-center py-20 bg-surface-card rounded-2xl border border-error-text">
            <h3 className="text-xl font-bold text-error-text mb-2">Unable to load analytics</h3>
            <p className="text-text-muted mb-6">Please try again.</p>
            <Button onClick={() => loadAnalytics(range)}>Retry</Button>
          </div>
        </main>
      </div>
    );
  }

  const hasScans = analytics?.summary?.totalScans > 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 w-full max-w-[1200px] mx-auto">
      <AnalyticsHeader range={range} onRangeChange={handleRangeChange} />

      {!hasScans ? (
        <div className="mt-4">
          <EmptyState 
            icon="search"
            title="No analytics available yet"
            description="Complete your first waste scan to start building your analytics."
            actionLabel="Scan Waste"
            actionUrl="/scan"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <AnalyticsMetrics summary={analytics.summary} comparison={analytics.comparison} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 min-w-0">
              <AnalyticsTrendChart trends={analytics.trends} />
            </div>
            <div className="lg:col-span-1 min-w-0">
              <AnalyticsBreakdown categories={analytics.categories} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="min-w-0">
              <DisposalAnalysis disposal={analytics.disposal} />
            </div>
            
            <div className="flex flex-col gap-6 min-w-0">
              {analytics.confidence?.averageReportedConfidence && (
                <div className="bg-surface-card rounded-2xl p-6 border border-border-default shadow-sm">
                  <h3 className="font-bold text-text-primary text-lg mb-2">Confidence Analysis</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-text-muted">Average AI-reported confidence</span>
                    <span className="font-bold text-brand text-2xl">{analytics.confidence.averageReportedConfidence}%</span>
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <EnvironmentalImpact impact={analytics.impact} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
