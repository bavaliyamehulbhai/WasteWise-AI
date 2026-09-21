import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-surface-card rounded-full border border-border-default flex items-center justify-center shadow-sm mb-6">
        <AlertTriangle className="text-brand w-10 h-10" />
      </div>
      <h1 className="text-4xl font-bold text-text-primary mb-3">404</h1>
      <h2 className="text-xl font-semibold text-text-primary mb-4">Page not found</h2>
      <p className="text-text-muted max-w-sm mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        to="/dashboard"
        className="bg-brand text-white font-semibold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
