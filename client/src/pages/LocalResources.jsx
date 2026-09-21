import { useState, useEffect } from "react";
import { MapPin, Phone, Globe, Clock, Filter, AlertTriangle } from "lucide-react";
import api from "../services/api";
import EmptyState from "../components/common/EmptyState";

const TYPE_CONFIG = {
  "e-waste": { label: "E-Waste", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  "recycling_center": { label: "Recycling Center", color: "text-brand", bg: "bg-brand/10", border: "border-brand/20" },
  "compost": { label: "Compost Hub", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
  "hazardous": { label: "Hazardous Materials", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  "general": { label: "General", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
};

export default function LocalResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchResources();
  }, [filter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/resources?type=${filter}`);
      if (res.data?.success) {
        setResources(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load resources", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Local Resources</h1>
          <p className="text-text-muted mt-2 font-medium">Find recycling and disposal facilities near you.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-2 text-text-muted mr-2 shrink-0">
          <Filter size={16} />
          <span className="text-sm font-semibold">Filter:</span>
        </div>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold shrink-0 transition-all ${filter === "all" ? "bg-brand text-white shadow-md" : "bg-surface-card text-text-secondary border border-border-default hover:border-brand/50"}`}
        >
          All Facilities
        </button>
        {Object.entries(TYPE_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold shrink-0 transition-all ${filter === key ? "bg-brand text-white shadow-md" : "bg-surface-card text-text-secondary border border-border-default hover:border-brand/50"}`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-surface-card rounded-2xl animate-pulse"></div>)}
        </div>
      ) : resources.length === 0 ? (
        <div className="mt-4">
          <EmptyState 
            icon="search"
            title="No Facilities Found"
            description="Try adjusting your filters or check back later."
            actionLabel={filter !== "all" ? "Clear Filters" : undefined}
            onAction={() => setFilter("all")}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {resources.map(resource => {
            const config = TYPE_CONFIG[resource.type] || TYPE_CONFIG["general"];
            
            return (
              <div key={resource._id} className="bg-surface-card border border-border-default rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-2 h-full ${config.bg}`}></div>
                
                <div className="pr-4">
                  <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 ${config.bg} ${config.color} border ${config.border}`}>
                    {config.label}
                  </div>
                  
                  <h3 className="text-xl font-bold text-text-primary mb-3">{resource.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-text-secondary text-sm">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-text-muted" />
                      <span>{resource.address}</span>
                    </div>
                    
                    {resource.operatingHours && (
                      <div className="flex items-start gap-2 text-text-secondary text-sm">
                        <Clock size={16} className="mt-0.5 shrink-0 text-text-muted" />
                        <span>{resource.operatingHours}</span>
                      </div>
                    )}
                    
                    {resource.contactInfo?.phone && (
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Phone size={16} className="shrink-0 text-text-muted" />
                        <a href={`tel:${resource.contactInfo.phone}`} className="hover:text-brand">{resource.contactInfo.phone}</a>
                      </div>
                    )}
                    
                    {resource.contactInfo?.website && (
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Globe size={16} className="shrink-0 text-text-muted" />
                        <a href={resource.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand truncate">
                          {resource.contactInfo.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {resource.notes && (
                    <div className="mt-4 pt-4 border-t border-border-default">
                      <div className="flex items-start gap-2 text-sm text-text-muted bg-surface-page p-3 rounded-xl">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <p>{resource.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
