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

const items = [
  {
    label: "Home",
    path: "/home",
    icon: Home,
  },
  {
    label: "Scan",
    path: "/scan",
    icon: ScanLine,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "History",
    path: "/history",
    icon: History,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
];

function BottomNavigation() {
  return (
    <nav
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        border-t
        border-border-default
        bg-surface-card/95
        backdrop-blur
        lg:hidden
      "
    >

      <div
        className="
          mx-auto
          flex
          h-16
          max-w-lg
          items-center
          justify-around
          px-1
        "
      >

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex h-full flex-1 items-center justify-center"
            >

              {({ isActive }) => (
                <div
                  className={`
                    flex
                    min-w-[52px]
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    rounded-[10px]
                    px-1
                    py-1
                    ${
                      isActive
                        ? "text-success-text"
                        : "text-text-muted"
                    }
                  `}
                >

                  <Icon
                    size={19}
                    strokeWidth={
                      isActive ? 2.4 : 2
                    }
                  />

                  <span
                    className={`
                      text-[10px]
                      ${
                        isActive
                          ? "font-semibold"
                          : "font-medium"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                </div>
              )}

            </NavLink>
          );
        })}

      </div>

    </nav>
  );
}

export default BottomNavigation;
