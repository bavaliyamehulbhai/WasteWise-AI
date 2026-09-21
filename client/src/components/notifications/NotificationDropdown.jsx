import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import NotificationItem from "./NotificationItem";
import Button from "../ui/Button";
import { markNotificationRead } from "../../services/notificationService";

function NotificationDropdown({ notifications, onClose, onMarkAllRead }) {
  const navigate = useNavigate();

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationRead(notification._id);
        // We do not wait for optimistic UI update here to navigate quickly
      }
    } catch (error) {
      console.error(error);
    } finally {
      onClose(); // Close dropdown
      if (notification.link) {
        navigate(notification.link);
      }
    }
  };

  return (
    <div className="absolute top-[60px] right-0 w-[360px] bg-surface-card rounded-2xl shadow-xl border border-border-default overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-surface-page">
        <h3 className="font-bold text-text-primary">Notifications</h3>
        <button 
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors"
        >
          <Check size={14} />
          Mark all
        </button>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto p-2 flex flex-col gap-1">
        {notifications.length === 0 ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-surface-page rounded-full flex items-center justify-center text-text-muted mb-3">
              <Check size={24} />
            </div>
            <h4 className="text-sm font-bold text-text-primary mb-1">All caught up!</h4>
            <p className="text-xs text-text-muted leading-relaxed">We'll notify you when something important happens.</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <NotificationItem 
              key={notification._id} 
              notification={notification} 
              onClick={handleNotificationClick}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-border-default bg-surface-page">
          <Button 
            variant="outline" 
            className="w-full text-sm font-semibold border-none hover:bg-surface-card"
            onClick={() => {
              onClose();
              navigate("/notifications");
            }}
          >
            View all
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
