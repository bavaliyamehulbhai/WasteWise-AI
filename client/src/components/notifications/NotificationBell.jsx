import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications, getUnreadNotificationCount, markAllNotificationsRead } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();
  
  const dropdownRef = useRef(null);

  const loadData = async () => {
    try {
      const [countRes, notifsRes] = await Promise.all([
        getUnreadNotificationCount(),
        getNotifications({ limit: 5 })
      ]);
      setUnreadCount(countRes.count);
      setNotifications(notifsRes.notifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${unreadCount} unread notifications`}
        aria-expanded={isOpen}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          isOpen ? "bg-[#D8E6DD] text-brand" : "bg-element-bg text-text-muted hover:text-text-primary hover:bg-element-border/50 shadow-sm border border-element-border"
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface-card shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown 
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAllRead={handleMarkAllRead}
        />
      )}
    </div>
  );
}

export default NotificationBell;
