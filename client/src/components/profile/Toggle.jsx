function Toggle({
  checked,
  onChange,
  label,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`
        relative
        h-6
        w-11
        shrink-0
        rounded-full
        transition
        ${
          checked
            ? "bg-brand"
            : "bg-[#CBD7D0]"
        }
      `}
    >
      <span
        className={`
          absolute
          top-1
          h-4
          w-4
          rounded-full
          bg-surface-card
          shadow-sm
          transition
          ${
            checked
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  );
}

export default Toggle;
