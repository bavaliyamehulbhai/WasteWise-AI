import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import HistoryHeader from "../components/history/HistoryHeader";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryTable from "../components/history/HistoryTable";
import HistoryMobileCard from "../components/history/HistoryMobileCard";
import Pagination from "../components/history/Pagination";
import DeleteScanDialog from "../components/history/DeleteScanDialog";
import HistoryEmptyState from "../components/history/HistoryEmptyState";
import HistorySkeleton from "../components/history/HistorySkeleton";

import { getScans, deleteScan } from "../services/scanService";
import useDebounce from "../hooks/useDebounce";

function ScanHistory() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    sort: searchParams.get("sort") || "newest",
  });

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  
  const [scans, setScans] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    scan: null,
    isDeleting: false,
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  // Sync state to URL and load data
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.category) params.category = filters.category;
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.sort !== "newest") params.sort = filters.sort;
    if (page > 1) params.page = page;

    setSearchParams(params, { replace: true });
    loadScans();
  }, [
    debouncedSearch,
    filters.category,
    filters.status,
    filters.startDate,
    filters.endDate,
    filters.sort,
    page,
  ]);

  // Sync external URL changes (e.g., from DesktopHeader search bar) to local state
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== debouncedSearch && urlSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: urlSearch }));
    }
  }, [searchParams]);

  const loadScans = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await getScans({
        page,
        limit: 10,
        search: debouncedSearch,
        category: filters.category,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sort: filters.sort,
      });

      setScans(data.scans);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      setError("Unable to load scan history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "",
      status: "",
      startDate: "",
      endDate: "",
      sort: "newest",
    });
    setPage(1);
  };

  const handleDeleteRequest = (scan) => {
    setDeleteDialog({
      isOpen: true,
      scan,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    const scanId = deleteDialog.scan._id;
    try {
      setDeleteDialog(prev => ({ ...prev, isDeleting: true }));
      await deleteScan(scanId);
      
      toast.success("Scan deleted successfully");
      
      setDeleteDialog({ isOpen: false, scan: null, isDeleting: false });
      
      // If we deleted the last item on the current page, and it's not the first page, go back a page
      if (scans.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadScans();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete scan");
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const hasActiveFilters = 
    debouncedSearch !== "" || 
    filters.category !== "" || 
    filters.status !== "" || 
    filters.startDate !== "" || 
    filters.endDate !== "";

  return (
    <>
      <div className="w-full max-w-[1200px] mx-auto animate-in fade-in zoom-in-95 duration-300">
        
        <HistoryHeader 
          onClearFilters={handleClearFilters} 
          showClear={hasActiveFilters} 
        />

        <HistoryFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        {error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-card rounded-2xl border border-error-text mt-6">
            <h3 className="text-xl font-bold text-error-text mb-2">Error loading history</h3>
            <p className="text-text-muted mb-6">{error}</p>
            <button 
              onClick={loadScans}
              className="px-6 py-2.5 bg-brand text-white font-semibold rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="mt-6">
            <HistorySkeleton />
          </div>
        ) : scans.length === 0 ? (
          <div className="mt-6">
            <HistoryEmptyState 
              hasFilters={hasActiveFilters} 
              onClearFilters={handleClearFilters} 
            />
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            <HistoryTable 
              scans={scans} 
              onDeleteRequest={handleDeleteRequest} 
            />
            
            <div className="flex flex-col gap-4 lg:hidden">
              {scans.map(scan => (
                <HistoryMobileCard key={scan._id} scan={scan} />
              ))}
            </div>

            <Pagination 
              pagination={pagination} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </div>

      <DeleteScanDialog
        isOpen={deleteDialog.isOpen}
        scanName={deleteDialog.scan?.wasteName}
        isDeleting={deleteDialog.isDeleting}
        onClose={() => setDeleteDialog({ isOpen: false, scan: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

export default ScanHistory;
