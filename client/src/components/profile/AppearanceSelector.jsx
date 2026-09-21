function AppearanceSelector({
  value,
  onChange,
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      aria-label="Appearance"
      className="
        rounded-[10px]
        border
        border-border-default
        bg-surface-page
        px-3
        py-2
        text-xs
        font-medium
        text-success-text
        outline-none
      "
    >
      <option value="System">
        System
      </option>

      <option value="Light">
        Light
      </option>

      <option value="Dark">
        Dark
      </option>
    </select>
  );
}

export default AppearanceSelector;
