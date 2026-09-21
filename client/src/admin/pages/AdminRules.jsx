import { useState, useEffect } from "react";
import { Plus, Search, CheckCircle, Clock } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AdminRules() {
  const [rules, setRules] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: "Plastic",
    material: "",
    country: "",
    state: "",
    city: "",
    disposalMethod: "",
    sourceId: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rulesRes, sourcesRes] = await Promise.all([
        api.get("/admin/knowledge/rules"),
        api.get("/admin/knowledge/sources")
      ]);
      setRules(rulesRes.data.rules);
      
      // Only allow linking to verified sources
      const verifiedSources = sourcesRes.data.sources.filter(s => s.status === "verified");
      setSources(verifiedSources);
    } catch (error) {
      toast.error("Failed to load knowledge bases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/admin/knowledge/rules/${id}/status`, { status: newStatus });
      setRules(rules.map(r => r._id === id ? data.rule : r));
      toast.success(`Rule marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        category: formData.category,
        material: formData.material,
        region: {
          country: formData.country,
          state: formData.state,
          city: formData.city
        },
        disposalMethod: formData.disposalMethod,
        sourceId: formData.sourceId,
        accepted: true,
      };

      const { data } = await api.post("/admin/knowledge/rules", payload);
      setRules([data.rule, ...rules]);
      setShowAddForm(false);
      toast.success("Disposal rule created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create rule");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Disposal Rules</h1>
          <p className="text-sm text-text-muted mt-1">Manage authoritative overrides for AI classifications.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg font-semibold hover:bg-brand-hover transition-colors"
        >
          <Plus size={18} />
          Add Rule
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-surface-card border border-border-default rounded-xl p-6 shadow-sm animate-in slide-in-from-top-2">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Create New Rule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Category *</label>
              <select 
                required
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {["Plastic", "Paper", "Glass", "Metal", "Organic", "E-Waste", "General Waste"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Specific Material</label>
              <input 
                type="text" 
                placeholder="e.g. PET, Cardboard" 
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
                value={formData.material}
                onChange={e => setFormData({...formData, material: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Country</label>
              <input 
                type="text" 
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
                value={formData.country}
                onChange={e => setFormData({...formData, country: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">State</label>
              <input 
                type="text" 
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">City</label>
              <input 
                type="text" 
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-muted mb-1">Disposal Method (Instructions) *</label>
            <textarea 
              required
              rows={3}
              placeholder="e.g. Rinse out residue and place in the blue recycling bin..."
              className="w-full p-3 rounded-lg border border-border-default bg-surface-background"
              value={formData.disposalMethod}
              onChange={e => setFormData({...formData, disposalMethod: e.target.value})}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-muted mb-1">Verified Source *</label>
            <select 
              required
              className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-background"
              value={formData.sourceId}
              onChange={e => setFormData({...formData, sourceId: e.target.value})}
            >
              <option value="">Select a verified source...</option>
              {sources.map(s => (
                <option key={s._id} value={s._id}>{s.name} - {s.organization}</option>
              ))}
            </select>
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
              Save Draft
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading rules...</div>
        ) : rules.length === 0 ? (
          <div className="p-8 text-center text-text-muted bg-surface-card rounded-xl border border-border-default">
            No disposal rules found.
          </div>
        ) : (
          rules.map(rule => (
            <div key={rule._id} className="bg-surface-card border border-border-default rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    rule.status === 'verified' ? 'bg-success-bg text-success-text' : 
                    rule.status === 'draft' ? 'bg-black/5 text-text-muted' : 
                    'bg-warning-bg text-warning-text'
                  }`}>
                    {rule.status.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-text-primary">{rule.category} {rule.material && `> ${rule.material}`}</span>
                  <span className="text-xs text-text-muted ml-auto">
                    {rule.region.city ? `${rule.region.city}, ` : ""}{rule.region.country || "Global"}
                  </span>
                </div>
                
                <p className="text-sm text-text-muted mb-4">{rule.disposalMethod}</p>
                
                <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-background p-2 rounded border border-border-default w-fit">
                  <span>Source:</span>
                  <span className="font-medium text-text-primary">{rule.sourceId?.name}</span>
                </div>
              </div>

              <div className="flex items-start md:items-end flex-col gap-2 border-t md:border-t-0 md:border-l border-border-default pt-4 md:pt-0 md:pl-6">
                {rule.status === "draft" && (
                  <button 
                    onClick={() => handleStatusChange(rule._id, "verified")}
                    className="flex items-center gap-2 px-3 py-2 w-full md:w-auto justify-center rounded-lg text-sm font-semibold text-success-text bg-success-bg hover:opacity-80 transition-opacity"
                  >
                    <CheckCircle size={16} /> Verify & Publish
                  </button>
                )}
                {rule.status === "verified" && (
                  <button 
                    onClick={() => handleStatusChange(rule._id, "draft")}
                    className="flex items-center gap-2 px-3 py-2 w-full md:w-auto justify-center rounded-lg text-sm font-semibold text-text-muted bg-black/5 hover:bg-black/10 transition-colors"
                  >
                    <Clock size={16} /> Unpublish to Draft
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
