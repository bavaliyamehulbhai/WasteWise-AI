function ToggleSetting({ isEnabled, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      onClick={onToggle}
      className={`
        relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
        ${isEnabled ? "bg-brand" : "bg-[#D8E6DD]"}
      `}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute left-1 h-5 w-5 transform rounded-full bg-surface-card shadow-sm ring-0 transition duration-200 ease-in-out
          ${isEnabled ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}

export default ToggleSetting;
