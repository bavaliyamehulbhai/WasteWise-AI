function LanguageSelector({
  value,
  onChange,
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      aria-label="Language"
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
      <option value="English">
        English
      </option>

      <option value="Hindi">
        Hindi
      </option>

      <option value="Gujarati">
        Gujarati
      </option>
    </select>
  );
}

export default LanguageSelector;
