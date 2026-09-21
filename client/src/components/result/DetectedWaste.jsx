import Badge from "../ui/Badge";

function DetectedWaste({ wasteName, material }) {
  if (!wasteName) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
        Detected Waste
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
        <p className="text-[26px] lg:text-[28px] font-bold text-text-primary leading-tight">
          {wasteName}
        </p>
        {material && (
          <div className="self-start sm:self-auto">
            <Badge variant="neutral" className="bg-[#E5ECE8] text-text-primary font-medium px-3 py-1 text-sm border-none">
              {material}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetectedWaste;
