import { useState, useEffect } from "react";
import { FileText, Search, Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/logs?page=${page}&limit=15`);
      if (res.data?.success) {
        setLogs(res.data.logs);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes("CREATE")) return "text-green-500 bg-green-500/10 border-green-500/20";
    if (action.includes("UPDATE")) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    if (action.includes("DELETE")) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (action.includes("REVIEW")) return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    return "text-brand bg-brand/10 border-brand/20";
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.userId?.name || "System").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">System Audit Logs</h1>
          <p className="text-text-muted mt-2">Track and monitor all administrative actions across the platform.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-card border border-border-default text-text-primary rounded-lg hover:bg-surface-page transition-colors">
          <Filter size={20} />
          Filter Logs
        </button>
      </div>

      <div className="bg-surface-card border border-border-default rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-default flex gap-4 bg-surface-card">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              placeholder="Search logs by action, user, or resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-page border border-border-default text-text-primary pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-brand">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted">
              <FileText size={48} className="mb-4 opacity-50" />
              <p>No audit logs found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-default bg-surface-page/50">
                  <th className="p-4 font-medium text-text-secondary text-sm">Timestamp</th>
                  <th className="p-4 font-medium text-text-secondary text-sm">Admin / User</th>
                  <th className="p-4 font-medium text-text-secondary text-sm">Action</th>
                  <th className="p-4 font-medium text-text-secondary text-sm">Resource Type</th>
                  <th className="p-4 font-medium text-text-secondary text-sm">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="border-b border-border-default hover:bg-surface-page/30 transition-colors">
                    <td className="p-4 text-sm text-text-secondary font-mono">
                      {new Date(log.createdAt).toLocaleString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
                      })}
                    </td>
                    <td className="p-4 text-sm text-text-primary font-medium">
                      {log.userId?.name || "System"}
                      <div className="text-xs text-text-muted font-normal">{log.userId?.email || "Automated"}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {log.resourceType}
                      <div className="text-xs text-text-muted font-mono truncate max-w-[150px]">
                        {log.resourceId}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-muted font-mono">
                      {log.ipAddress || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-border-default flex items-center justify-between bg-surface-card">
            <span className="text-sm text-text-muted">
              Page <span className="font-medium text-text-primary">{page}</span> of <span className="font-medium text-text-primary">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border-default hover:bg-surface-page disabled:opacity-50 text-text-primary transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-border-default hover:bg-surface-page disabled:opacity-50 text-text-primary transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
