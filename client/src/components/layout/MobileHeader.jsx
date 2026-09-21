import { Recycle, Bell, ArrowLeft, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NotificationBell from "../notifications/NotificationBell";

function MobileHeader({ 
  title, 
  showBack = false, 
  showNotification = true, 
  showLogo = true,
  showMenu = false,
}) {
  const navigate = useNavigate();

  return (
    <header className="md:hidden h-16 px-4 bg-surface-card/60 backdrop-blur-xl sticky top-0 z-40 border-b border-border-default/50 shadow-sm flex items-center justify-between transition-all duration-300">
      
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-text-primary hover:bg-surface-page transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {showMenu && !showBack && (
          <button 
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-text-primary hover:bg-surface-page transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Open menu"
            aria-expanded="false"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {showLogo && !title && (
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
              <Recycle className="w-[18px] h-[18px] text-white" />
            </div>
            <h1 className="font-semibold text-text-primary text-lg tracking-tight">
              WasteWise AI
            </h1>
          </Link>
        )}

        {title && (
          <h1 className="font-semibold text-text-primary text-lg truncate">
            {title}
          </h1>
        )}
      </div>

      {showNotification && (
        <div className="shrink-0 ml-3 relative">
          <NotificationBell />
        </div>
      )}

    </header>
  );
}

export default MobileHeader;
