import { Recycle } from "lucide-react";
import { Link } from "react-router-dom";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-card flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Header (Hidden on Desktop) */}
      <header className="lg:hidden p-4 flex items-center gap-2">
        <Link to="/" className="w-8 h-8 rounded-lg bg-success-bg flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          <Recycle className="w-[18px] h-[18px] text-brand" />
        </Link>
        <Link to="/" className="font-semibold text-text-primary text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1">
          WasteWise
        </Link>
      </header>

      {/* Desktop Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-page border-r border-border-default flex-col p-12 relative overflow-hidden">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl p-2 -ml-2">
          <div className="w-10 h-10 rounded-xl bg-success-bg flex items-center justify-center shrink-0">
            <Recycle className="w-6 h-6 text-brand" />
          </div>
          <span className="font-semibold text-text-primary text-xl">WasteWise</span>
        </Link>

        {/* Marketing Copy */}
        <div className="mt-auto mb-auto max-w-[420px]">
          <h1 className="text-[40px] leading-tight font-semibold text-text-primary mb-4">
            Identify waste.<br/>Dispose better.
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            AI-powered waste identification and disposal guidance for a more sustainable future.
          </p>
        </div>

        {/* Subtle Decorative Elements (Optional) */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-success-bg rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      </div>

      {/* Right Auth Panel (Mobile & Desktop) */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 lg:px-12 relative z-10">
        <main className="w-full max-w-[440px] mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

export default AuthLayout;
