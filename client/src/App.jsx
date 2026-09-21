import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";

import OfflineBanner from "./components/common/OfflineBanner";

function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Remove the initial splash screen loader when React is ready
    const loader = document.getElementById("initial-loader");
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        setTimeout(() => loader.remove(), 500);
      }, 300); // slight delay for smooth transition
    }

    if (user?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [user?.darkMode]);

  return (
    <BrowserRouter>
      <OfflineBanner />
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;