import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Synchronous imports for critical paths and layout/context
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import { ScanProvider } from "../context/ScanContext";

// Lazy loaded pages
const Home = lazy(() => import("../pages/Home"));
const ScanWaste = lazy(() => import("../pages/ScanWaste"));
const AIResult = lazy(() => import("../pages/AIResult"));
const DisposalGuide = lazy(() => import("../pages/DisposalGuide"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Analytics = lazy(() => import("../pages/Analytics"));
const ScanHistory = lazy(() => import("../pages/ScanHistory"));
const ProfileSettings = lazy(() => import("../pages/ProfileSettings"));
const Rewards = lazy(() => import("../pages/Rewards"));
const Notifications = lazy(() => import("../pages/Notifications"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Analyzing = lazy(() => import("../pages/Analyzing"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const Learn = lazy(() => import("../pages/Learn"));
const LearningDetail = lazy(() => import("../pages/LearningDetail"));
const Goals = lazy(() => import("../pages/Goals"));
const Reports = lazy(() => import("../pages/Reports"));
const LocalResources = lazy(() => import("../pages/LocalResources"));

// Admin Components
const RoleRoute = lazy(() => import("../components/auth/RoleRoute"));
const AdminLayout = lazy(() => import("../admin/components/AdminLayout"));
const AdminDashboard = lazy(() => import("../admin/pages/AdminDashboard"));
const AdminUsers = lazy(() => import("../admin/pages/AdminUsers"));
const AdminFeedback = lazy(() => import("../admin/pages/AdminFeedback"));
const AdminRules = lazy(() => import("../admin/pages/AdminRules"));
const AdminSources = lazy(() => import("../admin/pages/AdminSources"));
const AdminSystem = lazy(() => import("../admin/pages/AdminSystem"));
const AdminSettings = lazy(() => import("../admin/pages/AdminSettings"));
const AdminLogs = lazy(() => import("../admin/pages/AdminLogs"));

// Global Loader for Suspense Fallback
const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <Loader2 size={32} className="animate-spin text-brand" />
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Home />} />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ScanProvider><Outlet /></ScanProvider>}>
            <Route path="/scan" element={<ScanWaste />} />
            <Route path="/analyzing" element={<Analyzing />} />
            <Route path="/result/:id" element={<AIResult />} />
          </Route>
          
          <Route path="/disposal-guide/:id" element={<DisposalGuide />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:slug" element={<LearningDetail />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/resources" element={<LocalResources />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <RoleRoute allowedRoles={["admin", "reviewer"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<RoleRoute allowedRoles={["admin"]}><AdminUsers /></RoleRoute>} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="rules" element={<AdminRules />} />
          <Route path="sources" element={<AdminSources />} />
          <Route path="system" element={<RoleRoute allowedRoles={["admin"]}><AdminSystem /></RoleRoute>} />
          <Route path="logs" element={<RoleRoute allowedRoles={["admin"]}><AdminLogs /></RoleRoute>} />
          <Route path="settings" element={<RoleRoute allowedRoles={["admin"]}><AdminSettings /></RoleRoute>} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
