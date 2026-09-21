import {
  ChevronRight,
} from "lucide-react";

function SettingsRow({
  icon: Icon,
  title,
  description,
  value,
  onClick,
  children,
}) {
  return (
    <div
      className="
        flex
        min-h-[64px]
        items-center
        gap-3
        border-b
        border-[#EEF3F0]
        px-4
        py-3
        last:border-b-0
        lg:px-5
      "
    >

      {/* Icon */}
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-bg">
          <Icon
            size={17}
            className="text-brand"
          />
        </div>
      )}

      {/* Content */}
      <div
        className={`
          min-w-0
          flex-1
          ${onClick ? "cursor-pointer" : ""}
        `}
        onClick={onClick}
      >
        <p className="text-sm font-medium text-text-primary">
          {title}
        </p>

        {description && (
          <p className="mt-1 text-[11px] leading-4 text-text-muted">
            {description}
          </p>
        )}
      </div>

      {/* Value / Control */}
      {children ? (
        children
      ) : value ? (
        <span className="shrink-0 text-xs font-medium text-text-muted">
          {value}
        </span>
      ) : onClick ? (
        <ChevronRight
          size={17}
          className="shrink-0 text-[#94A39B]"
        />
      ) : null}

    </div>
  );
}

export default SettingsRow;
