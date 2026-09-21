import {
  LayoutDashboard,
  ScanLine,
  History,
  BarChart3,
  Users,
  BookOpen,
  Trophy,
  Medal,
  Target,
  User,
  Settings,
  Recycle,
  MapPin,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", group: "main" },
  { label: "Scan Waste", icon: ScanLine, path: "/scan", group: "main" },
  { label: "Scan History", icon: History, path: "/history", group: "main" },
  { label: "Analytics", icon: BarChart3, path: "/analytics", group: "main" },
  { label: "Learning Center", icon: BookOpen, path: "/learn", group: "gamification" },
  { label: "Goals", icon: Target, path: "/goals", group: "gamification" },
  { label: "Rewards", icon: Trophy, path: "/rewards", group: "gamification" },
  { label: "Local Resources", icon: MapPin, path: "/resources", group: "gamification" },
  { label: "Monthly Reports", icon: Medal, path: "/reports", group: "account" },
  { label: "Profile & Settings", icon: User, path: "/profile", group: "account" },
];

function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen border-r border-border-default bg-[#0B2117] transition-all duration-300 md:w-[72px] lg:w-[260px] z-50">
      
      {/* Branding */}
      <Link to="/dashboard" title="WasteWise AI Dashboard" className="flex items-center justify-center lg:justify-start lg:px-6 py-6 lg:gap-3 shrink-0 hover:opacity-90 transition-opacity">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-brand flex items-center justify-center shadow-sm">
          <Recycle className="w-5 h-5 text-white" />
        </div>
        <div className="hidden lg:block">
          <h1 className="font-semibold text-white tracking-tight">
            WasteWise AI
          </h1>
          <p className="text-[10px] text-white/60">
            Scan Today. Cleaner Tomorrow.
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-4 lg:space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent">
        
        <div>
          <p className="hidden lg:block px-3 text-[10px] font-semibold text-white/50 mb-2 uppercase tracking-wider">
            Main
          </p>
          <div className="flex flex-col gap-1">
            {navigation.filter(item => item.group === "main").map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex items-center justify-center lg:justify-start gap-3 rounded-xl p-2 lg:px-3 lg:py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0 ${isActive ? "bg-brand text-white font-semibold shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white"}`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="hidden lg:block">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div>
          <p className="hidden lg:block px-3 text-[10px] font-semibold text-white/50 mb-2 uppercase tracking-wider">
            Discover
          </p>
          <div className="flex flex-col gap-1">
            {navigation.filter(item => item.group === "gamification").map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex items-center justify-center lg:justify-start gap-3 rounded-xl p-2 lg:px-3 lg:py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0 ${isActive ? "bg-brand text-white font-semibold shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white"}`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="hidden lg:block">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div>
          <p className="hidden lg:block px-3 text-[10px] font-semibold text-white/50 mb-2 uppercase tracking-wider">
            Account
          </p>
          <div className="flex flex-col gap-1">
            {navigation.filter(item => item.group === "account").map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex items-center justify-center lg:justify-start gap-3 rounded-xl p-2 lg:px-3 lg:py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0 ${isActive ? "bg-brand text-white font-semibold shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white"}`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="hidden lg:block">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Admin Section (Conditional) */}
        {(user?.role === "admin" || user?.role === "reviewer") && (
          <div>
            <p className="hidden lg:block px-3 text-[10px] font-semibold text-brand mb-2 uppercase tracking-wider mt-1">
              Operations
            </p>
            <div className="flex flex-col gap-1">
              <NavLink
                to="/admin"
                title="Admin Portal"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start gap-3 rounded-xl p-2 lg:px-3 lg:py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0 ${isActive ? "bg-brand text-white font-semibold shadow-sm" : "text-brand hover:bg-brand/10 hover:text-white"}`
                }
              >
                <Settings size={18} className="shrink-0" />
                <span className="hidden lg:block">Admin Portal</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Environmental CTA */}
      <div className="hidden lg:block p-3 mt-1 shrink-0">
        <div className="bg-[#113224] rounded-2xl p-3 border border-white/5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">🌍</span>
            <h4 className="text-white text-[13px] font-semibold leading-tight">Cleaner Tomorrow</h4>
          </div>
          <p className="text-white/60 text-[11px] mb-2 leading-relaxed">Keep scanning to make an impact!</p>
          <button className="w-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors">
            View Impact
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
