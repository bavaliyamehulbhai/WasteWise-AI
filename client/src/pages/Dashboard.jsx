import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboard, getDashboardTrends } from "../services/dashboardService";
import { getGamification } from "../services/gamificationService";

import DashboardStats from "../components/dashboard/DashboardStats";
import WasteTrendChart from "../components/dashboard/WasteTrendChart";
import RewardsCard from "../components/dashboard/RewardsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import WasteBreakdown from "../components/dashboard/WasteBreakdown";
import EnvironmentalImpact from "../components/dashboard/EnvironmentalImpact";
import GreenTips from "../components/dashboard/GreenTips";
import SyncStatus from "../components/common/SyncStatus";
import RecommendationsList from "../components/recommendations/RecommendationsList";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const isOnline = useOnlineStatus();
  
  // Main Dashboard & Gamification State
  const [dashboard, setDashboard] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Trend State
  const [trendRange, setTrendRange] = useState(30);
  const [trendData, setTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError("");
        
        const [dashData, gamificationData] = await Promise.all([
          getDashboard(),
          getGamification().catch(err => {
            console.error("Failed to load gamification data", err);
            return { gamification: null }; // Fallback so dashboard doesn't crash entirely
          })
        ]);
        
        setDashboard(dashData);
        if (gamificationData?.success) {
          setGamification(gamificationData.gamification);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(
          error.response?.data?.message || "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated]);

  useEffect(() => {
    const loadTrends = async () => {
      if (!isAuthenticated) return;

      try {
        setTrendLoading(true);
        setTrendError("");
        const data = await getDashboardTrends(trendRange);
        if (data.success) {
          setTrendData(data.data);
        } else {
          setTrendError(data.message || "Failed to load trends");
        }
      } catch (error) {
        console.error("Dashboard Trends error:", error);
        setTrendError(
          error.response?.data?.message || error.message || "Unable to load trends."
        );
      } finally {
        setTrendLoading(false);
      }
    };

    loadTrends();
  }, [isAuthenticated, trendRange]);

  if (loading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-32 rounded-2xl bg-surface-card border border-border-default" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="h-96 rounded-2xl bg-surface-card border border-border-default lg:col-span-8" />
          <div className="h-96 rounded-2xl bg-surface-card border border-border-default lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl bg-error-bg border border-error-text p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-error-text">
            Unable to load dashboard
          </h2>
          <p className="mt-2 text-sm font-medium text-error-text/80 mb-6">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-error-text text-white font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      
      <div className="flex items-center justify-between mb-2 print:hidden">
        <div>
          {!isOnline && (
            <div className="text-sm font-medium text-text-muted bg-surface-card border border-border-default px-4 py-2 rounded-xl inline-flex shadow-sm">
              Offline • Showing cached dashboard
            </div>
          )}
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand hover:bg-brand/20 font-semibold rounded-xl transition-colors ml-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Download Report
        </button>
      </div>

      <SyncStatus />
      
      {/* Metrics */}
      <DashboardStats metrics={dashboard.metrics} comparisons={dashboard.comparisons} />

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main: Trends & Rewards */}
        <section className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          <RecommendationsList />
          <WasteTrendChart 
            data={trendData} 
            range={trendRange} 
            onRangeChange={setTrendRange} 
            loading={trendLoading} 
            error={trendError}
          />
        </section>
        
        <section className="lg:col-span-4 flex flex-col min-w-0">
          <RewardsCard gamification={gamification} />
        </section>

        {/* Secondary: Recent Activity & Breakdown */}
        <section className="lg:col-span-8 min-w-0">
          <RecentActivity scans={dashboard.recentScans} />
        </section>
        
        <section className="lg:col-span-4 flex flex-col min-w-0">
          <WasteBreakdown data={dashboard.categoryBreakdown} />
        </section>

        {/* Bottom: Environmental Impact & Tips */}
        <section className="lg:col-span-8 min-w-0">
          <EnvironmentalImpact />
        </section>
        
        <section className="lg:col-span-4 flex flex-col min-w-0">
          <GreenTips />
        </section>
      </div>

    </div>
  );
};

export default Dashboard;
