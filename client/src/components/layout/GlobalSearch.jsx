import { useState, useEffect, useRef } from "react";
import { Search, Loader2, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getScans } from "../../services/scanService";
import useDebounce from "../../hooks/useDebounce";

const MATERIALS = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Organic",
  "E-Waste",
  "General Waste",
  "Other",
];

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [scanResults, setScanResults] = useState([]);
  const [materialResults, setMaterialResults] = useState([]);
  
  const debouncedQuery = useDebounce(query, 300);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch results when query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setScanResults([]);
      setMaterialResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        // Find matching materials locally
        const q = debouncedQuery.toLowerCase();
        const mats = MATERIALS.filter(m => m.toLowerCase().includes(q));
        setMaterialResults(mats);

        // Fetch matching scans from backend
        const data = await getScans({ search: debouncedQuery, limit: 3 });
        setScanResults(data.scans || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/history?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleMaterialClick = (material) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/history?category=${encodeURIComponent(material)}`);
  };

  const handleScanClick = (scanId) => {
    setIsOpen(false);
    setQuery("");
    // Right now we don't have a dedicated scan detail page, so we go to history
    // If we had a detail page it would be /scan/${scanId}
    navigate(`/history`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <form 
        onSubmit={handleSubmit}
        className="hidden lg:flex items-center bg-element-bg border border-element-border rounded-full px-4 py-2 w-64 shadow-sm text-text-primary transition-all focus-within:bg-element-border/30 focus-within:ring-4 focus-within:ring-brand/10 focus-within:border-brand/40 hover:bg-element-border/50 cursor-text z-50 relative"
      >
        <Search size={16} className="mr-2 text-text-muted shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="Search scans, materials..."
          className="bg-transparent border-none outline-none w-full text-sm placeholder:text-text-muted text-text-primary"
          autoComplete="off"
        />
      </form>

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full right-0 mt-3 w-[380px] bg-surface-card border border-border-default rounded-2xl shadow-2xl overflow-hidden z-[100] flex flex-col max-h-[450px] animate-in fade-in slide-in-from-top-2 duration-200">
          
          {loading ? (
            <div className="flex items-center justify-center p-6 text-text-muted">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <div className="overflow-y-auto p-2 scrollbar-hide">
              
              {/* Materials Section */}
              {materialResults.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-2">
                    Materials
                  </h4>
                  {materialResults.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => handleMaterialClick(mat)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface-page transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-element-bg flex items-center justify-center border border-element-border">
                          <FileText size={16} className="text-brand" />
                        </div>
                        <span className="font-medium text-text-primary text-sm">{mat} Guide</span>
                      </div>
                      <ChevronRight size={16} className="text-text-muted" />
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Scans Section */}
              {scanResults.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-2">
                    Scans
                  </h4>
                  {scanResults.map((scan) => (
                    <button
                      key={scan._id}
                      onClick={() => handleScanClick(scan._id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface-page transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border-default">
                          <img src={scan.imageUrl} alt={scan.wasteName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-text-primary text-sm truncate">{scan.wasteName}</span>
                          <span className="text-xs text-text-muted capitalize">{scan.category}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-text-muted shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && materialResults.length === 0 && scanResults.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-text-muted text-sm">No results found for "{query}"</p>
                </div>
              )}

              {/* Global search fallback */}
              <button 
                type="button"
                onClick={handleSubmit}
                className="w-full mt-2 p-3 text-sm text-brand font-medium hover:bg-surface-page transition-colors border-t border-border-default rounded-b-xl"
              >
                See all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
