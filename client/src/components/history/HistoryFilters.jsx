import { Search, ChevronDown } from "lucide-react";

const CATEGORY_OPTIONS = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Organic",
  "E-Waste",
  "General Waste",
  "Other",
];

const STATUS_OPTIONS = [
  { label: "Recyclable", value: "recyclable" },
  { label: "General Waste", value: "general-waste" },
  { label: "Compost", value: "compost" },
  { label: "Special Disposal", value: "special-disposal" },
  { label: "Reuse", value: "reuse" },
  { label: "Check Guidance", value: "unknown" },
];

function HistoryFilters({ filters, onFilterChange }) {
  const { search, category, status, startDate, endDate, sort } = filters;

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 mb-6 bg-surface-card p-4 rounded-2xl border border-border-default shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
        <input
          type="search"
          id="history-search"
          placeholder="Search scans by name, category, or material..."
          value={search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface-page border border-border-default rounded-xl text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="relative col-span-1">
          <select
            value={category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full appearance-none bg-surface-page border border-border-default text-text-primary font-medium text-sm rounded-xl pl-3 pr-8 py-2.5 outline-none focus:ring-2 focus:ring-brand cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>

        <div className="relative col-span-1">
          <select
            value={status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full appearance-none bg-surface-page border border-border-default text-text-primary font-medium text-sm rounded-xl pl-3 pr-8 py-2.5 outline-none focus:ring-2 focus:ring-brand cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>

        <div className="col-span-1">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full bg-surface-page border border-border-default text-text-primary font-medium text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand cursor-pointer"
            title="Start Date"
          />
        </div>

        <div className="col-span-1">
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full bg-surface-page border border-border-default text-text-primary font-medium text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand cursor-pointer"
            title="End Date"
          />
        </div>

        <div className="relative col-span-2 md:col-span-1">
          <select
            value={sort}
            onChange={(e) => handleChange("sort", e.target.value)}
            className="w-full appearance-none bg-surface-page border border-border-default text-text-primary font-medium text-sm rounded-xl pl-3 pr-8 py-2.5 outline-none focus:ring-2 focus:ring-brand cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default HistoryFilters;
