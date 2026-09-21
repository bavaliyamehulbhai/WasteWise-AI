import { wasteCategories } from "../../config/wasteCategories";

function CategoryBadge({
  category,
}) {
  const config =
    wasteCategories[category] ||
    wasteCategories.unknown;

  const Icon = config.icon;

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-semibold
      "
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

export default CategoryBadge;
