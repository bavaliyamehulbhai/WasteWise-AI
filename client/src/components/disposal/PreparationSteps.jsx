function PreparationSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 mt-4">
      <h3 className="text-lg font-semibold text-text-primary">
        Before disposal
      </h3>
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4 p-4 rounded-xl border border-border-default bg-surface-card shadow-sm items-start">
            <div className="font-bold text-sm text-brand mt-0.5 shrink-0">
              {String(index + 1).padStart(2, '0')}
            </div>
            <p className="text-sm md:text-base text-text-primary font-medium leading-relaxed">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreparationSteps;
