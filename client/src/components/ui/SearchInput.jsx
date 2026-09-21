import {
  Search,
} from "lucide-react";

function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative">

      <Search
        size={17}
        className="
          pointer-events-none
          absolute
          left-3.5
          top-1/2
          -translate-y-1/2
          text-[#94A39B]
        "
      />

      <input
        type="search"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="
          h-11
          w-full
          rounded-[12px]
          border
          border-border-default
          bg-surface-card
          pl-10
          pr-4
          text-sm
          text-text-primary
          outline-none
          placeholder:text-[#94A39B]
          focus:border-brand
          focus:ring-2
          focus:ring-[#E8F4EC]
        "
      />

    </div>
  );
}

export default SearchInput;
