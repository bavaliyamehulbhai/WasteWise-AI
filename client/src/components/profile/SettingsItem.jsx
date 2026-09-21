import { ChevronRight } from "lucide-react";

function SettingsItem({ icon: Icon, title, value, onClick, control, isDestructive }) {
  const content = (
    <>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-surface-page flex items-center justify-center text-text-muted shrink-0">
            <Icon size={20} className={isDestructive ? "text-error-text" : ""} />
          </div>
        )}
        <div className="flex flex-col">
          <span className={`text-base font-semibold ${isDestructive ? "text-error-text" : "text-text-primary"}`}>
            {title}
          </span>
          {value && (
            <span className="text-sm text-text-muted">
              {value}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {control ? (
          control
        ) : onClick ? (
          <ChevronRight size={20} className="text-[#A3B3AA]" />
        ) : null}
      </div>
    </>
  );

  const containerClasses = `flex items-center justify-between p-4 w-full text-left transition-colors border-b border-[#F7FAF8] last:border-b-0 ${
    onClick ? "hover:bg-surface-page cursor-pointer" : ""
  }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={containerClasses}>
        {content}
      </button>
    );
  }

  return (
    <div className={containerClasses}>
      {content}
    </div>
  );
}

export default SettingsItem;
