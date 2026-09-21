import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, BookOpen, Activity, FileText, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { label: "AI Feedback", path: "/admin/feedback", icon: <MessageSquare size={20} /> },
    { label: "Disposal Rules", path: "/admin/rules", icon: <BookOpen size={20} /> },
    { label: "Knowledge Base", path: "/admin/sources", icon: <FileText size={20} /> },
    { label: "System Health", path: "/admin/system", icon: <Activity size={20} /> },
    { label: "Audit Logs", path: "/admin/logs", icon: <FileText size={20} /> },
    { label: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen overflow-hidden bg-surface-background flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-surface-card border-r border-border-default flex flex-col hidden md:flex select-none">
        <div className="h-16 flex items-center px-6 border-b border-border-default shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">W</div>
            <span className="font-semibold text-text-primary text-lg">WasteWise OS</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-brand/10 text-brand" 
                    : "text-text-muted hover:bg-surface-page hover:text-text-primary"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-default shrink-0 space-y-2">
          <Link 
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-text-muted hover:bg-brand/10 hover:text-brand transition-colors"
          >
            <LayoutDashboard size={20} />
            Switch to User App
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-error-text hover:bg-error-bg transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="h-16 bg-surface-card border-b border-border-default flex items-center justify-between px-4 md:hidden">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">W</div>
            <span className="font-semibold text-text-primary">WasteWise OS</span>
          </Link>
          {/* Mobile menu toggle would go here */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-background">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
}
