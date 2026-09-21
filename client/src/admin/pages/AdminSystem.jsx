import { useState, useEffect } from "react";
import { Activity, Database, Server, Cpu, Clock, HardDrive, RefreshCw } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AdminSystem() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const { data } = await api.get("/admin/system/health");
      if (data.success) {
        setHealth(data.health);
      }
    } catch (error) {
      toast.error("Failed to load system health metrics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchHealth(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">System Health</h1>
          <p className="text-sm text-text-muted mt-1">Real-time observability metrics.</p>
        </div>
        <button 
          onClick={() => fetchHealth(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-surface-card border border-border-default text-text-primary rounded-lg font-semibold hover:bg-surface-page transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Status */}
        <div className="bg-surface-card border border-border-default rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Server size={20} className={health.api === 'healthy' ? 'text-success-text' : 'text-error-text'} />
            <h3 className="text-sm font-medium text-text-muted">API Node</h3>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
            health.api === 'healthy' ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error-text'
          }`}>
            {health.api.toUpperCase()}
          </span>
        </div>

        {/* Database */}
        <div className="bg-surface-card border border-border-default rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Database size={20} className={health.database === 'connected' ? 'text-success-text' : 'text-error-text'} />
            <h3 className="text-sm font-medium text-text-muted">MongoDB</h3>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
            health.database === 'connected' ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error-text'
          }`}>
            {health.database.toUpperCase()}
          </span>
        </div>

        {/* AI Provider */}
        <div className="bg-surface-card border border-border-default rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={20} className={health.aiProvider === 'healthy' ? 'text-success-text' : 'text-warning-text'} />
            <h3 className="text-sm font-medium text-text-muted">Groq AI Engine</h3>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
            health.aiProvider === 'healthy' ? 'bg-success-bg text-success-text' : 'bg-warning-bg text-warning-text'
          }`}>
            {health.aiProvider.toUpperCase()}
          </span>
        </div>

        {/* Uptime */}
        <div className="bg-surface-card border border-border-default rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-brand" />
            <h3 className="text-sm font-medium text-text-muted">Uptime</h3>
          </div>
          <span className="text-lg font-semibold text-text-primary">
            {health.uptime}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Memory Usage */}
        <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Cpu size={20} className="text-text-muted" />
            <h3 className="text-lg font-semibold text-text-primary">Node Process Memory</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">RSS (Resident Set Size)</span>
                <span className="font-semibold text-text-primary">{health.processMemory.rss} MB</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-2">
                <div className="bg-brand h-2 rounded-full" style={{ width: `${Math.min(100, (health.processMemory.rss / 1024) * 100)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">V8 Heap Used</span>
                <span className="font-semibold text-text-primary">{health.processMemory.heapUsed} MB / {health.processMemory.heapTotal} MB</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-2">
                <div className="bg-warning-text h-2 rounded-full" style={{ width: `${(health.processMemory.heapUsed / health.processMemory.heapTotal) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Memory */}
        <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <HardDrive size={20} className="text-text-muted" />
            <h3 className="text-lg font-semibold text-text-primary">Host System Memory</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Used Memory</span>
                <span className="font-semibold text-text-primary">{health.systemMemory.used} MB / {health.systemMemory.total} MB</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-2">
                <div className="bg-brand h-2 rounded-full" style={{ width: `${(health.systemMemory.used / health.systemMemory.total) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Free Memory</span>
                <span className="font-semibold text-success-text">{health.systemMemory.free} MB</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border-default">
             <p className="text-xs text-text-muted flex justify-between">
               <span>Last updated:</span>
               <span>{new Date(health.timestamp).toLocaleTimeString()}</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
