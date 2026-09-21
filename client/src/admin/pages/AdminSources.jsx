import { useState, useEffect } from "react";
import { Plus, CheckCircle, ExternalLink } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AdminSources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    url: "",
  });

  const fetchSources = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/knowledge/sources");
      setSources(data.sources);
    } catch (error) {
      toast.error("Failed to load sources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/admin/knowledge/sources/${id}/status`, { status: newStatus });
      setSources(sources.map(s => s._id === id ? data.source : s));
      toast.success(`Source marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/knowledge/sources", formData);
      setSources([data.source, ...sources]);
      setShowAddForm(false);
      setFormData({ name: "", organization: "", url: "" });
      toast.success("Source added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add source");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Knowledge Sources</h1>
          <p className="text-sm text-text-muted mt-1">Manage authoritative sources for disposal rules.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg font-semibold hover:bg-brand-hover transition-colors"
        >
          <Plus size={18} />
          Add Source
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-surface-card border border-border-default rounded-xl p-6 shadow-sm animate-in slide-in-from-top-2">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Add Knowledge Source</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Reference Name *</label>
              <input 
                required
                type="text" 
                placeholder="e.g. San Francisco Recology Guide" 
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Organization</label>
              <input 
                type="text" 
                placeholder="e.g. Dept of Environment" 
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
                value={formData.organization}
                onChange={e => setFormData({...formData, organization: e.target.value})}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-muted mb-1">URL Reference</label>
            <input 
              type="url" 
              placeholder="https://..." 
              className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 font-medium text-text-muted hover:bg-black/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors"
            >
              Add Source
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full p-8 text-center text-text-muted">Loading sources...</div>
        ) : sources.length === 0 ? (
          <div className="col-span-full p-8 text-center text-text-muted bg-surface-card rounded-xl border border-border-default">
            No sources found.
          </div>
        ) : (
          sources.map(source => (
            <div key={source._id} className="bg-surface-card border border-border-default rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    source.status === 'verified' ? 'bg-success-bg text-success-text' : 'bg-black/5 text-text-muted'
                  }`}>
                    {source.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1">{source.name}</h3>
                {source.organization && <p className="text-sm text-text-muted mb-3">{source.organization}</p>}
                
                {source.url && (
                  <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
                    View Source <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border-default flex justify-end">
                {source.status === "draft" && (
                  <button 
                    onClick={() => handleStatusChange(source._id, "verified")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-success-text bg-success-bg hover:opacity-80 transition-opacity"
                  >
                    <CheckCircle size={16} /> Verify Source
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
