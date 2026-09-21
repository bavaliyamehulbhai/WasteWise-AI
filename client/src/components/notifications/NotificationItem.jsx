import { ScanLine, Trophy, Target, User, Info } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

const NOTIFICATION_ICONS = {
  scan_completed: ScanLine,
  badge_unlocked: Trophy,
  challenge_completed: Target,
  profile_updated: User,
  system: Info,
};

function NotificationItem({ notification, onClick, isMenuOpen, onToggleMenu, onDelete }) {
  const Icon = NOTIFICATION_ICONS[notification.type] || Info;

  return (
    <div 
      className={`relative flex items-start gap-4 p-4 rounded-xl transition-colors ${
        notification.read ? "bg-surface-page" : "bg-[#F0FAF4] border border-[#B8F5D0]"
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        notification.read ? "bg-surface-card text-text-muted" : "bg-[#D8E6DD] text-brand"
      }`}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div 
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onClick(notification)}
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm leading-tight truncate ${
            notification.read ? "font-semibold text-text-primary" : "font-bold text-brand"
          }`}>
            {notification.title}
          </h4>
          
          <span className="text-xs text-text-muted whitespace-nowrap shrink-0 mt-0.5">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        
        <p className={`text-sm mt-1 leading-snug ${
          notification.read ? "text-text-muted" : "text-text-primary font-medium"
        }`}>
          {notification.message}
        </p>
      </div>

      {/* Unread Dot (Visual Indicator) */}
      {!notification.read && (
        <div className="absolute top-5 left-2 w-2 h-2 rounded-full bg-brand" />
      )}
    </div>
  );
}

export default NotificationItem;
