export function normalizeWasteCategory(
  category
) {
  const value =
    category?.toLowerCase()?.trim();

  const aliases = {
    plastics: "plastic",
    "plastic waste": "plastic",

    papers: "paper",
    "paper waste": "paper",

    organics: "organic",
    "organic waste": "organic",

    "electronic waste": "e-waste",
    electronics: "e-waste",

    "general waste": "general",
  };

  return (
    aliases[value] ||
    value ||
    "unknown"
  );
}
