import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNavigation from "./BottomNavigation";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import FloatingChat from "../chat/FloatingChat";

const routeTitles = {
  "/": "Home",
  "/scan": "Scan Waste",
  "/dashboard": "Dashboard",
  "/history": "History",
  "/profile": "Profile & Settings",
};

function AppLayout({ children }) {
  const location = useLocation();
  
  // Basic logic to determine header state based on route
  const currentTitle = routeTitles[location.pathname] || "";
  const isLanding = ["/", "/home", "/landing"].includes(location.pathname);
  const isInnerPage = location.pathname !== "/dashboard";
  const isAuth = [
    "/login", 
    "/register", 
    "/forgot-password", 
    "/reset-password",
    "/onboarding"
  ].includes(location.pathname);

  const isAdmin = location.pathname.startsWith("/admin");

  if (isLanding || isAuth || isAdmin) {
    return <main className="min-h-screen bg-surface-page">{children}</main>;
  }

  return (
    <div className="w-full min-h-screen bg-surface-page relative flex flex-col md:flex-row overflow-x-hidden">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-surface-card focus:text-brand focus:font-semibold focus:outline-none focus:ring-2 focus:ring-brand focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Mobile Global Header */}
      <MobileHeader 
        title={isInnerPage ? currentTitle : ""}
        showLogo={!isInnerPage}
        showBack={isInnerPage && location.pathname !== "/dashboard" && location.pathname !== "/scan" && location.pathname !== "/history" && location.pathname !== "/profile"}
        showNotification={true}
      />

      {/* Desktop/Tablet Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[72px] lg:ml-[260px]">
        {/* Desktop Global Header */}
        <DesktopHeader title={currentTitle} />

        <main 
          id="main-content" 
          className="flex-1 px-4 md:px-6 lg:px-8 2xl:px-10 pt-4 pb-[88px] md:pb-8 lg:py-8 max-w-[1280px] w-full mx-auto" 
          tabIndex={-1}
        >
          <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {children}
          </div>
        </main>
      </div>

      {/* Floating AI Chat Widget */}
      <FloatingChat />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default AppLayout;
