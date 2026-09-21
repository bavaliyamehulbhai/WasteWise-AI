import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Trash2, Bell } from "lucide-react";
import NotificationItem from "../components/notifications/NotificationItem";
import Button from "../components/ui/Button";
import { getNotifications, markAllNotificationsRead, markNotificationRead, deleteNotification } from "../services/notificationService";
import EmptyState from "../components/common/EmptyState";

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadNotifications = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await getNotifications({ page: pageNum, limit: 10 });
      
      if (pageNum === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }
      
      setHasMore(pageNum < response.pagination.totalPages);
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotifications(nextPage);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationRead(notification._id);
        setNotifications(prev => prev.map(n => 
          n._id === notification._id ? { ...n, read: true } : n
        ));
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (notification.link) {
        navigate(notification.link);
      }
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-surface-page pb-10">
        <main className="px-5 py-6 lg:px-12 lg:py-10 max-w-[800px] mx-auto flex flex-col gap-4">
          <div className="w-48 h-8 rounded bg-[#D8E6DD] animate-pulse mb-4" />
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full h-[88px] rounded-xl bg-[#D8E6DD] animate-pulse opacity-50" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page pb-10">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 bg-surface-card border-b border-border-default px-5 py-4 flex flex-col gap-1 lg:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="text-text-muted hover:text-text-primary p-1 -ml-1 rounded transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="font-semibold text-text-primary">Notifications</span>
        </div>
      </div>

      <main className="px-5 py-6 lg:px-12 lg:py-10 max-w-[800px] mx-auto">
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary hidden lg:block">Notifications</h1>
            
            {notifications.some(n => !n.read) && (
              <button 
                onClick={handleMarkAllRead}
                className="text-sm font-semibold text-brand hover:text-brand-hover flex items-center gap-1.5 transition-colors"
              >
                <Check size={16} />
                Mark all as read
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-error-bg border border-error-text flex items-start gap-3">
              <div className="text-error-text font-semibold shrink-0">!</div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-error-text font-medium leading-relaxed">{error}</p>
                <button 
                  onClick={() => loadNotifications(page)}
                  className="text-sm font-bold text-error-text self-start"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {notifications.length === 0 && !error ? (
              <EmptyState 
                icon="notification"
                title="No notifications yet"
                description="We'll let you know when something important happens, like earning a new badge or completing a challenge."
              />
            ) : (
              notifications.map((notification) => (
                <div key={notification._id} className="relative group">
                  <NotificationItem 
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
                  <button 
                    onClick={(e) => handleDelete(notification._id, e)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 w-8 h-8 rounded-full bg-error-bg text-error-text flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#CC4444] hover:text-white"
                    aria-label="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleLoadMore} 
                disabled={loading}
                className="w-full lg:w-auto min-w-[200px]"
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Notifications;
