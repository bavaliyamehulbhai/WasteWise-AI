import { useState, useEffect } from "react";
import { BarChart3, ScanLine, BookOpen, Target, ArrowUpRight, Award } from "lucide-react";
import api from "../services/api";

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/reports/monthly");
        if (res.data?.success) {
          setReport(res.data.data);
        } else {
          setErrorMsg(JSON.stringify(res.data));
        }
      } catch (error) {
        console.error("Failed to load report", error);
        setErrorMsg(error.response?.data?.message || error.message || JSON.stringify(error));
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse pb-20">
        <div className="h-10 w-48 bg-surface-card rounded-lg"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-surface-card rounded-2xl border border-border-default"></div>)}
        </div>
        <div className="h-64 bg-surface-card rounded-2xl border border-border-default"></div>
      </div>
    );
  }

  if (errorMsg) {
    return <div className="p-8 text-center text-red-500 font-mono text-xs">Error: {errorMsg}</div>;
  }

  if (!report) {
    return <div className="p-8 text-center text-text-muted">Unable to load report.</div>;
  }

  const monthName = new Date(report.period.year, report.period.month).toLocaleString('default', { month: 'long' });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Monthly Report</h1>
        <p className="text-text-muted mt-2 font-medium">Your sustainability impact for {monthName} {report.period.year}.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <ScanLine className="text-brand mb-4" size={32} />
          <h3 className="text-3xl font-bold text-text-primary mb-1">{report.scanning.total}</h3>
          <p className="text-sm font-semibold text-text-muted">Total Scans</p>
          <div className="absolute top-4 right-4 text-brand bg-brand/10 px-2 py-1 rounded-md text-xs font-bold flex items-center">
            <ArrowUpRight size={14} className="mr-1" /> {Math.round(report.scanning.accuracy)}% Recyclable
          </div>
        </div>

        <div className="bg-surface-card border border-border-default p-6 rounded-2xl hover:-translate-y-1 transition-transform">
          <BookOpen className="text-blue-500 mb-4" size={32} />
          <h3 className="text-3xl font-bold text-text-primary mb-1">{report.learning.modulesCompleted}</h3>
          <p className="text-sm font-semibold text-text-muted">Modules Completed</p>
        </div>

        <div className="bg-surface-card border border-border-default p-6 rounded-2xl hover:-translate-y-1 transition-transform">
          <Target className="text-purple-500 mb-4" size={32} />
          <h3 className="text-3xl font-bold text-text-primary mb-1">{report.goals.completed}</h3>
          <p className="text-sm font-semibold text-text-muted">Goals Achieved</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-border-default p-6 rounded-2xl">
          <h3 className="font-bold text-text-primary text-xl mb-6 flex items-center gap-2">
            <BarChart3 className="text-brand" /> Top Scanned Categories
          </h3>
          {report.scanning.topCategories.length > 0 ? (
            <div className="space-y-4">
              {report.scanning.topCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-medium text-text-secondary capitalize">{cat.category}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-surface-page rounded-full overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${(cat.count / report.scanning.total) * 100}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-text-primary w-8 text-right">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No scan data for this month.</p>
          )}
        </div>

        <div className="bg-surface-card border border-border-default p-6 rounded-2xl">
          <h3 className="font-bold text-text-primary text-xl mb-6 flex items-center gap-2">
            <Award className="text-yellow-500" /> AI Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-brand/5 border border-brand/20 rounded-xl">
              <p className="text-sm font-semibold text-brand mb-1">Scanning Trend</p>
              <p className="text-text-secondary capitalize">{report.insights.trend} activity compared to last month.</p>
            </div>
            {report.insights.focusAreas.length > 0 && (
              <div className="p-4 bg-surface-page border border-border-default rounded-xl">
                <p className="text-sm font-semibold text-text-muted mb-2">Recommended Learning Areas</p>
                <div className="flex flex-wrap gap-2">
                  {report.insights.focusAreas.map((area, i) => (
                    <span key={i} className="px-3 py-1 bg-surface-card border border-border-default rounded-lg text-xs font-bold text-text-primary capitalize">
                      {area.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
