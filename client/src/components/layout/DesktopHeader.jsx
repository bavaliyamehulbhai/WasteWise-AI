import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "../notifications/NotificationBell";
import { useAuth } from "../../context/AuthContext";
import GlobalSearch from "./GlobalSearch";

function DesktopHeader({ title = "" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const isDashboard = location.pathname === "/dashboard";

  return (
    <header className="hidden md:flex min-h-[72px] py-4 items-center justify-between px-6 lg:px-8 bg-surface-page/60 backdrop-blur-xl sticky top-0 z-40 mb-4 border-b border-border-default/30 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300">
      
      {/* Left: Welcome Message or Title */}
      <div className="flex-1 min-w-0">
        {isDashboard ? (
          <div>
            <h1 className="text-2xl font-semibold text-text-primary truncate">
              Welcome back, {user?.name || "there"}! <span role="img" aria-label="wave">👋</span>
            </h1>
            <p className="text-sm text-text-muted mt-1 truncate">
              Let's make a greener planet together.
            </p>
          </div>
        ) : (
          <h1 className="text-2xl font-semibold text-text-primary truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 shrink-0 ml-4">
        
        {/* Global Search Component */}
        <GlobalSearch />

        {/* Notification Wrapper */}
        <div className="relative">
          <NotificationBell />
        </div>

        {/* Profile Dropdown Trigger */}
        <button 
          onClick={() => navigate('/profile')}
          aria-label="Profile and settings"
          className="flex items-center gap-2 bg-element-bg border border-element-border rounded-full p-1 pr-3 hover:bg-element-border/50 transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <div className="w-8 h-8 rounded-full bg-success-bg flex items-center justify-center text-brand font-semibold text-sm overflow-hidden">
            {user?.avatar && user.avatar.startsWith('http') ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userInitial
            )}
          </div>
          <ChevronDown size={16} className="text-text-muted" />
        </button>
      </div>
    </header>
  );
}

export default DesktopHeader;
