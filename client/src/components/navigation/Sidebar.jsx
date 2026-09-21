import {
  Home,
  ScanLine,
  LayoutDashboard,
  History,
  UserRound,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

const navItems = [
  {
    label: "Home",
    path: "/home",
    icon: Home,
  },
  {
    label: "Scan Waste",
    path: "/scan",
    icon: ScanLine,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Scan History",
    path: "/history",
    icon: History,
  },
];

function Sidebar() {
  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        hidden
        w-[240px]
        border-r
        border-border-default
        bg-surface-card
        lg:flex
        lg:flex-col
      "
    >

      {/* Logo */}
      <div className="px-5 py-6">

        <div className="flex items-center gap-3">

          <div className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-success-bg
            text-brand
          ">
            ♻
          </div>

          <div>
            <p className="text-base font-semibold text-text-primary">
              WasteWise
            </p>

            <p className="text-[10px] font-medium text-brand">
              AI
            </p>
          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">

        <div className="space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex
                  h-11
                  items-center
                  gap-3
                  rounded-[12px]
                  px-3
                  text-sm
                  font-medium
                  transition
                  ${
                    isActive
                      ? `
                        bg-success-bg
                        text-success-text
                      `
                      : `
                        text-text-muted
                        hover:bg-surface-page
                        hover:text-brand-hover
                      `
                  }
                  `
                }
              >

                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-brand"
                          : "text-current"
                      }
                    />

                    <span>
                      {item.label}
                    </span>
                  </>
                )}

              </NavLink>
            );
          })}

        </div>

      </nav>

      {/* Profile */}
      <div className="border-t border-[#EEF3F0] p-4">

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `
            flex
            items-center
            gap-3
            rounded-[12px]
            p-2
            transition
            ${
              isActive
                ? "bg-success-bg"
                : "hover:bg-surface-page"
            }
            `
          }
        >

          <div className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-success-bg
            text-xs
            font-semibold
            text-success-text
          ">
            MB
          </div>

          <div className="min-w-0">

            <p className="truncate text-xs font-semibold text-text-primary">
              Mehul Bavaliya
            </p>

            <p className="text-[10px] text-text-muted">
              Personal account
            </p>

          </div>

        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;
