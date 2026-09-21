import { Search, FolderOpen, Bell, Trophy, FileQuestion } from "lucide-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const iconMap = {
  search: Search,
  folder: FolderOpen,
  notification: Bell,
  trophy: Trophy,
  default: FileQuestion
};

export default function EmptyState({ 
  icon = "folder", 
  title = "No data found", 
  description = "There is nothing to display here right now.", 
  actionLabel, 
  actionUrl,
  onAction 
}) {
  const navigate = useNavigate();
  const IconComponent = iconMap[icon] || iconMap.default;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionUrl) {
      navigate(actionUrl);
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-surface-card border border-border-default border-dashed rounded-2xl text-center">
      <div className="w-16 h-16 bg-surface-page rounded-2xl flex items-center justify-center mb-5 border border-border-default/50 shadow-sm">
        <IconComponent size={28} className="text-brand opacity-80" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      
      {(actionLabel) && (
        <Button onClick={handleAction} variant="secondary" className="px-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
