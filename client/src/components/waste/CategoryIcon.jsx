import { wasteCategories } from "../../config/wasteCategories";

function CategoryIcon({
  category,
  size = "md",
}) {
  const config =
    wasteCategories[category] ||
    wasteCategories.unknown;

  const Icon = config.icon;

  const sizes = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 16,
    md: 19,
    lg: 22,
  };

  return (
    <div
      className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-xl
        ${sizes[size]}
      `}
      style={{
        backgroundColor: config.bg,
      }}
    >
      <Icon
        size={iconSizes[size]}
        style={{
          color: config.iconColor,
        }}
      />
    </div>
  );
}

export default CategoryIcon;
