function SettingsSection({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider px-2">
        {title}
      </h3>
      <div className="flex flex-col bg-surface-card border border-border-default rounded-[24px] overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
}

export default SettingsSection;
