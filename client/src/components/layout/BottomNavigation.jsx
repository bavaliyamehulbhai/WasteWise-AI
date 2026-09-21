import {
  LayoutDashboard,
  ScanLine,
  History,
  UserRound,
  BarChart3,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Scan",
    icon: ScanLine,
    path: "/scan",
    isPrimary: true,
  },
  {
    label: "History",
    icon: History,
    path: "/history",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    label: "Profile",
    icon: UserRound,
    path: "/profile",
  },
];

function BottomNavigation() {
  const location = useLocation();

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0 z-50
        h-[72px] bg-surface-card/80 backdrop-blur-xl border-t border-border-default/50
        flex items-center justify-around
        pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.02)]
        transition-all duration-300
      "
      aria-label="Mobile navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        if (item.isPrimary) {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-1 text-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-xl p-1 -mt-4 transition"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[4px] border-surface-page shadow-sm transition-colors ${isActive ? 'bg-brand-hover' : 'bg-brand'}`}>
                <Icon size={24} className="text-white" />
              </div>
              <span className={`font-semibold ${isActive ? "text-brand" : "text-text-muted"}`}>{item.label}</span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            aria-current={isActive ? "page" : undefined}
            className={`
              flex flex-col items-center gap-1 text-[10px] w-16
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg p-1 transition
              ${isActive ? "text-brand font-semibold" : "text-text-muted hover:text-brand"}
            `}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-success-bg' : 'bg-transparent'}`}>
              <Icon size={20} />
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
