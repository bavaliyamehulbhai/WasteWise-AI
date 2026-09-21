import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.status === "suspended" && !allowedRoles.includes("admin")) {
    return <Navigate to="/suspended" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Better UX is to show a 403 or redirect to home with an error toast
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
