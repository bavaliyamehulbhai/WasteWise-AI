function SustainabilityInsight({ recyclableCount }) {
  if (recyclableCount === 0) return null;

  return (
    <div className="bg-surface-page border border-border-default rounded-xl p-5 flex items-start gap-4">
      <div className="text-xl">🌱</div>
      <div>
        <h4 className="text-sm font-semibold text-text-primary">Your Progress</h4>
        <p className="text-sm text-text-muted mt-1 leading-relaxed">
          {recyclableCount} recyclable items identified through WasteWise. Keep going!
        </p>
      </div>
    </div>
  );
}

export default SustainabilityInsight;
