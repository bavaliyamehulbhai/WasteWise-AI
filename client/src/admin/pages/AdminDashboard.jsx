import { useState, useEffect } from "react";
import { Users, Scan, MessageSquare, Activity } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalScans: 0,
    totalFeedback: 0,
    aiSuccessRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get("/admin/metrics");
        if (data.success) {
          setMetrics(data.metrics);
        }
      } catch (error) {
        toast.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Users", value: metrics.totalUsers, icon: <Users size={24} className="text-brand" />, desc: `${metrics.activeUsers} active` },
    { title: "Total Scans", value: metrics.totalScans, icon: <Scan size={24} className="text-success-text" />, desc: "All time" },
    { title: "AI Success Rate", value: `${metrics.aiSuccessRate}%`, icon: <Activity size={24} className="text-brand" />, desc: "Confident classifications" },
    { title: "Pending Feedback", value: metrics.totalFeedback, icon: <MessageSquare size={24} className="text-warning-text" />, desc: "Awaiting review" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Dashboard Overview</h1>
        <p className="text-sm text-text-muted mt-1">Monitor the health and activity of WasteWise AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-surface-card border border-border-default rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-muted">{stat.title}</h3>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-text-primary">{stat.value}</span>
              </div>
              <p className="text-xs text-text-muted mt-2">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Charts & Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Scans Over Time - Custom CSS Chart */}
        <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-text-primary">Scans over time</h3>
            <span className="text-xs font-medium px-2.5 py-1 bg-brand/10 text-brand rounded-full">Last 7 Days</span>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[4, 12, 8, 15, 10, 24, metrics.totalScans].map((val, idx, arr) => {
              const max = Math.max(...arr, 1);
              const height = `${(val / max) * 100}%`;
              const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const day = days[(new Date().getDay() - (6 - idx) + 7) % 7];
              
              return (
                <div key={idx} className="flex flex-col items-center w-full h-full gap-2 group">
                  <div className="w-full relative flex justify-center h-full items-end">
                    <div 
                      className={`w-full max-w-[32px] rounded-t-sm transition-all duration-500 ease-out ${idx === arr.length - 1 ? 'bg-brand' : 'bg-brand/30 group-hover:bg-brand/50'}`}
                      style={{ height }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-tooltip text-white text-xs py-1 px-2 rounded font-medium transition-opacity">
                        {val}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-text-muted font-medium">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Activity Timeline */}
        <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-text-primary">Recent Activity</h3>
            <span className="text-xs text-text-muted hover:text-brand cursor-pointer transition-colors">View all</span>
          </div>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-default before:to-transparent">
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-card bg-brand text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <Users size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border-default bg-surface-page shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-text-primary">New User Registration</span>
                  <span className="text-xs text-brand font-medium">Just now</span>
                </div>
                <p className="text-sm text-text-muted">A new user account was created in the system.</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-card bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <Scan size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border-default bg-surface-page shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-text-primary">System Settings Updated</span>
                  <span className="text-xs text-text-muted">10 mins ago</span>
                </div>
                <p className="text-sm text-text-muted">Admin updated platform configuration.</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-card bg-warning-text text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <Activity size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border-default bg-surface-page shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-text-primary">Model Confidence Drop</span>
                  <span className="text-xs text-text-muted">2 hours ago</span>
                </div>
                <p className="text-sm text-text-muted">AI vision model confidence fell below 20% on recent scans.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
